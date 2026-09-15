import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Copy, Check, Users, Lock, Radio, Sparkles } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { GameCardInfo, CoOpRoom } from '../../types/games';

interface CreateRoomModalProps {
  game: GameCardInfo | null;
  onClose: () => void;
  onCreateSuccess: (newRoom: CoOpRoom) => void;
}

export default function CreateRoomModal({ game, onClose, onCreateSuccess }: CreateRoomModalProps) {
  const { currentUser, lang, playSynthSound } = useApp();

  const [roomTitle, setRoomTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(game?.maxPlayers || 4);
  const [copied, setCopied] = useState(false);

  if (!game) return null;

  const generatedCode = `LOD-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    playSynthSound(700, 'sine', 0.1);

    const newRoom: CoOpRoom = {
      id: `room_${Date.now()}`,
      code: generatedCode,
      titleAr: roomTitle.trim() || (lang === 'ar' ? `غرفة ${currentUser.name} الفضائية` : `${currentUser.name}'s Cosmic Lobby`),
      titleEn: roomTitle.trim() || `${currentUser.name}'s Cosmic Lobby`,
      gameId: game.id,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar,
      playersCount: 1,
      maxPlayers: maxPlayers,
      status: 'lobby',
      isPrivate: isPrivate
    };

    onCreateSuccess(newRoom);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-lg bg-slate-950 border border-purple-500/30 rounded-3xl p-6 shadow-2xl relative text-white"
        >
          <button
            onClick={onClose}
            className="absolute top-5 left-5 md:left-auto md:right-5 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {lang === 'ar' ? 'إنشاء غرفة لعب مجرّية 🎮' : 'Create Cosmic Play Lobby 🎮'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'ar' ? game.titleAr : game.titleEn}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {lang === 'ar' ? 'اسم الغرفة:' : 'Lobby Title:'}
              </label>
              <input
                type="text"
                value={roomTitle}
                onChange={(e) => setRoomTitle(e.target.value)}
                placeholder={lang === 'ar' ? 'غرفة إنقاذ الأسطول السريع...' : 'Quick rescue fleet...'}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* ROOM CODE DISPLAY */}
            <div className="p-3 bg-slate-900/80 border border-purple-500/20 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'رمز الغرفة الخاص' : 'Lobby Passcode'}</div>
                <div className="text-sm font-mono font-black text-cyan-300">{generatedCode}</div>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-slate-300 flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الرمز' : 'Copy Code')}</span>
              </button>
            </div>

            {/* MAX PLAYERS */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {lang === 'ar' ? 'الحد الأقصى للاعبين:' : 'Max Player Capacity:'}
              </label>
              <div className="flex gap-2">
                {[2, 3, 4, 6, 8].filter(n => n <= game.maxPlayers).map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setMaxPlayers(num)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      maxPlayers === num 
                        ? 'bg-purple-950/80 border-purple-400 text-purple-300 font-black' 
                        : 'bg-slate-900 border-white/10 text-slate-400'
                    }`}
                  >
                    {num} {lang === 'ar' ? 'لاعبين' : 'Players'}
                  </button>
                ))}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
            >
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تأكيد ودخول الغرفة 🚀' : 'Confirm & Launch Room 🚀'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
