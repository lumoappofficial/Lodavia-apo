export interface ParallelIdentity {
  title: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  outfit: string;
  aura: string;
  vehicle: string;
  accessory: string;
  auraColor: string;
  skills: Array<{ nameAr: string; nameEn: string; level: number; icon: string }>;
}

export interface PlanetRegion {
  id: 'ideas' | 'games' | 'knowledge' | 'creator' | 'project' | 'community' | 'ai_lab' | 'future_gate';
  nameAr: string;
  nameEn: string;
  icon: string;
  descriptionAr: string;
  descriptionEn: string;
  color: string;
  glowColor: string;
  bgGradient: string;
  orbitRadius: number; // For map positioning
  orbitAngle: number;  // Initial angle in degrees
  stats: { labelAr: string; labelEn: string; value: string };
  activitiesCount: number;
  unlocked: boolean;
}

export interface ParallelGate {
  id: 'future' | 'unknown' | 'coop' | 'idea' | 'time';
  nameAr: string;
  nameEn: string;
  icon: string;
  descriptionAr: string;
  descriptionEn: string;
  badge: string;
  gradient: string;
}

export interface WhatIfChoice {
  id: string;
  textAr: string;
  textEn: string;
  outcomeAr: string;
  outcomeEn: string;
}

export interface WhatIfScenario {
  scenarioTitle: string;
  possibleFuture: string;
  opportunities: string[];
  risks: string[];
  choices: WhatIfChoice[];
}

export interface PersonalBuilding {
  id: string;
  type: 'idea_seed' | 'project_tower' | 'knowledge_spire' | 'helping_star' | 'game_trophy' | 'community_portal';
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  level: number;
  icon: string;
  createdDate: string;
}

export interface GlobalEvent {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  progress: number;
  target: number;
  participantsCount: number;
  badgeAr: string;
  badgeEn: string;
  rewardXp: number;
}

export interface ParallelAchievement {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  unlocked: boolean;
  xpReward: number;
}

export interface ExplorerUser {
  id: string;
  name: string;
  avatar: string;
  title: string;
  level: number;
  status: string;
  planetId: string;
}
