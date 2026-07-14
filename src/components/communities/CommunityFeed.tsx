import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Plus, 
  Trash2, 
  Pin, 
  Megaphone, 
  AlertTriangle,
  Sparkles, 
  Send,
  Loader2,
  BookmarkCheck
} from "lucide-react";
import { AppUser, CommunityItem, Post } from "../../types";

interface ExtendedPost extends Post {
  isPoll?: boolean;
  pollQuestion?: string;
  pollOptions?: Array<{ text: string; votes: number; votedBy: string[] }>;
  isPinned?: boolean;
  isAnnouncement?: boolean;
  isReported?: boolean;
}

interface CommunityFeedProps {
  currentUser: AppUser;
  lang: "ar" | "en";
  activeCommunity: CommunityItem;
  setCommunities: React.Dispatch<React.SetStateAction<CommunityItem[]>>;
  setActiveCommunity: (comm: CommunityItem | null) => void;
  playSynthSound: (frequency: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', duration?: number) => void;
  simulateAdmin: boolean;
}

export default function CommunityFeed({
  currentUser,
  lang,
  activeCommunity,
  setCommunities,
  setActiveCommunity,
  playSynthSound,
  simulateAdmin
}: CommunityFeedProps) {
  // Input fields for creator
  const [postType, setPostType] = useState<"text" | "poll">("text");
  const [postContentText, setPostContentText] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [postMediaUrl, setPostMediaUrl] = useState("");
  const [postMediaType, setPostMediaType] = useState<"none" | "image" | "video">("none");
  const [isNewAnnouncement, setIsNewAnnouncement] = useState(false);

  // Pagination / Slicing (Infinite scrolling mock)
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // AI Highlights
  const [aiHighlight, setAiHighlight] = useState<string | null>(null);
  const [aiHighlightLoading, setAiHighlightLoading] = useState(false);

  // Active comments drawer
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  const posts = (activeCommunity.posts as ExtendedPost[]) || [];

  // Sort: Pinned posts first, then regular posts by date
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0; // maintain default order
  });

  const visiblePosts = sortedPosts.slice(0, visibleCount);

  // Handlers
  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, ""]);
      playSynthSound(500, "sine", 0.05);
    }
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
      playSynthSound(400, "sine", 0.05);
    }
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();

    let newPost: ExtendedPost;
    if (postType === "poll") {
      if (!pollQuestion.trim() || pollOptions.some(o => !o.trim())) return;
      newPost = {
        id: `post_${Date.now()}`,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        authorTitle: lang === "ar" ? "رائد فضاء • كاتب" : "Cosmic Writer",
        content: pollQuestion,
        timestamp: lang === "ar" ? "الآن" : "Just now",
        likes: 0,
        commentsCount: 0,
        comments: [],
        isPoll: true,
        pollQuestion,
        pollOptions: pollOptions.filter(o => o.trim()).map(o => ({
          text: o,
          votes: 0,
          votedBy: []
        })),
        isPinned: false,
        isAnnouncement: simulateAdmin && isNewAnnouncement,
        likedByMe: false,
        savedByMe: false
      };
    } else {
      if (!postContentText.trim() && !postMediaUrl.trim()) return;
      newPost = {
        id: `post_${Date.now()}`,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        authorTitle: lang === "ar" ? "رائد فضاء • كاتب" : "Cosmic Writer",
        content: postContentText,
        timestamp: lang === "ar" ? "الآن" : "Just now",
        likes: 0,
        commentsCount: 0,
        comments: [],
        image: postMediaType === "image" && postMediaUrl ? postMediaUrl : undefined,
        video: postMediaType === "video" && postMediaUrl ? postMediaUrl : undefined,
        isPinned: false,
        isAnnouncement: simulateAdmin && isNewAnnouncement,
        likedByMe: false,
        savedByMe: false
      };
    }

    const updatedPosts = [newPost, ...posts];
    updateCommunityPosts(updatedPosts);

    // Reset fields
    setPostContentText("");
    setPollQuestion("");
    setPollOptions(["", ""]);
    setPostMediaUrl("");
    setPostMediaType("none");
    setIsNewAnnouncement(false);

    playSynthSound(800, "sine", 0.15);
  };

  const handleVotePoll = (postId: string, optionIdx: number) => {
    const updated = posts.map(post => {
      if (post.id === postId && post.isPoll && post.pollOptions) {
        // Prevent double voting
        const hasVoted = post.pollOptions.some(o => o.votedBy.includes(currentUser.id));
        if (hasVoted) return post;

        const options = post.pollOptions.map((opt, idx) => {
          if (idx === optionIdx) {
            return {
              ...opt,
              votes: opt.votes + 1,
              votedBy: [...opt.votedBy, currentUser.id]
            };
          }
          return opt;
        });

        return { ...post, pollOptions: options };
      }
      return post;
    });

    updateCommunityPosts(updated);
    playSynthSound(950, "sine", 0.08);
  };

  const handleLikePost = (postId: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        const liked = !post.likedByMe;
        return {
          ...post,
          likedByMe: liked,
          likes: liked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    });

    updateCommunityPosts(updated);
    playSynthSound(600, "sine", 0.08);
  };

  const handleSavePost = (postId: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          savedByMe: !post.savedByMe
        };
      }
      return post;
    });

    updateCommunityPosts(updated);
    playSynthSound(700, "sine", 0.08);
  };

  const handleSharePost = (postId: string) => {
    const deepLink = `${window.location.origin}/community/${activeCommunity.id}/post/${postId}`;
    navigator.clipboard.writeText(deepLink);
    playSynthSound(1000, "sine", 0.1);
    alert(lang === "ar" ? "🪐 تم نسخ رابط المنشور بنجاح!" : "🪐 Post deep link copied successfully!");
  };

  const handleAddComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      id: `comment_${Date.now()}`,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content: commentInput.trim(),
      timestamp: lang === "ar" ? "الآن" : "Just now"
    };

    const updated = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [...(post.comments || []), newComment]
        };
      }
      return post;
    });

    updateCommunityPosts(updated);
    setCommentInput("");
    playSynthSound(600, "sine", 0.1);
  };

  // Moderation Controls
  const handleTogglePin = (postId: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isPinned: !post.isPinned
        };
      }
      return post;
    });
    updateCommunityPosts(updated);
    playSynthSound(783.99, "sine", 0.1);
  };

  const handleToggleAnnouncement = (postId: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isAnnouncement: !post.isAnnouncement
        };
      }
      return post;
    });
    updateCommunityPosts(updated);
    playSynthSound(659.25, "sine", 0.1);
  };

  const handleRemovePost = (postId: string) => {
    if (confirm(lang === "ar" ? "هل أنت متأكد من رغبتك في حذف هذا المنشور؟" : "Are you sure you want to delete this post?")) {
      const updated = posts.filter(post => post.id !== postId);
      updateCommunityPosts(updated);
      playSynthSound(440, "sawtooth", 0.12);
    }
  };

  const handleReportPost = (postId: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isReported: true
        };
      }
      return post;
    });
    updateCommunityPosts(updated);
    playSynthSound(300, "triangle", 0.15);
    alert(lang === "ar" ? "⚠️ تم تسجيل إبلاغك وسيراجعه المشرفون فوراً!" : "⚠️ Report registered. Moderators will review it immediately!");
  };

  const updateCommunityPosts = (newPosts: ExtendedPost[]) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === activeCommunity.id) {
        return { ...c, posts: newPosts };
      }
      return c;
    }));
    setActiveCommunity({
      ...activeCommunity,
      posts: newPosts
    });
  };

  // Mock loading more posts
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    playSynthSound(440, "sine", 0.05);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setIsLoadingMore(false);
    }, 800);
  };

  // Generate AI highlights of current community posts
  const generateHighlights = async () => {
    setAiHighlightLoading(true);
    playSynthSound(880, "sine", 0.15);
    try {
      const texts = posts.map(p => p.content).join("\n");
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: texts || "No discussions present in this community channel.",
          lang
        })
      });
      const data = await response.json();
      setAiHighlight(data.text || "Highlights processed.");
      playSynthSound(1318.51, "sine", 0.25);
    } catch (e) {
      // Offline fallback
      setAiHighlight(
        lang === "ar"
          ? "✨ ملخص الذكاء الاصطناعي لودافيا:\nيركز المجتمع حالياً على مراجعة تحديثات React 19 والبدء في مشاركة مبادئ Clean Code المتقدمة. هناك نقاش واعد وتفاعل ممتاز من الأعضاء حول غرف الصوت الكونية."
          : "✨ Lodavia AI Core Summary:\nThe community is heavily discussing React 19 updates, form integrations, and clean code principles. Significant interest is growing in the upcoming hackathon and live spatial audio salons."
      );
    } finally {
      setAiHighlightLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      
      {/* AI HIGHLIGHTS INITIATOR BANNER */}
      <div className="glass-panel p-5 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/5 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <h4 className="text-xs font-black text-white">{lang === "ar" ? "أبرز نقاشات المجتمع بالذكاء الاصطناعي 🧠" : "AI Generated Spotlights 🧠"}</h4>
              <p className="text-[10px] text-slate-400">{lang === "ar" ? "احصل على ملخص شامل لأحدث حوارات ومنشورات الأعضاء بضغطة واحدة" : "Get a condensed summary of recent community trends"}</p>
            </div>
          </div>
          <button
            onClick={generateHighlights}
            disabled={aiHighlightLoading}
            className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[10px] rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
          >
            {aiHighlightLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{lang === "ar" ? "توليد النقاط" : "Spotlight"}</span>
          </button>
        </div>

        <AnimatePresence>
          {aiHighlight && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/5 pt-3.5 mt-1 text-[11px] text-slate-200 leading-relaxed whitespace-pre-line bg-black/30 p-3 rounded-2xl border border-white/5 font-sans"
            >
              {aiHighlight}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* POST CREATOR FORM */}
      {currentUser.joinedCommunities.includes(activeCommunity.id) && (
        <form onSubmit={handlePublishPost} className="glass-panel p-5 rounded-3xl border border-white/5 flex flex-col gap-4 bg-gradient-to-br from-slate-900/60 to-purple-950/20 shadow-md">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{lang === "ar" ? "انشر شيئاً في المجتمع ✍️" : "Share a thought with others ✍️"}</span>
            
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => { playSynthSound(500, "sine", 0.04); setPostType("text"); }}
                className={`py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${postType === "text" ? "bg-purple-600/30 text-purple-200 border border-purple-500/40" : "text-slate-400 hover:text-white"}`}
              >
                📝 {lang === "ar" ? "منشور عادي" : "Post"}
              </button>
              <button
                type="button"
                onClick={() => { playSynthSound(500, "sine", 0.04); setPostType("poll"); }}
                className={`py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${postType === "poll" ? "bg-purple-600/30 text-purple-200 border border-purple-500/40" : "text-slate-400 hover:text-white"}`}
              >
                📊 {lang === "ar" ? "استطلاع رأي" : "Poll"}
              </button>
            </div>
          </div>

          {postType === "poll" ? (
            <div className="space-y-3 animate-[fadeIn_0.2s_ease-out]">
              <input
                type="text"
                required
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder={lang === "ar" ? "ما هو سؤال الاستطلاع الكوني؟" : "What is the cosmic poll question?"}
                className="w-full py-2.5 px-4 rounded-xl bg-black/40 text-xs text-white border border-white/5 focus:border-purple-500/40 focus:outline-none placeholder-slate-600"
              />
              <div className="space-y-2">
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const next = [...pollOptions];
                        next[idx] = e.target.value;
                        setPollOptions(next);
                      }}
                      placeholder={(lang === "ar" ? "خيار استطلاع " : "Poll Option ") + (idx + 1)}
                      className="flex-1 py-2 px-3 rounded-xl bg-black/20 text-xs text-white border border-white/5 focus:outline-none placeholder-slate-600"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePollOption(idx)}
                        className="text-red-500 hover:text-red-400 p-1 font-bold text-xs shrink-0 cursor-pointer"
                      >
                        {lang === "ar" ? "حذف" : "Remove"}
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="text-cyan-400 hover:text-cyan-300 text-[10px] font-bold block pt-1 cursor-pointer"
                  >
                    + {lang === "ar" ? "إضافة خيار إضافي" : "Add alternative option"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-[fadeIn_0.2s_ease-out]">
              <textarea
                value={postContentText}
                onChange={(e) => setPostContentText(e.target.value)}
                placeholder={lang === "ar" ? "اكتب أفكارك ومشاريعك الملهمة..." : "Draft some innovative thoughts or projects..."}
                className="w-full h-20 p-3 rounded-xl bg-black/40 text-xs text-white border border-white/5 focus:border-purple-500/40 focus:outline-none placeholder-slate-600 resize-none"
              />
              
              {/* Media Attach Options */}
              <div className="flex flex-col gap-2 p-2.5 bg-black/20 rounded-xl border border-white/5">
                <div className="flex gap-4 items-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{lang === "ar" ? "إرفاق وسائط:" : "Attach Media:"}</span>
                  <div className="flex gap-2">
                    {["none", "image", "video"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPostMediaType(type as any)}
                        className={`py-1 px-2.5 rounded text-[9px] font-black cursor-pointer uppercase ${
                          postMediaType === type ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {postMediaType !== "none" && (
                  <input
                    type="url"
                    value={postMediaUrl}
                    onChange={(e) => setPostMediaUrl(e.target.value)}
                    placeholder={lang === "ar" ? "ألصق رابط الصورة أو الفيديو الكوني..." : "Paste secure image or video URL..."}
                    className="w-full py-1.5 px-3 bg-black/40 text-[10px] text-white border border-white/5 rounded focus:outline-none"
                  />
                )}
              </div>
            </div>
          )}

          {/* Simulate Announcement Checkbox for Admin */}
          {simulateAdmin && (
            <div className="flex items-center gap-2 mt-1">
              <input 
                type="checkbox" 
                id="annCheck" 
                checked={isNewAnnouncement} 
                onChange={(e) => setIsNewAnnouncement(e.target.checked)}
                className="rounded border-white/10 bg-slate-900 text-purple-600 focus:ring-0" 
              />
              <label htmlFor="annCheck" className="text-[10px] font-bold text-orange-400 flex items-center gap-1">
                <Megaphone className="w-3.5 h-3.5" />
                {lang === "ar" ? "نشر كإعلان رسمي للمجتمع" : "Publish as official announcement"}
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all active:scale-95 shadow-lg shadow-purple-600/15 cursor-pointer mt-2"
          >
            🚀 {lang === "ar" ? "نشر المنشور الكوني" : "Broadcast to Feed"}
          </button>
        </form>
      )}

      {/* FEED POSTS LIST */}
      <div className="space-y-4">
        {visiblePosts.map((post) => (
          <div
            key={post.id}
            className={`glass-panel p-5 rounded-3xl border flex flex-col gap-4 bg-slate-900/30 hover:border-purple-500/10 transition-all duration-300 relative ${
              post.isPinned ? "border-purple-500/30 bg-purple-950/5" : "border-white/5"
            } ${
              post.isAnnouncement ? "border-orange-500/25 bg-orange-950/5 shadow-[0_0_15px_rgba(249,115,22,0.04)]" : ""
            }`}
          >
            {/* Announcement banner indicators */}
            {post.isAnnouncement && (
              <div className="absolute top-3 right-5 flex items-center gap-1 text-[9px] font-black text-orange-400 tracking-wider bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                <Megaphone className="w-3 h-3" />
                {lang === "ar" ? "إعلان مجتمعي هام" : "Official Announcement"}
              </div>
            )}

            {/* Header info */}
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-center gap-3">
                <img src={post.authorAvatar} alt="author" className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black text-slate-200 leading-none block">{post.authorName}</span>
                    {post.isPinned && (
                      <span className="text-[8px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded font-black flex items-center gap-0.5 uppercase tracking-wide">
                        <Pin className="w-2.5 h-2.5 text-purple-400" />
                        {lang === "ar" ? "مثبت" : "Pinned"}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 font-bold block mt-0.5">{post.authorTitle || (lang === "ar" ? "عضو كوني" : "Galaxy Pilot")} • {post.timestamp}</span>
                </div>
              </div>

              {/* REPORT & MODERATION ACTION DROPDOWN */}
              <div className="flex gap-1.5 items-center">
                {post.isReported && (
                  <span className="text-[8px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded font-black flex items-center gap-0.5 uppercase tracking-wider animate-pulse">
                    <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                    {lang === "ar" ? "مبلغ عنه" : "Reported"}
                  </span>
                )}

                {simulateAdmin ? (
                  <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                    <button
                      onClick={() => handleTogglePin(post.id)}
                      className={`p-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${post.isPinned ? "bg-purple-600/30 text-purple-300" : "text-slate-500 hover:text-white"}`}
                      title={post.isPinned ? (lang === "ar" ? "إلغاء التثبيت" : "Unpin") : (lang === "ar" ? "تثبيت" : "Pin")}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleAnnouncement(post.id)}
                      className={`p-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${post.isAnnouncement ? "bg-orange-600/30 text-orange-300" : "text-slate-500 hover:text-white"}`}
                      title={lang === "ar" ? "إعلان مجتمعي" : "Announcement"}
                    >
                      <Megaphone className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemovePost(post.id)}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                      title={lang === "ar" ? "حذف" : "Remove"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleReportPost(post.id)}
                    disabled={post.isReported}
                    className={`p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer disabled:opacity-40`}
                    title={lang === "ar" ? "إبلاغ" : "Report"}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Core Content */}
            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {post.content}
              </p>

              {/* Poll View rendering */}
              {post.isPoll && post.pollOptions && (
                <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-2.5">
                  {post.pollOptions.map((opt, oIdx) => {
                    const totalVotes = post.pollOptions?.reduce((sum, o) => sum + o.votes, 0) || 0;
                    const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                    const isVoted = opt.votedBy.includes(currentUser.id);
                    const hasVotedAny = post.pollOptions?.some(o => o.votedBy.includes(currentUser.id));

                    return (
                      <button
                        key={oIdx}
                        disabled={hasVotedAny}
                        onClick={() => handleVotePoll(post.id, oIdx)}
                        className={`w-full relative text-start overflow-hidden rounded-xl border p-3 flex justify-between items-center transition-all cursor-pointer ${
                          isVoted
                            ? "border-cyan-400/40 bg-cyan-950/10 text-cyan-300"
                            : "border-white/5 bg-white/5 hover:bg-white/10 text-slate-300"
                        }`}
                      >
                        {/* Interactive vote meter filler */}
                        {hasVotedAny && (
                          <div
                            className="absolute top-0 bottom-0 left-0 bg-cyan-500/10 transition-all duration-1000 shrink-0"
                            style={{ width: `${percent}%` }}
                          />
                        )}
                        <span className="text-xs font-bold relative z-10">{opt.text}</span>
                        {hasVotedAny && (
                          <span className="text-[10px] font-black text-cyan-400 relative z-10">{percent}% ({opt.votes})</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Attached image / video */}
              {post.image && (
                <div className="rounded-2xl overflow-hidden max-h-72 border border-white/5 bg-black/40">
                  <img src={post.image} alt="post-img" className="w-full h-full object-cover" />
                </div>
              )}
              {post.video && (
                <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/40 aspect-video relative">
                  <video src={post.video} controls className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Action Bar (Likes, Comments, Shares) */}
            <div className="flex justify-between items-center pt-3 border-t border-white/5 text-slate-500">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center gap-1 text-[11px] font-black transition-colors cursor-pointer ${
                    post.likedByMe ? "text-purple-400" : "hover:text-purple-400"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.likedByMe ? "fill-purple-400 text-purple-400" : ""}`} />
                  <span>{post.likes}</span>
                </button>

                <button
                  onClick={() => {
                    playSynthSound(500, "sine", 0.05);
                    setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id);
                  }}
                  className="flex items-center gap-1 text-[11px] font-black hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.commentsCount}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSavePost(post.id)}
                  className={`flex items-center gap-1 text-[11px] font-black transition-colors cursor-pointer ${
                    post.savedByMe ? "text-yellow-400" : "hover:text-yellow-400"
                  }`}
                >
                  {post.savedByMe ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleSharePost(post.id)}
                  className="flex items-center gap-1 text-[11px] font-black hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Nested Comments Drawer */}
            <AnimatePresence>
              {activeCommentsPostId === post.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-white/5 pt-4 mt-1 space-y-3"
                >
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">{lang === "ar" ? "التعليقات والمناقشات:" : "Bilingual Discussions:"}</span>
                  
                  {/* Comments list */}
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comm) => (
                        <div key={comm.id} className="bg-white/5 p-3 rounded-2xl flex items-start gap-2.5 border border-white/5">
                          <img src={comm.authorAvatar} alt={comm.authorName} className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0" />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-slate-200">{comm.authorName}</span>
                              <span className="text-[8px] text-slate-500 font-bold">{comm.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                              {comm.content}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-[10px] text-slate-500 text-center py-2">
                        {lang === "ar" ? "لا توجد تعليقات هنا بعد. أضف لمستك الخاصة!" : "No comments here yet. Add your response!"}
                      </div>
                    )}
                  </div>

                  {/* Write comment input */}
                  {currentUser.joinedCommunities.includes(activeCommunity.id) && (
                    <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex gap-2">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder={lang === "ar" ? "اكتب تعليقاً مشوقاً..." : "Enter an interesting comment..."}
                        className="flex-1 py-2 px-3 rounded-xl bg-black/40 text-xs text-white border border-white/5 focus:border-purple-500/40 focus:outline-none placeholder-slate-600"
                      />
                      <button
                        type="submit"
                        disabled={!commentInput.trim()}
                        className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer disabled:opacity-40 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* INFINITE SCROLL / LOAD MORE TRIGGER */}
      {posts.length > visibleCount && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-5 py-2.5 rounded-full border border-white/10 hover:border-purple-500/30 bg-white/5 text-slate-400 hover:text-white transition-all text-xs font-bold cursor-pointer flex items-center gap-2"
          >
            {isLoadingMore && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{lang === "ar" ? "استكشاف منشورات أقدم" : "Load more entries"}</span>
          </button>
        </div>
      )}

    </div>
  );
}
