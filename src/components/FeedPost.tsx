import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Flag, 
  Play, 
  Check, 
  Vote, 
  Loader2 
} from 'lucide-react';
import { FeedPostType } from '../types';

interface FeedPostProps {
  key?: React.Key;
  post: FeedPostType;
  lang: string;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onReport: (id: string) => void;
  onVote: (postId: string, optionId: string) => void;
  onToggleVideo: (id: string) => void;
  playSynthSound: (freq: number, type?: 'sine' | 'triangle' | 'sawtooth' | 'square', duration?: number) => void;
}

export default function FeedPost({
  post,
  lang,
  onLike,
  onSave,
  onShare,
  onReport,
  onVote,
  onToggleVideo,
  playSynthSound,
}: FeedPostProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Helper to parse hashtags and style them dynamically
  const renderContent = (text: string) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span 
            key={index} 
            className="text-[#0284C7] dark:text-cyan-400 font-bold hover:underline cursor-pointer transition-colors"
            onClick={() => {
              playSynthSound(700, 'sine', 0.05);
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const handleLikeClick = () => {
    setIsLiking(true);
    onLike(post.id);
    setTimeout(() => setIsLiking(false), 500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-5 rounded-3xl transition-all flex flex-col gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl opacity-40 pointer-events-none" />
      
      {/* Post Header */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-center gap-2.5">
          <img 
            src={post.authorAvatar} 
            alt={post.authorName} 
            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-800" 
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-black text-slate-900 dark:text-slate-100">{post.authorName}</span>
              {post.authorBadge && (
                <span className="text-[8px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 py-0.5 px-1.5 rounded font-black uppercase">
                  {post.authorBadge}
                </span>
              )}
            </div>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 block">{post.time}</span>
          </div>
        </div>

        <button
          onClick={() => {
            playSynthSound(300, 'sine', 0.08);
            onReport(post.id);
          }}
          className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          title={lang === 'ar' ? 'الإبلاغ عن المنشور' : 'Report Post'}
        >
          <Flag className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Post Content Body */}
      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-line">
        {renderContent(post.content)}
      </p>

      {/* Render Image Type */}
      {post.type === 'image' && post.imageUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-50 dark:bg-slate-900 min-h-[160px] flex items-center justify-center">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900 animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
            </div>
          )}
          <img 
            src={post.imageUrl} 
            alt="Stellar Capture" 
            className={`w-full h-auto max-h-72 object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Render Video Type */}
      {post.type === 'video' && post.videoUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-black/80 aspect-video max-h-72 flex items-center justify-center">
          {post.videoPlaying ? (
            <video 
              src={post.videoUrl} 
              className="w-full h-full object-cover" 
              controls 
              autoPlay 
              loop 
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=400&q=80" 
                alt="Video cover placeholder" 
                className="absolute inset-0 w-full h-full object-cover opacity-30" 
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => onToggleVideo(post.id)}
                className="p-4 rounded-full bg-white text-slate-950 hover:scale-110 active:scale-95 shadow-2xl z-10 cursor-pointer transition-all flex items-center justify-center"
              >
                <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
              </button>
              <span className="text-[9px] font-black uppercase text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full z-10 tracking-widest">
                {lang === 'ar' ? 'عرض مرئي تفاعلي' : 'Interactive Video Node'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Render Poll Type */}
      {post.type === 'poll' && post.poll && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
          <h4 className="text-[11px] font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Vote className="w-3.5 h-3.5 text-cyan-500" />
            <span>{post.poll.question}</span>
          </h4>

          <div className="flex flex-col gap-2">
            {post.poll.options.map((opt) => {
              const percent = post.poll!.totalVotes > 0 
                ? Math.round((opt.votes / post.poll!.totalVotes) * 100) 
                : 0;
              const isVoted = post.poll!.votedOptionId === opt.id;
              const hasVotedAny = !!post.poll!.votedOptionId;

              return (
                <button
                  key={opt.id}
                  onClick={() => onVote(post.id, opt.id)}
                  disabled={hasVotedAny}
                  className="relative w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-start overflow-hidden flex justify-between items-center transition-all group/opt cursor-pointer bg-white dark:bg-[#0F172A]"
                >
                  {/* Background vote percent visual indicator */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: hasVotedAny ? `${percent}%` : '0%' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute start-0 top-0 bottom-0 bg-cyan-500/20" 
                  />
                  
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 relative z-10 flex items-center gap-2">
                    {isVoted && <Check className="w-3.5 h-3.5 text-cyan-500" />}
                    <span>{opt.text}</span>
                  </span>
                  
                  {hasVotedAny && (
                    <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 font-mono relative z-10">
                      {percent}% ({opt.votes})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold block mt-1">
            🪐 {post.poll.totalVotes} {lang === 'ar' ? 'صوت كوني مسجل' : 'Cosmic votes recorded'}
          </span>
        </div>
      )}

      {/* Post Interactions Panel */}
      <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 text-[10px] font-bold transition-all hover:scale-115 cursor-pointer ${
              post.isLiked ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <motion.div
              animate={isLiking && post.isLiked ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500' : ''}`} />
            </motion.div>
            <span>{post.likesCount}</span>
          </motion.button>

          <button
            onClick={() => {
              playSynthSound(600, 'sine', 0.05);
              alert(lang === 'ar' ? 'منطقة النقاش تحت التأسيس العصبي' : 'Discussion zone synching offline');
            }}
            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-[10px] font-bold transition-all hover:scale-115 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.commentsCount}</span>
          </button>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => onSave(post.id)}
            className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer ${
              post.isSaved ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title={lang === 'ar' ? 'حفظ' : 'Save Post'}
          >
            <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-amber-500' : ''}`} />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => onShare(post.id)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all cursor-pointer"
            title={lang === 'ar' ? 'مشاركة' : 'Share Post'}
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
