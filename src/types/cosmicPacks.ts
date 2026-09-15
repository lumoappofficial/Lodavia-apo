import { MascotSkin } from '../components/LodaviaMascot';

export type Rarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export type CosmeticType = 
  | 'AVATAR_FRAME'
  | 'PROFILE_BACKGROUND'
  | 'NAME_EFFECT'
  | 'TITLE'
  | 'BADGE'
  | 'PROFILE_EFFECT'
  | 'CHARACTER_SKIN'
  | 'CHARACTER_ACCESSORY'
  | 'CHARACTER_EFFECT'
  | 'ENTRY_EFFECT'
  | 'CREATOR_BADGE';

export type PackCategory = 
  | 'starter'
  | 'cosmic'
  | 'explorer'
  | 'legendary'
  | 'ai'
  | 'creator'
  | 'seasonal';

export interface CosmeticItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  type: CosmeticType;
  rarity: Rarity;
  image?: string; // Image URL or SVG string or icon emoji
  icon: string; // Emoji or short symbol
  previewCss?: string; // Inline CSS or Tailwind classes for frames/name effects/backgrounds
  animation?: string; // Optional CSS animation class
  packId: string;
  seasonId?: string;
  createdAt: string;
  isActive: boolean;
  mascotSkin?: MascotSkin; // If type === 'CHARACTER_SKIN'
}

export type PackMarketingBadge = 'best_seller' | 'new' | 'limited_time';

export interface CosmicPack {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: PackCategory;
  icon: string;
  bannerImage: string;
  price: number;
  currency: 'points' | 'shards' | 'event';
  rarityRangeAr: string;
  rarityRangeEn: string;
  possibleRewardIds: string[];
  availability: 'always' | 'limited' | 'seasonal' | 'event';
  isFreeDailyEligible?: boolean;
  marketingBadge?: PackMarketingBadge;
}

export interface EquippedCosmetics {
  frame?: string;
  background?: string;
  nameEffect?: string;
  title?: string;
  badge?: string;
  profileEffect?: string;
  characterSkin?: MascotSkin;
  characterAccessory?: string;
  characterEffect?: string;
}

export interface PackTransaction {
  id: string;
  userId: string;
  packId: string;
  cost: number;
  currency: 'points' | 'shards' | 'event';
  rewardItemId: string;
  isDuplicate: boolean;
  shardsAwarded: number;
  timestamp: string;
}
