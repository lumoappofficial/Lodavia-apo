export type GameId = 'galaxy_rescue' | 'who_is_alien' | 'lodavia_challenge' | 'starship_chaos' | 'galaxy_rush' | 'planet_rescue';

export type GameCategory = 'all' | 'most_played' | 'coop' | 'social' | 'challenge' | 'new' | 'featured';

export interface GameCardInfo {
  id: GameId;
  titleAr: string;
  titleEn: string;
  shortDescAr: string;
  shortDescEn: string;
  fullDescAr: string;
  fullDescEn: string;
  category: 'coop' | 'social' | 'challenge';
  isMostPlayed: boolean;
  isNew?: boolean;
  featured?: boolean;
  activePlayersCount: number;
  activityLevel: 'ultra' | 'high' | 'medium';
  activityLevelAr: string;
  activityLevelEn: string;
  artwork: string;
  accentColor: string;
  badgeAr: string;
  badgeEn: string;
  icon: string; // lucide icon name or emoji
  gradientBg: string;
  borderColor: string;
  minPlayers: number;
  maxPlayers: number;
  avgDurationMinutes: number;
  xpReward: number;
  pointsReward: number;
  rulesAr: string[];
  rulesEn: string[];
  featuresAr: string[];
  featuresEn: string[];
}

export interface MiniPlayerProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  titleAr: string;
  titleEn: string;
  matchesCount: number;
  winsCount: number;
  winRate: number;
  points: number;
  status: 'online' | 'in_game' | 'offline';
  currentActivityAr: string;
  currentActivityEn: string;
  achievementsCount: number;
  achievements: string[];
  isFriend?: boolean;
  isFollowing?: boolean;
  badgeAr?: string;
  badgeEn?: string;
  frameBorderColor?: string;
  characterMascot?: 'ray' | 'laika' | 'albert';
}

export interface DailyMascotChallenge {
  id: string;
  mascot: 'ray' | 'laika' | 'albert';
  mascotNameAr: string;
  mascotNameEn: string;
  mascotAvatar: string;
  mascotRoleAr: string;
  mascotRoleEn: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  targetGameId: GameId;
  currentProgress: number;
  maxProgress: number;
  rewardXp: number;
  rewardCoins: number;
  completed: boolean;
  claimed: boolean;
}

export interface Achievement {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  unlocked: boolean;
  xpValue: number;
  gameId?: GameId;
}

export interface CoOpRoom {
  id: string;
  code: string;
  titleAr: string;
  titleEn: string;
  gameId: GameId;
  creatorName: string;
  creatorAvatar: string;
  playersCount: number;
  maxPlayers: number;
  status: 'lobby' | 'playing';
  isPrivate?: boolean;
}

export interface PlayerGameStats {
  totalGamesPlayed: number;
  totalWins: number;
  galaxyRescueWins: number;
  whoIsAlienWins: number;
  starshipChaosWins?: number;
  galaxyRushWins?: number;
  galaxyRushBestTime?: number;
  planetRescueWins?: number;
  challengeHighScore: number;
  totalPointsEarned: number;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  points: number;
  badgeAr: string;
  badgeEn: string;
  rank?: number;
  isCurrentUser?: boolean;
}

export interface CosmeticItem {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'head' | 'skin' | 'outfit' | 'accessory' | 'ship_model' | 'ship_trail';
  icon: string;
  priceCoins: number;
  minLevelReq: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  value: string; // CSS color, gradient or visual code
}

export interface AlienAvatarCustomization {
  headSpecies: string; // e.g., 'classic_alien', 'cyclops', 'astrocats', 'elemental'
  skinTint: string; // hex or color class
  outfit: string; // 'space_suit', 'cyber_armor', 'galactic_cloak', 'royal_robe'
  accessory: string; // 'visor_shades', 'antenna_star', 'crown', 'headset'
  titleBadgeAr: string;
  titleBadgeEn: string;
}

export interface StarshipCustomization {
  modelId: string; // 'phoenix_scout', 'cosmic_cruiser', 'nebula_interceptor', 'dreadnought'
  modelNameAr: string;
  modelNameEn: string;
  colorTheme: string;
  trailEffect: string; // 'quantum_blue', 'solar_orange', 'plasma_pink', 'void_purple'
}

export interface PlanetLocation {
  id: string;
  gameId?: GameId;
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  taglineEn: string;
  levelReq: number;
  color: string;
  bgGradient: string;
  icon: string;
  xPercent: number; // For interactive map
  yPercent: number;
  unlocked: boolean;
  type: 'game_planet' | 'citadel_hub' | 'boss_nebula';
}

export interface DailyQuest {
  id: string;
  titleAr: string;
  titleEn: string;
  rewardCoins: number;
  rewardXp: number;
  currentProgress: number;
  maxProgress: number;
  completed: boolean;
  gameId?: GameId;
}

export interface UniverseFriend {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  cosmicCoins: number;
  activeShip: string;
  currentPlanetAr: string;
  currentPlanetEn: string;
  isOnline: boolean;
  rank: number;
}

