import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Shield, Rocket } from 'lucide-react';
import { TeamId, OrbitsToken, MoveAction } from '../../../games/lodaviaOrbits/types';

export interface TokenPosition {
  id: string;
  team: 'blue' | 'gold' | 'emerald' | 'coral';
  type: 'base' | 'track' | 'safety' | 'finished';
  index: number; // base: 0-3, track: 0-63, safety: 0-3
  label: string;
}

export interface OrbitsBoardProps {
  tokens?: Record<string, OrbitsToken>;
  validMoves?: MoveAction[];
  selectedTokenId?: string | null;
  onSelectToken?: (tokenId: string) => void;
  onApplyMove?: (move: MoveAction) => void;
  currentTeam?: TeamId;
}

// 4 Teams Configuration
export const ORBITS_TEAMS = {
  blue: {
    id: 'blue',
    nameAr: 'محطة أندروميدا',
    nameEn: 'Andromeda Station',
    colorNameAr: 'الأزرق الكوني',
    colorHex: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    bgGradient: 'from-sky-500/20 to-blue-600/10',
    borderCol: 'border-sky-400/50',
    stationPos: { x: 150, y: 650 },
    entryNode: 0,
    safetyAngle: 225, // Bottom-left inward
  },
  gold: {
    id: 'gold',
    nameAr: 'محطة هليوس الذهبية',
    nameEn: 'Helios Solar Base',
    colorNameAr: 'الذهب الشمسي',
    colorHex: '#facc15',
    glowColor: 'rgba(250, 204, 21, 0.6)',
    bgGradient: 'from-amber-500/20 to-yellow-600/10',
    borderCol: 'border-amber-400/50',
    stationPos: { x: 150, y: 150 },
    entryNode: 16,
    safetyAngle: 315, // Top-left inward
  },
  emerald: {
    id: 'emerald',
    nameAr: 'محطة أورورا الخضراء',
    nameEn: 'Aurora Outpost',
    colorNameAr: 'الزمرد النبضي',
    colorHex: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.6)',
    bgGradient: 'from-emerald-500/20 to-teal-600/10',
    borderCol: 'border-emerald-400/50',
    stationPos: { x: 650, y: 150 },
    entryNode: 32,
    safetyAngle: 45, // Top-right inward
  },
  coral: {
    id: 'coral',
    nameAr: 'محطة مريخ المرجان',
    nameEn: 'Coral Mars Base',
    colorNameAr: 'المرجان الناري',
    colorHex: '#fb7185',
    glowColor: 'rgba(251, 113, 133, 0.6)',
    bgGradient: 'from-rose-500/20 to-red-600/10',
    borderCol: 'border-rose-400/50',
    stationPos: { x: 650, y: 650 },
    entryNode: 48,
    safetyAngle: 135, // Bottom-right inward
  },
} as const;

// Mock Fixed Tokens positions for static display: 2 to 3 tokens per team on the track!
const MOCK_TOKENS: TokenPosition[] = [
  // Team Blue (Sky - محطة أندروميدا) -> 3 on track, 1 in base
  { id: 'b1', team: 'blue', type: 'base', index: 0, label: 'ألفا-1' },
  { id: 'b2', team: 'blue', type: 'track', index: 5, label: 'ألفا-2' },
  { id: 'b3', team: 'blue', type: 'track', index: 12, label: 'ألفا-3' },
  { id: 'b4', team: 'blue', type: 'track', index: 60, label: 'ألفا-4' },

  // Team Gold (Helios - محطة هليوس) -> 3 on track, 1 in base
  { id: 'g1', team: 'gold', type: 'base', index: 0, label: 'سولار-1' },
  { id: 'g2', team: 'gold', type: 'track', index: 20, label: 'سولار-2' },
  { id: 'g3', team: 'gold', type: 'track', index: 26, label: 'سولار-3' },
  { id: 'g4', team: 'gold', type: 'track', index: 30, label: 'سولار-4' },

  // Team Emerald (Aurora - محطة أورورا) -> 3 on track, 1 in base
  { id: 'e1', team: 'emerald', type: 'base', index: 0, label: 'أورورا-1' },
  { id: 'e2', team: 'emerald', type: 'track', index: 36, label: 'أورورا-2' },
  { id: 'e3', team: 'emerald', type: 'track', index: 41, label: 'أورورا-3' },
  { id: 'e4', team: 'emerald', type: 'track', index: 46, label: 'أورورا-4' },

  // Team Coral (Mars - محطة المريخ) -> 3 on track, 1 in base
  { id: 'c1', team: 'coral', type: 'base', index: 0, label: 'مريخ-1' },
  { id: 'c2', team: 'coral', type: 'track', index: 53, label: 'مريخ-2' },
  { id: 'c3', team: 'coral', type: 'track', index: 58, label: 'مريخ-3' },
  { id: 'c4', team: 'coral', type: 'track', index: 15, label: 'مريخ-4' },
];

