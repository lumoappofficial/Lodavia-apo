/**
 * Lodavia Orbits - Pure Game Logic Types
 * Aggravation / Jackaroo Cosmic Edition
 */

export type TeamId = 'blue' | 'gold' | 'emerald' | 'coral';

export type TokenLocationType = 'base' | 'track' | 'safety' | 'finished';

export interface OrbitsToken {
  id: string;              // e.g. 'blue-0', 'gold-2'
  team: TeamId;
  tokenIndex: number;      // 0..3
  label: string;           // e.g. 'ألفا-1'
  location: TokenLocationType;
  trackNode: number;       // 0..63 if on track, -1 otherwise
  stepsTraveled: number;   // 0..63 steps from entryNode along track
  safetyStep: number;      // 0..3 if in safety corridor, 4 if finished, -1 otherwise
}

export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface OrbitsCard {
  id: string;
  value: CardValue;
  nameAr: string;
  nameEn: string;
  descAr: string;
  symbol: string;
  canExitBase: boolean;
  themeColor: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export type MoveType = 'exit_base' | 'move_track' | 'enter_safety' | 'advance_safety' | 'finish';

export interface MoveAction {
  id: string;
  tokenId: string;
  team: TeamId;
  type: MoveType;
  steps: number;
  fromLocation: TokenLocationType;
  toLocation: TokenLocationType;
  fromIndex: number;        // track node or safety step or base slot
  toIndex: number;          // target track node or safety step
  capturedTokenId?: string; // If landing on opponent token
  descriptionAr: string;
}

export interface GameLogEntry {
  id: string;
  timestamp: number;
  turnNumber: number;
  team: TeamId;
  type: 'draw' | 'move' | 'capture' | 'exit' | 'finish' | 'pass' | 'win' | 'start';
  messageAr: string;
  cardValue?: CardValue;
  tokenId?: string;
  targetNode?: number;
}

export interface TeamConfig {
  id: TeamId;
  nameAr: string;
  nameEn: string;
  colorNameAr: string;
  colorHex: string;
  stationPos: { x: number; y: number };
  entryNode: number;       // 0 for blue, 16 for gold, 32 for emerald, 48 for coral
  preSafetyNode: number;   // 63 for blue, 15 for gold, 31 for emerald, 47 for coral
  safetyAngle: number;
}

export type TurnPhase = 'need_draw' | 'need_move' | 'turn_passed' | 'game_over';

export interface GameState {
  version: number;
  activeTeams: TeamId[];
  currentTurnIndex: number; // index in activeTeams
  turnNumber: number;
  phase: TurnPhase;
  currentCard: OrbitsCard | null;
  deck: OrbitsCard[];
  discardPile: OrbitsCard[];
  tokens: Record<string, OrbitsToken>; // key: tokenId
  validMoves: MoveAction[];
  selectedTokenId: string | null;
  selectedMove: MoveAction | null;
  winner: TeamId | null;
  logs: GameLogEntry[];
  scores: Record<TeamId, number>; // score/points
}

export interface GameConfig {
  activeTeams?: TeamId[];
  startingCardCount?: number;
  autoPassTimeoutMs?: number;
}
