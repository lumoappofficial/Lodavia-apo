import React from 'react';
import { Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { getReferralStats, getOrCreateReferralCode } from '../utils/referral';
import { themeStyles } from '../styles/theme';

export default function ReferralCard({ currentUser, lang, playSynthSound, navigate }: any) {
  getOrCreateReferralCode(currentUser.id, currentUser.name);
  const stats = getReferralStats(currentUser.id);
  const isRtl = lang === 'ar';

  return (
    <button
      onClick={() => { playSynthSound(600, 'sine', 0.1); navigate('/referral'); }}
      className={`p-5 text-start w-full ${themeStyles.glassCard} ${themeStyles.glassCardHover}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-[#D9B66F]/15 text-[#D9B66F] border border-[#D9B66F]/30">
            <Gift className="w-6 h-6 text-[#D9B66F]" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#1A1F2C] dark:text-[#F8FAFC] uppercase tracking-wider">
              {isRtl ? 'ادعُ صديقًا واكسب 🎁' : 'Invite & Earn 🎁'}
            </h3>
            <p className="text-xs text-[#6E7685] dark:text-[#94A3B8] mt-1">
              {isRtl
                ? `${stats.invitedCount} أصدقاء مدعوون · ${stats.pointsEarned.toLocaleString()} نقطة مكتسبة`
                : `${stats.invitedCount} friends invited · ${stats.pointsEarned.toLocaleString()} points earned`}
            </p>
          </div>
        </div>
        {isRtl ? <ChevronLeft className="w-4 h-4 text-[#9DA5B4] shrink-0" /> : <ChevronRight className="w-4 h-4 text-[#9DA5B4] shrink-0" />}
      </div>
    </button>
  );
}