export default function OrbitsBoard({
  tokens,
  validMoves = [],
  selectedTokenId,
  onSelectToken,
  onApplyMove,
  currentTeam,
}: OrbitsBoardProps = {}) {
  const CENTER = 400;
  const TRACK_RADIUS = 270;
  const TOTAL_NODES = 64;

  // Real tokens mapping if provided
  const realTokensList = tokens ? Object.values(tokens) : null;

  const getBaseToken = (team: 'blue' | 'gold' | 'emerald' | 'coral', idx: number) => {
    if (realTokensList) {
      return realTokensList.find((t) => t.team === team && t.location === 'base' && t.tokenIndex === idx);
    }
    return MOCK_TOKENS.find((t) => t.team === team && t.type === 'base' && t.index === idx);
  };

  const getSafetyToken = (team: 'blue' | 'gold' | 'emerald' | 'coral', stepIdx: number) => {
    if (realTokensList) {
      return realTokensList.find((t) => t.team === team && t.location === 'safety' && t.safetyStep === stepIdx);
    }
    return MOCK_TOKENS.find((t) => t.team === team && t.type === 'safety' && t.index === stepIdx);
  };

  const getTrackToken = (nodeIdx: number) => {
    if (realTokensList) {
      return realTokensList.find((t) => t.location === 'track' && t.trackNode === nodeIdx);
    }
    return MOCK_TOKENS.find((t) => t.type === 'track' && t.index === nodeIdx);
  };

  const getFinishedCount = (team: 'blue' | 'gold' | 'emerald' | 'coral') => {
    if (!realTokensList) return 0;
    return realTokensList.filter((t) => t.team === team && t.location === 'finished').length;
  };

  // Selected move if any
  const activeSelectedMove = selectedTokenId
    ? validMoves.find((m) => m.tokenId === selectedTokenId)
    : validMoves.length === 1
    ? validMoves[0]
    : null;

  // Calculate coordinates for the 64 circular track nodes
  const trackNodes = Array.from({ length: TOTAL_NODES }, (_, i) => {
    const angleRad = ((i / TOTAL_NODES) * 360 - 90) * (Math.PI / 180);
    const x = CENTER + TRACK_RADIUS * Math.cos(angleRad);
    const y = CENTER + TRACK_RADIUS * Math.sin(angleRad);

    const isEntry = i === 0 || i === 16 || i === 32 || i === 48;
    const isSupercharged = i % 8 === 0 && !isEntry;

    let nodeColor = '#38bdf8';
    if (i >= 0 && i < 16) nodeColor = '#38bdf8';
    else if (i >= 16 && i < 32) nodeColor = '#34d399';
    else if (i >= 32 && i < 48) nodeColor = '#fb7185';
    else nodeColor = '#facc15';

    return { index: i, x, y, isEntry, isSupercharged, nodeColor };
  });

  // Calculate safety wormhole path nodes (4 steps per team leading to center)
  const safetyPaths = [
    { team: 'blue' as const, color: '#38bdf8', angle: 135 },
    { team: 'emerald' as const, color: '#34d399', angle: 45 },
    { team: 'coral' as const, color: '#fb7185', angle: 315 },
    { team: 'gold' as const, color: '#facc15', angle: 225 },
  ].map(({ team, color, angle }) => {
    const rad = angle * (Math.PI / 180);
    const steps = [1, 2, 3, 4].map((step) => {
      const r = TRACK_RADIUS - step * 42;
      return {
        step: step - 1,
        x: CENTER + r * Math.cos(rad),
        y: CENTER + r * Math.sin(rad),
      };
    });
    return { team, color, steps };
  });

  // Helper to render mini spaceship token (larger, distinct from track nodes, with glowing aura)
  const renderToken = (
    token: { id: string; team: 'blue' | 'gold' | 'emerald' | 'coral'; label: string },
    x: number,
    y: number,
    isValidMove = false,
    isSelected = false,
    moveAction?: MoveAction
  ) => {
    const teamConfig = ORBITS_TEAMS[token.team];

    return (
      <g 
        key={token.id} 
        transform={`translate(${x}, ${y})`}
        onClick={(e) => {
          e.stopPropagation();
          if (isValidMove) {
            onSelectToken?.(token.id);
            if (moveAction && (isSelected || validMoves.length === 1)) {
              onApplyMove?.(moveAction);
            }
          }
        }}
        className={`select-none transition-transform ${isValidMove ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
      >
        {/* Soft Ambient Glow Halo (Distinguishes actual player token) */}
        <circle 
          r={isValidMove ? 22 : 19} 
          fill={teamConfig.colorHex} 
          opacity={isValidMove ? 0.6 : 0.35} 
          className={isValidMove ? 'animate-pulse' : 'animate-[pulse_3s_ease-in-out_infinite]'} 
        />

        {/* Pulsing Active Selection or Valid Move Target Ring */}
        {isValidMove && (
          <circle 
            r={18.5} 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth={2} 
            strokeDasharray="4 3"
            className="animate-spin" 
          />
        )}

        {/* Outer Radiant Energy Ring */}
        <circle 
          r={14.5} 
          fill="none" 
          stroke={isSelected ? '#ffffff' : teamConfig.colorHex} 
          strokeWidth={isSelected ? 2.4 : 1.8} 
          strokeDasharray="4 2"
          opacity={0.95}
        />

        {/* Token Solid Disc Body */}
        <circle 
          r={11.5} 
          fill="#080E1C" 
          stroke={teamConfig.colorHex} 
          strokeWidth={2.4} 
        />
        
        {/* Inner Team Color Gem */}
        <circle 
          r={7.5} 
          fill={teamConfig.colorHex} 
          opacity={0.9} 
        />

        {/* Specular Light Reflection */}
        <circle 
          cx={-2.5} 
          cy={-2.5} 
          r={2} 
          fill="#ffffff" 
          opacity={0.85} 
        />

        {/* Center Craft Core Node */}
        <circle 
          cx={0} 
          cy={0} 
          r={2} 
          fill="#0B1220" 
        />
      </g>
    );
  };

  return (
    <div className="relative w-full max-w-[720px] aspect-square mx-auto flex items-center justify-center p-2 sm:p-4 select-none">
      
      {/* ─── Requirement 5: Ambient Outer Glow Halo around board ─── */}
      <div 
        className="absolute -inset-4 sm:-inset-6 rounded-full bg-gradient-to-r from-sky-500/15 via-blue-600/10 to-teal-500/15 blur-2xl opacity-80 pointer-events-none animate-[pulse_6s_ease-in-out_infinite]" 
      />
      <div 
        className="absolute -inset-1 sm:-inset-2 rounded-full border border-sky-400/30 shadow-[0_0_50px_rgba(56,189,248,0.25),inset_0_0_30px_rgba(56,189,248,0.12)] pointer-events-none" 
      />

      {/* ─── Ambient Cosmic Background & Starlight Rings ─── */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#070B14] via-[#0B1528] to-[#050811] border border-sky-500/30 shadow-[0_0_90px_rgba(14,165,233,0.2)] overflow-hidden">
        {/* Subtle animated stars background */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:36px_36px]" />
        
        {/* Cosmic Nebula Clouds */}
        <div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full bg-emerald-500/8 blur-2xl pointer-events-none" />
      </div>

      {/* ─── SVG Main Game Board ─── */}
      <svg
        viewBox="0 0 800 800"
        className="w-full h-full relative z-10 drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Central Singularity Gradient */}
          <radialGradient id="centerCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
            <stop offset="35%" stopColor="#38bdf8" stopOpacity={0.7} />
            <stop offset="70%" stopColor="#0284c7" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#0B1220" stopOpacity={0} />
          </radialGradient>

          {/* Station Radial Glows */}
          <radialGradient id="blueBaseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#0B1220" stopOpacity={0.05} />
          </radialGradient>
          <radialGradient id="goldBaseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#facc15" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#0B1220" stopOpacity={0.05} />
          </radialGradient>
          <radialGradient id="emeraldBaseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#0B1220" stopOpacity={0.05} />
          </radialGradient>
          <radialGradient id="coralBaseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fb7185" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#0B1220" stopOpacity={0.05} />
          </radialGradient>
        </defs>

        {/* ── 1. Cosmic Constellation Grid & Orbital Rings ── */}
        <circle cx={CENTER} cy={CENTER} r={350} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1} strokeDasharray="4 8" />
        <circle cx={CENTER} cy={CENTER} r={TRACK_RADIUS} fill="none" stroke="rgba(56,189,248,0.2)" strokeWidth={2.5} />
        <circle cx={CENTER} cy={CENTER} r={TRACK_RADIUS - 15} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="6 6" />
        <circle cx={CENTER} cy={CENTER} r={170} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
        <circle cx={CENTER} cy={CENTER} r={105} fill="none" stroke="rgba(56,189,248,0.3)" strokeWidth={1.5} strokeDasharray="3 3" />

        {/* Crosshair Coordinate Rays */}
        <line x1={CENTER} y1={90} x2={CENTER} y2={710} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        <line x1={90} y1={CENTER} x2={710} y2={CENTER} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        <line x1={150} y1={150} x2={650} y2={650} stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="3 5" />
        <line x1={650} y1={150} x2={150} y2={650} stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="3 5" />

        {/* ── 2. The 4 Corner Space Stations (Bases) ── */}
        {/* Base 1: Helios Solar Gold (Top-Left) */}
        <g transform="translate(140, 140)">
          {currentTeam === 'gold' && (
            <circle r={76} fill="none" stroke="#facc15" strokeWidth={2} strokeDasharray="6 3" className="animate-spin" opacity={0.8} />
          )}
          <circle r={65} fill="url(#goldBaseGlow)" stroke="#facc15" strokeWidth={currentTeam === 'gold' ? 2.5 : 1.5} strokeDasharray="8 4" opacity={currentTeam === 'gold' ? 1 : 0.75} />
          <circle r={45} fill="#090E1A" stroke={currentTeam === 'gold' ? '#facc15' : 'rgba(250,204,21,0.4)'} strokeWidth={1.5} />
          <text x={0} y={-48} textAnchor="middle" fill="#facc15" fontSize={11} fontWeight="bold" letterSpacing="0.05em">
            محطة هليوس ☀️ {currentTeam === 'gold' ? '⚡' : ''}
          </text>
          {/* 4 Docking Hangars */}
          {[
            { x: -18, y: -18, idx: 0 },
            { x: 18, y: -18, idx: 1 },
            { x: -18, y: 18, idx: 2 },
            { x: 18, y: 18, idx: 3 },
          ].map(({ x, y, idx }) => {
            const token = getBaseToken('gold', idx);
            const isValid = token ? validMoves.some((m) => m.tokenId === token.id) : false;
            const isSelected = token ? selectedTokenId === token.id : false;
            const moveAction = token ? validMoves.find((m) => m.tokenId === token.id) : undefined;

            return (
              <g key={`g-hangar-${idx}`} transform={`translate(${x}, ${y})`}>
                <circle r={10} fill="#121D33" stroke="#facc15" strokeWidth={1.2} opacity={0.6} />
                {token && renderToken(token, 0, 0, isValid, isSelected, moveAction)}
              </g>
            );
          })}
        </g>

        {/* Base 2: Aurora Emerald (Top-Right) */}
        <g transform="translate(660, 140)">
          {currentTeam === 'emerald' && (
            <circle r={76} fill="none" stroke="#34d399" strokeWidth={2} strokeDasharray="6 3" className="animate-spin" opacity={0.8} />
          )}
          <circle r={65} fill="url(#emeraldBaseGlow)" stroke="#34d399" strokeWidth={currentTeam === 'emerald' ? 2.5 : 1.5} strokeDasharray="8 4" opacity={currentTeam === 'emerald' ? 1 : 0.75} />
          <circle r={45} fill="#090E1A" stroke={currentTeam === 'emerald' ? '#34d399' : 'rgba(52,211,153,0.4)'} strokeWidth={1.5} />
          <text x={0} y={-48} textAnchor="middle" fill="#34d399" fontSize={11} fontWeight="bold" letterSpacing="0.05em">
            محطة أورورا ❇️ {currentTeam === 'emerald' ? '⚡' : ''}
          </text>
          {/* 4 Docking Hangars */}
          {[
            { x: -18, y: -18, idx: 0 },
            { x: 18, y: -18, idx: 1 },
            { x: -18, y: 18, idx: 2 },
            { x: 18, y: 18, idx: 3 },
          ].map(({ x, y, idx }) => {
            const token = getBaseToken('emerald', idx);
            const isValid = token ? validMoves.some((m) => m.tokenId === token.id) : false;
            const isSelected = token ? selectedTokenId === token.id : false;
            const moveAction = token ? validMoves.find((m) => m.tokenId === token.id) : undefined;

            return (
              <g key={`e-hangar-${idx}`} transform={`translate(${x}, ${y})`}>
                <circle r={10} fill="#121D33" stroke="#34d399" strokeWidth={1.2} opacity={0.6} />
                {token && renderToken(token, 0, 0, isValid, isSelected, moveAction)}
              </g>
            );
          })}
        </g>

        {/* Base 3: Coral Mars (Bottom-Right) */}
        <g transform="translate(660, 660)">
          {currentTeam === 'coral' && (
            <circle r={76} fill="none" stroke="#fb7185" strokeWidth={2} strokeDasharray="6 3" className="animate-spin" opacity={0.8} />
          )}
          <circle r={65} fill="url(#coralBaseGlow)" stroke="#fb7185" strokeWidth={currentTeam === 'coral' ? 2.5 : 1.5} strokeDasharray="8 4" opacity={currentTeam === 'coral' ? 1 : 0.75} />
          <circle r={45} fill="#090E1A" stroke={currentTeam === 'coral' ? '#fb7185' : 'rgba(251,113,133,0.4)'} strokeWidth={1.5} />
          <text x={0} y={56} textAnchor="middle" fill="#fb7185" fontSize={11} fontWeight="bold" letterSpacing="0.05em">
            محطة المريخ ☄️ {currentTeam === 'coral' ? '⚡' : ''}
          </text>
          {/* 4 Docking Hangars */}
          {[
            { x: -18, y: -18, idx: 0 },
            { x: 18, y: -18, idx: 1 },
            { x: -18, y: 18, idx: 2 },
            { x: 18, y: 18, idx: 3 },
          ].map(({ x, y, idx }) => {
            const token = getBaseToken('coral', idx);
            const isValid = token ? validMoves.some((m) => m.tokenId === token.id) : false;
            const isSelected = token ? selectedTokenId === token.id : false;
            const moveAction = token ? validMoves.find((m) => m.tokenId === token.id) : undefined;

            return (
              <g key={`c-hangar-${idx}`} transform={`translate(${x}, ${y})`}>
                <circle r={10} fill="#121D33" stroke="#fb7185" strokeWidth={1.2} opacity={0.6} />
                {token && renderToken(token, 0, 0, isValid, isSelected, moveAction)}
              </g>
            );
          })}
        </g>

        {/* Base 4: Andromeda Sky Blue (Bottom-Left) */}
        <g transform="translate(140, 660)">
          {currentTeam === 'blue' && (
            <circle r={76} fill="none" stroke="#38bdf8" strokeWidth={2} strokeDasharray="6 3" className="animate-spin" opacity={0.8} />
          )}
          <circle r={65} fill="url(#blueBaseGlow)" stroke="#38bdf8" strokeWidth={currentTeam === 'blue' ? 2.5 : 1.5} strokeDasharray="8 4" opacity={currentTeam === 'blue' ? 1 : 0.75} />
          <circle r={45} fill="#090E1A" stroke={currentTeam === 'blue' ? '#38bdf8' : 'rgba(56,189,248,0.4)'} strokeWidth={1.5} />
          <text x={0} y={56} textAnchor="middle" fill="#38bdf8" fontSize={11} fontWeight="bold" letterSpacing="0.05em">
            محطة أندروميدا 🚀 {currentTeam === 'blue' ? '⚡' : ''}
          </text>
          {/* 4 Docking Hangars */}
          {[
            { x: -18, y: -18, idx: 0 },
            { x: 18, y: -18, idx: 1 },
            { x: -18, y: 18, idx: 2 },
            { x: 18, y: 18, idx: 3 },
          ].map(({ x, y, idx }) => {
            const token = getBaseToken('blue', idx);
            const isValid = token ? validMoves.some((m) => m.tokenId === token.id) : false;
            const isSelected = token ? selectedTokenId === token.id : false;
            const moveAction = token ? validMoves.find((m) => m.tokenId === token.id) : undefined;

            return (
              <g key={`b-hangar-${idx}`} transform={`translate(${x}, ${y})`}>
                <circle r={10} fill="#121D33" stroke="#38bdf8" strokeWidth={1.2} opacity={0.6} />
                {token && renderToken(token, 0, 0, isValid, isSelected, moveAction)}
              </g>
            );
          })}
        </g>

        {/* ── 3. Safety Wormhole Paths Leading to Center ── */}
        {safetyPaths.map((path) => (
          <g key={`path-${path.team}`}>
            {path.steps.map((st, i) => {
              const token = getSafetyToken(path.team, i);
              const isValid = token ? validMoves.some((m) => m.tokenId === token.id) : false;
              const isSelected = token ? selectedTokenId === token.id : false;
              const moveAction = token ? validMoves.find((m) => m.tokenId === token.id) : undefined;

              // Check if this step is target of activeSelectedMove
              const isTargetStep =
                activeSelectedMove &&
                activeSelectedMove.team === path.team &&
                activeSelectedMove.toLocation === 'safety' &&
                activeSelectedMove.toIndex === i;

              return (
                <g key={`st-${path.team}-${i}`} transform={`translate(${st.x}, ${st.y})`}>
                  <circle r={7.5} fill="#0B1322" stroke={path.color} strokeWidth={1.5} />
                  <circle r={3} fill={path.color} opacity={0.7} />

                  {/* Highlight target destination */}
                  {isTargetStep && (
                    <g 
                      className="cursor-pointer" 
                      onClick={() => onApplyMove?.(activeSelectedMove)}
                    >
                      <circle r={14} fill="none" stroke={path.color} strokeWidth={2} strokeDasharray="3 2" className="animate-spin" />
                      <circle r={5} fill={path.color} opacity={0.6} className="animate-ping" />
                    </g>
                  )}

                  {/* Render Token if placed on this safety step */}
                  {token && renderToken(token, 0, 0, isValid, isSelected, moveAction)}
                </g>
              );
            })}
          </g>
        ))}

        {/* ── 4. Main 64 Circular Track Nodes (Waypoints) ── */}
        {trackNodes.map((node) => {
          const tokenOnNode = getTrackToken(node.index);
          const isValid = tokenOnNode ? validMoves.some((m) => m.tokenId === tokenOnNode.id) : false;
          const isSelected = tokenOnNode ? selectedTokenId === tokenOnNode.id : false;
          const moveAction = tokenOnNode ? validMoves.find((m) => m.tokenId === tokenOnNode.id) : undefined;

          // Target highlighting for activeSelectedMove
          const isTargetNode =
            activeSelectedMove &&
            activeSelectedMove.toLocation === 'track' &&
            activeSelectedMove.toIndex === node.index;

          return (
            <g key={`track-node-${node.index}`} transform={`translate(${node.x}, ${node.y})`}>
              {/* Outer Glow for Entry & Supercharged Waypoints */}
              {node.isEntry && (
                <circle r={11} fill="none" stroke={node.nodeColor} strokeWidth={1.5} strokeDasharray="3 2" className="animate-spin" />
              )}
              {node.isSupercharged && (
                <circle r={9} fill="none" stroke="#facc15" strokeWidth={1} opacity={0.6} />
              )}

              {/* Waypoint Dot */}
              <circle
                r={node.isEntry ? 7.5 : node.isSupercharged ? 6 : 4.5}
                fill={node.isEntry ? node.nodeColor : '#0E1729'}
                stroke={node.nodeColor}
                strokeWidth={node.isEntry ? 2 : 1.2}
                opacity={node.isEntry ? 0.95 : 0.8}
              />

              {/* Center Pin */}
              {!node.isEntry && (
                <circle r={1.5} fill="#ffffff" opacity={0.7} />
              )}

              {/* Interactive Target Destination Reticle */}
              {isTargetNode && (
                <g 
                  className="cursor-pointer"
                  onClick={() => onApplyMove?.(activeSelectedMove)}
                >
                  <circle r={17} fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" strokeWidth={2} strokeDasharray="4 2" className="animate-spin" />
                  <circle r={6} fill="#38bdf8" opacity={0.8} className="animate-ping" />
                </g>
              )}

              {/* Render Token if placed on this track node */}
              {tokenOnNode && renderToken(tokenOnNode, 0, 0, isValid, isSelected, moveAction)}
            </g>
          );
        })}

        {/* ── 5. The Central Cosmic Singularity (النواة الكونية) ── */}
        <g 
          transform={`translate(${CENTER}, ${CENTER})`}
          onClick={() => {
            if (activeSelectedMove && activeSelectedMove.toLocation === 'finished') {
              onApplyMove?.(activeSelectedMove);
            }
          }}
          className={activeSelectedMove && activeSelectedMove.toLocation === 'finished' ? 'cursor-pointer' : ''}
        >
          {/* Swirling outer energy */}
          <circle r={60} fill="url(#centerCoreGlow)" />
          <circle r={44} fill="#060A14" stroke="#38bdf8" strokeWidth={2} opacity={0.9} />
          <circle r={36} fill="none" stroke="#facc15" strokeWidth={1} strokeDasharray="4 6" />

          {/* If target is finished point */}
          {activeSelectedMove && activeSelectedMove.toLocation === 'finished' && (
            <circle r={52} fill="none" stroke="#facc15" strokeWidth={2.5} strokeDasharray="4 4" className="animate-spin" />
          )}

          {/* Central Logo / Singularity Icon */}
          <circle r={24} fill="#0B1528" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <path
            d="M 0,-12 L 8,0 L 0,12 L -8,0 Z"
            fill="#38bdf8"
            opacity={0.85}
          />
          <circle r={4} fill="#ffffff" />

          {/* Display Finished Crafts Count if any */}
          <g transform="translate(0, 14)">
            {(['blue', 'gold', 'emerald', 'coral'] as const).map((teamKey, tIdx) => {
              const count = getFinishedCount(teamKey);
              if (count === 0) return null;
              const teamCfg = ORBITS_TEAMS[teamKey];
              return (
                <g key={`finished-dot-${teamKey}`} transform={`translate(${(tIdx - 1.5) * 12}, 0)`}>
                  <circle r={4.5} fill={teamCfg.colorHex} stroke="#000" strokeWidth={0.8} />
                  <text y={2} textAnchor="middle" fill="#000" fontSize={5} fontWeight="bold">
                    {count}
                  </text>
                </g>
              );
            })}
          </g>

          <text
            y={28}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={7}
            fontWeight="bold"
            letterSpacing="0.1em"
          >
            النواة الكونية
          </text>
        </g>
      </svg>
    </div>
  );
}
