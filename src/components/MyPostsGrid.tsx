import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Grid3x3, Play, Heart, MessageCircle, FileText } from 'lucide-react';
import { themeStyles } from '../styles/theme';

export default function MyPostsGrid({ currentUser, lang, navigate }: any) {
  const { homePosts } = useApp();
  const isRtl = lang === 'ar';

  const myPosts = useMemo(
    () => (homePosts || []).filter((p: any) => p.authorName === currentUser.name),
    [homePosts, currentUser.name]
  );

  return (
    <div className={`p-5 ${themeStyles.glassCard}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black text-[#1A1F2C] dark:text-[#F8FAFC] uppercase tracking-wider flex items-center gap-2">
          <Grid3x3 className="w-4 h-4 text-[#48B8FF]" />
          {lang === 'ar' ? 'منشوراتي' : 'My Posts'}
        </h3>
        <span className="text-xs text-[#6E7685] dark:text-[#94A3B8] font-bold">
          {myPosts.length} {lang === 'ar' ? 'منشور' : 'posts'}
        </span>
      </div>

      {myPosts.length === 0 ? (
        <div className="py-10 flex flex-col items-center text-center gap-2">
          <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447] text-[#9DA5B4] dark:text-[#64748B]">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] max-w-xs">
            {lang === 'ar' ? 'لسا ما نشرت أي شي. أول منشور ليك بيبان هنا.' : "You haven't posted anything yet. Your first post will show up here."}
          </p>
          <button
            onClick={() => navigate('/home')}
            className="mt-1 text-xs font-bold text-[#48B8FF] hover:underline cursor-pointer"
          >
            {lang === 'ar' ? 'أنشئ منشورك الأول →' : 'Create your first post →'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5">
          {myPosts.map((post: any) => (
            <button
              key={post.id}
              onClick={() => navigate('/home')}
              className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] dark:bg-[#121826] border border-[#E6EAF0] dark:border-[#2A3447] group cursor-pointer"
            >
              {post.image ? (
                <img src={post.image} alt="" className="w-full h-full object-cover" />
              ) : post.video ? (
                <>
                  <video src={post.video} className="w-full h-full object-cover" muted />
                  <div className="absolute top-1.5 right-1.5 text-white drop-shadow">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-2.5 bg-[#FAF8F5] dark:bg-[#121826]">
                  <p className="text-xs text-[#1A1F2C] dark:text-[#F8FAFC] leading-snug line-clamp-4 text-center">{post.content}</p>
                </div>
              )}

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-bold">
                <span className="flex items-center gap-1"><Heart className="w-3 h-3 fill-white" />{post.likes}</span>
                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3 fill-white" />{post.commentsCount}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
