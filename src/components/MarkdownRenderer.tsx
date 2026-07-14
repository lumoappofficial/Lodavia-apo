import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface MarkdownRendererProps {
  text: string;
  fontSizeClass?: string; // e.g. text-xs, text-sm, text-base
}

export default function MarkdownRenderer({ text, fontSizeClass = "text-xs" }: MarkdownRendererProps) {
  // Simple custom Markdown parser that handles headers, bullets, bold, inline code, and block code
  if (!text) return null;

  // Split by code blocks first
  const parts = text.split(/(```[\s\S]*?```)/g);

  const copyToClipboard = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code);
    const btn = document.getElementById(blockId);
    if (btn) {
      btn.innerHTML = `<span class="text-emerald-400 flex items-center gap-1">✓ Copied</span>`;
      setTimeout(() => {
        btn.innerHTML = `<span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy Code</span>`;
      }, 2000);
    }
  };

  // Simple code highlighter that applies colors to typescript/js/python/html/css code
  const highlightCode = (code: string, language: string) => {
    const escapeHtml = (raw: string) => {
      return raw
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    };

    let html = escapeHtml(code);
    if (!language) return html;

    const langLower = language.toLowerCase();

    // 1. Comments: // ... or # ...
    if (langLower === "python" || langLower === "bash" || langLower === "yaml" || langLower === "toml") {
      html = html.replace(/(#.*)/g, '<span class="text-slate-500 italic">$1</span>');
    } else {
      html = html.replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="text-slate-500 italic">$1</span>');
    }

    // 2. Strings: "..." or '...' or `...`
    html = html.replace(/(["'`][\s\S]*?["'`])/g, '<span class="text-emerald-400 font-mono">$1</span>');

    // 3. Keywords
    const keywords = /\b(const|let|var|function|return|class|export|import|from|default|extends|if|else|switch|case|break|continue|for|while|do|try|catch|finally|async|await|new|this|typeof|instanceof|public|private|protected|interface|type|enum|as|any|string|number|boolean|void|def|import|as|from|print|self|None|True|False|import|try|except|with|as|for|in|while|return|lambda|and|or|not)\b/g;
    html = html.replace(keywords, '<span class="text-pink-400 font-bold">$1</span>');

    // 4. Numbers
    html = html.replace(/\b(\d+)\b/g, '<span class="text-amber-300 font-mono">$1</span>');

    // 5. Functions: name()
    html = html.replace(/\b(\w+)(?=\()/g, '<span class="text-cyan-300">$1</span>');

    return html;
  };

  const renderTextWithFormatting = (line: string) => {
    let result = line;
    // Replace markdown bold **text** with strong tag
    result = result.replace(/\*\*([\s\S]*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    // Replace markdown inline code `code` with code tag
    result = result.replace(/`([^`]+)`/g, '<code class="bg-black/40 px-1.5 py-0.5 rounded text-pink-300 font-mono text-[11px] border border-white/5">$1</code>');
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <div className={`space-y-2.5 font-sans leading-relaxed text-slate-100 ${fontSizeClass}`}>
      {parts.map((part, index) => {
        // Is this part a code block?
        if (part.startsWith("```")) {
          const lines = part.split("\n");
          const firstLine = lines[0]; // should contain language
          const language = firstLine.replace("```", "").trim() || "code";
          const codeContent = lines.slice(1, lines.length - 1).join("\n");
          const blockId = `code-block-${index}-${Date.now()}`;

          return (
            <div key={index} className="my-3.5 rounded-xl border border-white/10 bg-[#07070d]/95 overflow-hidden shadow-2xl">
              {/* Header block bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900/60 border-b border-white/5 text-[10px] text-slate-400 select-none">
                <span className="flex items-center gap-1.5 uppercase font-bold tracking-wider text-cyan-400 font-mono">
                  <Terminal className="w-3.5 h-3.5" />
                  {language}
                </span>
                <button
                  id={blockId}
                  onClick={() => copyToClipboard(codeContent, blockId)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Code</span>
                </button>
              </div>
              {/* Highlighted code block */}
              <pre className="p-4 overflow-x-auto text-[11px] font-mono leading-relaxed max-h-[400px] scrollbar-thin scrollbar-thumb-white/10 text-slate-100">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(codeContent, language),
                  }}
                />
              </pre>
            </div>
          );
        }

        // Standard text with lines
        const lines = part.split("\n");
        return (
          <div key={index} className="space-y-1.5 whitespace-pre-wrap">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();

              // Headers: ###, ##, #
              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={lineIdx} className="text-sm font-bold text-cyan-300 mt-3 mb-1 tracking-wide flex items-center gap-1">
                    <span className="text-purple-500 font-mono">■</span>
                    {renderTextWithFormatting(trimmed.substring(4))}
                  </h4>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={lineIdx} className="text-base font-black text-white mt-4 mb-1.5 border-b border-white/5 pb-1 tracking-wider">
                    {renderTextWithFormatting(trimmed.substring(3))}
                  </h3>
                );
              }
              if (trimmed.startsWith("# ")) {
                return (
                  <h2 key={lineIdx} className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 mt-5 mb-2">
                    {renderTextWithFormatting(trimmed.substring(2))}
                  </h2>
                );
              }

              // Bullets: - or *
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2 my-1 text-slate-200">
                    <span className="text-purple-400 select-none mt-1.5 text-[8px]">●</span>
                    <span className="flex-1">{renderTextWithFormatting(trimmed.substring(2))}</span>
                  </div>
                );
              }

              // Normal paragraph line
              if (line === "") {
                return <div key={lineIdx} className="h-2" />;
              }

              return (
                <p key={lineIdx} className="text-slate-200 leading-relaxed font-sans">
                  {renderTextWithFormatting(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
