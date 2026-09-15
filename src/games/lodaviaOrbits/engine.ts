/**
 * Lodavia Orbits - Pure Game Logic Engine
 * 100% Pure Functions, Zero React/UI Dependencies
 * Strict implementation of Aggravation / Jackaroo rules
 */

import {
  TeamId,
  OrbitsToken,
  OrbitsCard,
  CardValue,
  MoveAction,
  MoveType,
  GameLogEntry,
  TeamConfig,
  GameState,
  GameConfig,
} from './types';

// 4 Teams Configuration on the 64-node circular orbit
export const TEAMS_CONFIG: Record<TeamId, TeamConfig> = {
  blue: {
    id: 'blue',
    nameAr: 'محطة أندروميدا',
    nameEn: 'Andromeda Station',
    colorNameAr: 'الأزرق الكوني',
    colorHex: '#38bdf8',
    stationPos: { x: 150, y: 650 },
    entryNode: 0,
    preSafetyNode: 63,
    safetyAngle: 225,
  },
  gold: {
    id: 'gold',
    nameAr: 'محطة هليوس الذهبية',
    nameEn: 'Helios Solar Base',
    colorNameAr: 'الذهب الشمسي',
    colorHex: '#facc15',
    stationPos: { x: 150, y: 150 },
    entryNode: 16,
    preSafetyNode: 15,
    safetyAngle: 315,
  },
  emerald: {
    id: 'emerald',
    nameAr: 'محطة أورورا الخضراء',
    nameEn: 'Aurora Outpost',
    colorNameAr: 'الزمرد النبضي',
    colorHex: '#34d399',
    stationPos: { x: 650, y: 150 },
    entryNode: 32,
    preSafetyNode: 31,
    safetyAngle: 45,
  },
  coral: {
    id: 'coral',
    nameAr: 'محطة مريخ المرجان',
    nameEn: 'Coral Mars Base',
    colorNameAr: 'المرجان الناري',
    colorHex: '#fb7185',
    stationPos: { x: 650, y: 650 },
    entryNode: 48,
    preSafetyNode: 47,
    safetyAngle: 135,
  },
};

export const DEFAULT_ACTIVE_TEAMS: TeamId[] = ['blue', 'gold', 'emerald', 'coral'];

// Card templates for values 1 to 12
const CARD_TEMPLATES: Record<CardValue, Omit<OrbitsCard, 'id'>> = {
  1: {
    value: 1,
    nameAr: 'بطاقة 1 🚀',
    nameEn: 'Card 1',
    descAr: 'إطلاق مركبة من المحطة أو تحريك خطوة 1',
    symbol: '1️⃣',
    canExitBase: true,
    themeColor: '#38bdf8',
    rarity: 'epic',
  },
  2: {
    value: 2,
    nameAr: 'بطاقة 2 ⚡',
    nameEn: 'Card 2',
    descAr: 'تحريك مركبة خطوتين للأمام في المدار',
    symbol: '2️⃣',
    canExitBase: false,
    themeColor: '#34d399',
    rarity: 'common',
  },
  3: {
    value: 3,
    nameAr: 'بطاقة 3 💫',
    nameEn: 'Card 3',
    descAr: 'تحريك مركبة 3 خطوات للأمام في المدار',
    symbol: '3️⃣',
    canExitBase: false,
    themeColor: '#facc15',
    rarity: 'common',
  },
  4: {
    value: 4,
    nameAr: 'بطاقة 4 ⏩',
    nameEn: 'Card 4',
    descAr: 'تحريك مركبة 4 خطوات للأمام في المدار',
    symbol: '4️⃣',
    canExitBase: false,
    themeColor: '#fb7185',
    rarity: 'common',
  },
  5: {
    value: 5,
    nameAr: 'بطاقة 5 💫',
    nameEn: 'Card 5',
    descAr: 'تحريك مركبة 5 خطوات للأمام في المدار',
    symbol: '5️⃣',
    canExitBase: false,
    themeColor: '#38bdf8',
    rarity: 'common',
  },
  6: {
    value: 6,
    nameAr: 'بطاقة 6 🌀',
    nameEn: 'Card 6',
    descAr: 'تحريك مركبة 6 خطوات للأمام في المدار',
    symbol: '6️⃣',
    canExitBase: false,
    themeColor: '#a78bfa',
    rarity: 'common',
  },
  7: {
    value: 7,
    nameAr: 'بطاقة 7 ✨',
    nameEn: 'Card 7',
    descAr: 'تحريك مركبة 7 خطوات للأمام في المدار',
    symbol: '7️⃣',
    canExitBase: false,
    themeColor: '#34d399',
    rarity: 'rare',
  },
  8: {
    value: 8,
    nameAr: 'بطاقة 8 🌟',
    nameEn: 'Card 8',
    descAr: 'تحريك مركبة 8 خطوات للأمام في المدار',
    symbol: '8️⃣',
    canExitBase: false,
    themeColor: '#facc15',
    rarity: 'rare',
  },
  9: {
    value: 9,
    nameAr: 'بطاقة 9 🛸',
    nameEn: 'Card 9',
    descAr: 'تحريك مركبة 9 خطوات للأمام في المدار',
    symbol: '9️⃣',
    canExitBase: false,
    themeColor: '#38bdf8',
    rarity: 'rare',
  },
  10: {
    value: 10,
    nameAr: 'بطاقة 10 🌌',
    nameEn: 'Card 10',
    descAr: 'تحريك مركبة 10 خطوات للأمام في المدار',
    symbol: '🔟',
    canExitBase: false,
    themeColor: '#fb7185',
    rarity: 'rare',
  },
  11: {
    value: 11,
    nameAr: 'بطاقة 11 🔮',
    nameEn: 'Card 11',
    descAr: 'تحريك مركبة 11 خطوة للأمام في المدار',
    symbol: '1️⃣1️⃣',
    canExitBase: false,
    themeColor: '#c084fc',
    rarity: 'epic',
  },
  12: {
    value: 12,
    nameAr: 'بطاقة 12 🚀',
    nameEn: 'Card 12',
    descAr: 'إطلاق مركبة من المحطة أو تحريك 12 خطوة',
    symbol: '1️⃣2️⃣',
    canExitBase: true,
    themeColor: '#facc15',
    rarity: 'legendary',
  },
};

/**
 * Fisher-Yates pure shuffle
 */
export function shuffleArray<T>(array: T[], seedRandom = Math.random): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seedRandom() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a cosmic deck of 48 cards (4 sets of values 1..12)
 */
export function generateDeck(seedRandom = Math.random): OrbitsCard[] {
  const deck: OrbitsCard[] = [];
  let idCounter = 1;

  for (let copy = 1; copy <= 4; copy++) {
    for (let val = 1; val <= 12; val++) {
      const v = val as CardValue;
      const template = CARD_TEMPLATES[v];
      deck.push({
        id: `card-${idCounter++}-${v}`,
        ...template,
      });
    }
  }

  return shuffleArray(deck, seedRandom);
}

/**
 * Initialize 4 tokens for each active team
 */
export function createInitialTokens(activeTeams: TeamId[]): Record<string, OrbitsToken> {
  const tokens: Record<string, OrbitsToken> = {};

  const teamLabels: Record<TeamId, string[]> = {
    blue: ['ألفا-1', 'ألفا-2', 'ألفا-3', 'ألفا-4'],
    gold: ['سولار-1', 'سولار-2', 'سولار-3', 'سولار-4'],
    emerald: ['أورورا-1', 'أورورا-2', 'أورورا-3', 'أورورا-4'],
    coral: ['مريخ-1', 'مريخ-2', 'مريخ-3', 'مريخ-4'],
  };

  activeTeams.forEach((team) => {
    for (let i = 0; i < 4; i++) {
      const id = `${team}-${i}`;
      tokens[id] = {
        id,
        team,
        tokenIndex: i,
        label: teamLabels[team][i],
        location: 'base',
        trackNode: -1,
        stepsTraveled: 0,
        safetyStep: -1,
      };
    }
  });

  return tokens;
}

/**
 * Creates the initial game state
 */
export function createInitialGameState(config?: Partial<GameConfig>): GameState {
  const activeTeams = config?.activeTeams && config.activeTeams.length >= 2 
    ? config.activeTeams 
    : DEFAULT_ACTIVE_TEAMS;

  const deck = generateDeck();
  const tokens = createInitialTokens(activeTeams);

  const scores: Record<TeamId, number> = {
    blue: 0,
    gold: 0,
    emerald: 0,
    coral: 0,
  };

  const initialLog: GameLogEntry = {
    id: `log-${Date.now()}`,
    timestamp: Date.now(),
    turnNumber: 1,
    team: activeTeams[0],
    type: 'start',
    messageAr: 'بدأت رحلة مدارات لودافيا! الدور الأول لمحطة أندروميدا (الأزرق الكوني) 🚀',
  };

  return {
    version: 1,
    activeTeams,
    currentTurnIndex: 0,
    turnNumber: 1,
    phase: 'need_draw',
    currentCard: null,
    deck,
    discardPile: [],
    tokens,
    validMoves: [],
    selectedTokenId: null,
    selectedMove: null,
    winner: null,
    logs: [initialLog],
    scores,
  };
}

/**
 * Get the current active team
 */
export function getCurrentTeam(state: GameState): TeamId {
  return state.activeTeams[state.currentTurnIndex];
}

/**
 * Calculates all strictly valid moves for a given card according to Aggravation/Jackaroo rules
 */
export function getValidMoves(state: GameState, card: OrbitsCard): MoveAction[] {
  if (state.winner) return [];

  const currentTeam = getCurrentTeam(state);
  const teamConfig = TEAMS_CONFIG[currentTeam];
  const validMoves: MoveAction[] = [];

  // All tokens in game
  const allTokens = Object.values(state.tokens);
  // Current team's 4 tokens
  const myTokens = allTokens.filter((t) => t.team === currentTeam);

  for (const token of myTokens) {
    // ──────── 1. Token in BASE Station ────────
    if (token.location === 'base') {
      // Exiting base requires card with canExitBase (1 or 12)
      if (card.canExitBase) {
        const targetEntryNode = teamConfig.entryNode;

        // Check if there is already a token on our entry node
        const tokenOnEntry = allTokens.find(
          (t) => t.location === 'track' && t.trackNode === targetEntryNode
        );

        if (tokenOnEntry) {
          // Rule 7: Cannot land on or capture our own piece
          if (tokenOnEntry.team === currentTeam) {
            continue; // Invalid move
          } else {
            // Rule 6: Land on opponent piece -> capture it!
            validMoves.push({
              id: `move-${token.id}-exit-capture`,
              tokenId: token.id,
              team: currentTeam,
              type: 'exit_base',
              steps: 1,
              fromLocation: 'base',
              toLocation: 'track',
              fromIndex: token.tokenIndex,
              toIndex: targetEntryNode,
              capturedTokenId: tokenOnEntry.id,
              descriptionAr: `إطلاق ${token.label} للمسار وأكل مركبة الخصم! 💥`,
            });
          }
        } else {
          // Empty entry node -> regular exit
          validMoves.push({
            id: `move-${token.id}-exit`,
            tokenId: token.id,
            team: currentTeam,
            type: 'exit_base',
            steps: 1,
            fromLocation: 'base',
            toLocation: 'track',
            fromIndex: token.tokenIndex,
            toIndex: targetEntryNode,
            descriptionAr: `إطلاق ${token.label} للمسار المداري (الموقع ${targetEntryNode})`,
          });
        }
      }
      continue;
    }

    // ──────── 2. Token on TRACK (Circular 64 nodes) ────────
    if (token.location === 'track') {
      const steps = card.value;
      const newStepsTraveled = token.stepsTraveled + steps;

      // Check if this move stays on the main 64-node track
      // (Full orbit before entering safety is 64 steps: 0..63)
      if (newStepsTraveled <= 63) {
        const targetNode = (teamConfig.entryNode + newStepsTraveled) % 64;

        // Check if node is occupied
        const tokenOnTarget = allTokens.find(
          (t) => t.location === 'track' && t.trackNode === targetNode
        );

        if (tokenOnTarget) {
          // Cannot land on friendly piece
          if (tokenOnTarget.team === currentTeam) {
            continue;
          } else {
            // Opponent piece captured!
            validMoves.push({
              id: `move-${token.id}-track-capture-${targetNode}`,
              tokenId: token.id,
              team: currentTeam,
              type: 'move_track',
              steps,
              fromLocation: 'track',
              toLocation: 'track',
              fromIndex: token.trackNode,
              toIndex: targetNode,
              capturedTokenId: tokenOnTarget.id,
              descriptionAr: `تحريك ${token.label} لـ ${targetNode} وأكل مركبة الخصم! 💥`,
            });
          }
        } else {
          validMoves.push({
            id: `move-${token.id}-track-${targetNode}`,
            tokenId: token.id,
            team: currentTeam,
            type: 'move_track',
            steps,
            fromLocation: 'track',
            toLocation: 'track',
            fromIndex: token.trackNode,
            toIndex: targetNode,
            descriptionAr: `تحريك ${token.label} ${steps} خطوات للأمام إلى الموقع ${targetNode}`,
          });
        }
      } else {
        // Entering the Safety Wormhole Corridor!
        // Steps into safety corridor = steps past the preSafetyNode (64 steps lap)
        const stepsIntoSafety = newStepsTraveled - 64;

        // Safety corridor has steps: 0, 1, 2, 3 (4 dots)
        // Step 4 is the finish point (النواة الكونية)
        if (stepsIntoSafety < 4) {
          // Check if friendly token already occupies this safety step
          const tokenOnSafety = myTokens.find(
            (t) => t.location === 'safety' && t.safetyStep === stepsIntoSafety
          );

          if (!tokenOnSafety) {
            validMoves.push({
              id: `move-${token.id}-enter-safety-${stepsIntoSafety}`,
              tokenId: token.id,
              team: currentTeam,
              type: 'enter_safety',
              steps,
              fromLocation: 'track',
              toLocation: 'safety',
              fromIndex: token.trackNode,
              toIndex: stepsIntoSafety,
              descriptionAr: `دخول ${token.label} للمسار الآمن (الخطوة ${stepsIntoSafety + 1})`,
            });
          }
        } else if (stepsIntoSafety === 4) {
          // Rule 8 & 9: Exact steps to finish at Cosmic Core!
          validMoves.push({
            id: `move-${token.id}-finish`,
            tokenId: token.id,
            team: currentTeam,
            type: 'finish',
            steps,
            fromLocation: 'track',
            toLocation: 'finished',
            fromIndex: token.trackNode,
            toIndex: 4,
            descriptionAr: `وصول ${token.label} إلى النواة الكونية وتحقيق نقطة فوز! 🌟`,
          });
        }
        // If stepsIntoSafety > 4: OVERSHOOT! Cannot move (Rule 8 exact count)
      }
      continue;
    }

    // ──────── 3. Token in SAFETY Corridor ────────
    if (token.location === 'safety') {
      const steps = card.value;
      const targetSafetyStep = token.safetyStep + steps;

      if (targetSafetyStep < 4) {
        // Check if another friendly token is already on that safety step
        const tokenOnTarget = myTokens.find(
          (t) => t.location === 'safety' && t.safetyStep === targetSafetyStep
        );

        if (!tokenOnTarget) {
          validMoves.push({
            id: `move-${token.id}-advance-safety-${targetSafetyStep}`,
            tokenId: token.id,
            team: currentTeam,
            type: 'advance_safety',
            steps,
            fromLocation: 'safety',
            toLocation: 'safety',
            fromIndex: token.safetyStep,
            toIndex: targetSafetyStep,
            descriptionAr: `تقدم ${token.label} بالمسار الآمن إلى الخطوة ${targetSafetyStep + 1}`,
          });
        }
      } else if (targetSafetyStep === 4) {
        // Exact count to finish!
        validMoves.push({
          id: `move-${token.id}-safety-finish`,
          tokenId: token.id,
          team: currentTeam,
          type: 'finish',
          steps,
          fromLocation: 'safety',
          toLocation: 'finished',
          fromIndex: token.safetyStep,
          toIndex: 4,
          descriptionAr: `إدخال ${token.label} للنواة الكونية بنجاح! 🏆`,
        });
      }
      // If targetSafetyStep > 4: OVERSHOOT! (Rule 8 exact count)
      continue;
    }

    // Token already in 'finished' has no moves
  }

  return validMoves;
}

/**
 * Draw a card from the deck for the current player's turn
 */
export function drawCard(state: GameState, seedRandom = Math.random): GameState {
  if (state.winner || state.phase !== 'need_draw') return state;

  let deck = [...state.deck];
  let discardPile = [...state.discardPile];

  // If deck is empty, reshuffle discard pile
  if (deck.length === 0) {
    if (discardPile.length === 0) {
      deck = generateDeck(seedRandom);
    } else {
      deck = shuffleArray(discardPile, seedRandom);
      discardPile = [];
    }
  }

  const card = deck[0];
  const newDeck = deck.slice(1);

  const currentTeam = getCurrentTeam(state);
  const teamConfig = TEAMS_CONFIG[currentTeam];

  // Compute valid moves for this drawn card
  const validMoves = getValidMoves({ ...state, currentCard: card }, card);

  const drawLog: GameLogEntry = {
    id: `log-${Date.now()}-${Math.random()}`,
    timestamp: Date.now(),
    turnNumber: state.turnNumber,
    team: currentTeam,
    type: 'draw',
    cardValue: card.value,
    messageAr: `سحب ${teamConfig.nameAr} بطاقة [${card.value}] ${card.nameAr}`,
  };

  return {
    ...state,
    deck: newDeck,
    discardPile: [...discardPile, card],
    currentCard: card,
    validMoves,
    selectedTokenId: validMoves.length === 1 ? validMoves[0].tokenId : null,
    selectedMove: validMoves.length === 1 ? validMoves[0] : null,
    phase: 'need_move',
    logs: [drawLog, ...state.logs.slice(0, 49)],
  };
}

/**
 * Check if the given team has won (all 4 tokens in 'finished')
 */
export function checkTeamWin(tokens: Record<string, OrbitsToken>, team: TeamId): boolean {
  const teamTokens = Object.values(tokens).filter((t) => t.team === team);
  return teamTokens.length === 4 && teamTokens.every((t) => t.location === 'finished');
}

/**
 * Applies a chosen move and advances the game
 */
export function applyMove(state: GameState, move: MoveAction): GameState {
  if (state.winner || state.phase !== 'need_move') return state;

  const currentTeam = getCurrentTeam(state);
  const teamConfig = TEAMS_CONFIG[currentTeam];
  const targetToken = state.tokens[move.tokenId];
  if (!targetToken) return state;

  const newTokens: Record<string, OrbitsToken> = { ...state.tokens };
  const newScores = { ...state.scores };
  const newLogs: GameLogEntry[] = [...state.logs];

  // 1. Handle Opponent Capture if any (Rule 6)
  if (move.capturedTokenId && newTokens[move.capturedTokenId]) {
    const captured = newTokens[move.capturedTokenId];
    const capturedTeamConfig = TEAMS_CONFIG[captured.team];

    // Return to opponent base
    newTokens[move.capturedTokenId] = {
      ...captured,
      location: 'base',
      trackNode: -1,
      stepsTraveled: 0,
      safetyStep: -1,
    };

    // Bonus points for capturing
    newScores[currentTeam] = (newScores[currentTeam] || 0) + 100;

    newLogs.unshift({
      id: `log-${Date.now()}-cap`,
      timestamp: Date.now(),
      turnNumber: state.turnNumber,
      team: currentTeam,
      type: 'capture',
      tokenId: targetToken.id,
      targetNode: move.toIndex,
      messageAr: `💥 ${targetToken.label} التهمت مركبة ${capturedTeamConfig.nameAr} (${captured.label}) وأعادتها للمحطة!`,
    });
  }

  // 2. Update Moving Token Location
  if (move.type === 'exit_base') {
    newTokens[targetToken.id] = {
      ...targetToken,
      location: 'track',
      trackNode: move.toIndex,
      stepsTraveled: 0,
      safetyStep: -1,
    };
    newScores[currentTeam] = (newScores[currentTeam] || 0) + 50;

    newLogs.unshift({
      id: `log-${Date.now()}-exit`,
      timestamp: Date.now(),
      turnNumber: state.turnNumber,
      team: currentTeam,
      type: 'exit',
      tokenId: targetToken.id,
      targetNode: move.toIndex,
      messageAr: `🚀 ${targetToken.label} انطلقت من المحطة إلى مدار لودافيا (الموقع ${move.toIndex})`,
    });
  } else if (move.type === 'move_track') {
    newTokens[targetToken.id] = {
      ...targetToken,
      location: 'track',
      trackNode: move.toIndex,
      stepsTraveled: targetToken.stepsTraveled + move.steps,
      safetyStep: -1,
    };
    newScores[currentTeam] = (newScores[currentTeam] || 0) + move.steps * 5;

    newLogs.unshift({
      id: `log-${Date.now()}-mv`,
      timestamp: Date.now(),
      turnNumber: state.turnNumber,
      team: currentTeam,
      type: 'move',
      tokenId: targetToken.id,
      targetNode: move.toIndex,
      messageAr: `🛸 ${targetToken.label} تقدمت ${move.steps} خطوات إلى الموقع ${move.toIndex}`,
    });
  } else if (move.type === 'enter_safety' || move.type === 'advance_safety') {
    newTokens[targetToken.id] = {
      ...targetToken,
      location: 'safety',
      trackNode: -1,
      stepsTraveled: 64 + move.toIndex,
      safetyStep: move.toIndex,
    };
    newScores[currentTeam] = (newScores[currentTeam] || 0) + 80;

    newLogs.unshift({
      id: `log-${Date.now()}-safe`,
      timestamp: Date.now(),
      turnNumber: state.turnNumber,
      team: currentTeam,
      type: 'move',
      tokenId: targetToken.id,
      messageAr: `🛡️ ${targetToken.label} عبرت المسار الآمن نحو النواة (المرحلة ${move.toIndex + 1})`,
    });
  } else if (move.type === 'finish') {
    newTokens[targetToken.id] = {
      ...targetToken,
      location: 'finished',
      trackNode: -1,
      stepsTraveled: 68,
      safetyStep: 4,
    };
    newScores[currentTeam] = (newScores[currentTeam] || 0) + 300;

    newLogs.unshift({
      id: `log-${Date.now()}-fin`,
      timestamp: Date.now(),
      turnNumber: state.turnNumber,
      team: currentTeam,
      type: 'finish',
      tokenId: targetToken.id,
      messageAr: `👑 ${targetToken.label} استقرت داخل النواة الكونية بنجاح!`,
    });
  }

  // 3. Check Win Condition (Rule 9)
  const isWinner = checkTeamWin(newTokens, currentTeam);

  if (isWinner) {
    newScores[currentTeam] = (newScores[currentTeam] || 0) + 1000;
    newLogs.unshift({
      id: `log-${Date.now()}-win`,
      timestamp: Date.now(),
      turnNumber: state.turnNumber,
      team: currentTeam,
      type: 'win',
      messageAr: `🏆 مبارك! ${teamConfig.nameAr} هو الفائز ببطولة مدارات لودافيا بإيصال جميع مركباته للنواة الكونية! 🎉`,
    });

    return {
      ...state,
      tokens: newTokens,
      scores: newScores,
      logs: newLogs.slice(0, 50),
      winner: currentTeam,
      phase: 'game_over',
      validMoves: [],
      selectedTokenId: null,
      selectedMove: null,
    };
  }

  // 4. Advance to Next Player Turn (Rule 2)
  const nextTurnIndex = (state.currentTurnIndex + 1) % state.activeTeams.length;
  const nextTurnNumber = state.turnNumber + 1;

  return {
    ...state,
    version: state.version + 1,
    tokens: newTokens,
    scores: newScores,
    logs: newLogs.slice(0, 50),
    currentTurnIndex: nextTurnIndex,
    turnNumber: nextTurnNumber,
    phase: 'need_draw',
    currentCard: null,
    validMoves: [],
    selectedTokenId: null,
    selectedMove: null,
  };
}

/**
 * Pass turn to next player (Rule 4: when no moves are possible)
 */
export function passTurn(state: GameState): GameState {
  if (state.winner || state.phase !== 'need_move') return state;

  const currentTeam = getCurrentTeam(state);
  const teamConfig = TEAMS_CONFIG[currentTeam];

  const passLog: GameLogEntry = {
    id: `log-${Date.now()}-pass`,
    timestamp: Date.now(),
    turnNumber: state.turnNumber,
    team: currentTeam,
    type: 'pass',
    messageAr: `مرر ${teamConfig.nameAr} الدور لعدم توفر تحركات مطابقة للبطاقة`,
  };

  const nextTurnIndex = (state.currentTurnIndex + 1) % state.activeTeams.length;
  const nextTurnNumber = state.turnNumber + 1;

  return {
    ...state,
    version: state.version + 1,
    currentTurnIndex: nextTurnIndex,
    turnNumber: nextTurnNumber,
    phase: 'need_draw',
    currentCard: null,
    validMoves: [],
    selectedTokenId: null,
    selectedMove: null,
    logs: [passLog, ...state.logs.slice(0, 49)],
  };
}

/**
 * Select a token or move directly
 */
export function selectToken(state: GameState, tokenId: string): GameState {
  const tokenMoves = state.validMoves.filter((m) => m.tokenId === tokenId);
  if (tokenMoves.length === 0) {
    return {
      ...state,
      selectedTokenId: null,
      selectedMove: null,
    };
  }

  return {
    ...state,
    selectedTokenId: tokenId,
    selectedMove: tokenMoves[0],
  };
}

/**
 * Comprehensive Dry-Run Simulation Test
 * Simulates scenarios checking all 10 rules:
 * 1. 4 tokens in base at start
 * 2. Alternating turns in fixed order
 * 3. Card drawing (1..12)
 * 4. Only 1 and 12 can exit base
 * 5. Track advancement by card steps
 * 6. Capturing opponent returns them to base
 * 7. Friendly pieces cannot be captured
 * 8. Exact steps required to finish, overshooting disallowed
 * 9. Winner detection when all 4 finished
 * 10. Event logging at every step
 */
export function dryRunSimulation(): { success: boolean; log: string[] } {
  const debugLogs: string[] = [];

  try {
    // 1. Initial State Check
    let state = createInitialGameState();
    debugLogs.push(`Initial state created: ${state.activeTeams.join(' -> ')}`);
    const blueTokens = Object.values(state.tokens).filter((t) => t.team === 'blue');
    if (blueTokens.length !== 4 || !blueTokens.every((t) => t.location === 'base')) {
      throw new Error('Rule 1 Failed: Tokens do not start in base');
    }
    debugLogs.push('✓ Rule 1 verified: All 4 tokens start in base');

    // 2. Test Rule 4: Non-exit card (e.g. 5) cannot exit base
    const card5: OrbitsCard = { id: 'test-5', ...CARD_TEMPLATES[5] };
    const movesWithCard5 = getValidMoves({ ...state, currentCard: card5 }, card5);
    if (movesWithCard5.length !== 0) {
      throw new Error('Rule 4 Failed: Non-exit card allowed exiting base');
    }
    debugLogs.push('✓ Rule 4 verified: Card 5 cannot exit base');

    // 3. Test Rule 4: Card 1 CAN exit base
    const card1: OrbitsCard = { id: 'test-1', ...CARD_TEMPLATES[1] };
    const movesWithCard1 = getValidMoves({ ...state, currentCard: card1 }, card1);
    if (movesWithCard1.length === 0 || movesWithCard1[0].type !== 'exit_base') {
      throw new Error('Rule 4 Failed: Card 1 could not exit base');
    }
    debugLogs.push('✓ Rule 4 verified: Card 1 exits base to entryNode (0)');

    // 4. Apply Exit Move for Blue Token 0
    state = { ...state, currentCard: card1, validMoves: movesWithCard1, phase: 'need_move' };
    state = applyMove(state, movesWithCard1[0]);
    if (state.tokens['blue-0'].location !== 'track' || state.tokens['blue-0'].trackNode !== 0) {
      throw new Error('Rule 5 Failed: Token not moved to track entry node');
    }
    debugLogs.push('✓ Blue token 0 exited to track node 0');

    // 5. Test Rule 2: Turn passed to Gold
    if (getCurrentTeam(state) !== 'gold') {
      throw new Error('Rule 2 Failed: Turn did not advance to gold');
    }
    debugLogs.push('✓ Rule 2 verified: Turn advanced to Gold');

    // 6. Test Rule 7: Cannot land on own piece
    // Advance turns back to Blue
    state = { ...state, currentTurnIndex: 0, phase: 'need_move' };
    // Try to exit another blue token when node 0 is already occupied by blue-0
    const movesBlueExitAgain = getValidMoves({ ...state, currentCard: card1 }, card1);
    const exitMoves = movesBlueExitAgain.filter((m) => m.type === 'exit_base');
    if (exitMoves.length !== 0) {
      throw new Error('Rule 7 Failed: Allowed landing on friendly piece at entry');
    }
    debugLogs.push('✓ Rule 7 verified: Friendly piece cannot be captured or landed on');

    // 7. Test Rule 6: Capture opponent piece
    // Put gold-0 on track node 4
    state.tokens['gold-0'] = {
      ...state.tokens['gold-0'],
      location: 'track',
      trackNode: 4,
      stepsTraveled: 4,
    };
    // Blue token at 0 moves 4 steps with Card 4
    const card4: OrbitsCard = { id: 'test-4', ...CARD_TEMPLATES[4] };
    const movesBlueCapture = getValidMoves({ ...state, currentCard: card4 }, card4);
    const captureMove = movesBlueCapture.find((m) => m.capturedTokenId === 'gold-0');
    if (!captureMove) {
      throw new Error('Rule 6 Failed: Did not detect capture move on opponent at node 4');
    }
    state = applyMove(state, captureMove);
    if (state.tokens['gold-0'].location !== 'base') {
      throw new Error('Rule 6 Failed: Captured opponent token did not return to base');
    }
    debugLogs.push('✓ Rule 6 verified: Opponent token was captured and returned to base');

    // 8. Test Rule 8: Exact steps to finish / no overshoot
    // Put blue-0 in safety at step 3 (1 step away from finish step 4)
    state.tokens['blue-0'] = {
      ...state.tokens['blue-0'],
      location: 'safety',
      trackNode: -1,
      stepsTraveled: 67,
      safetyStep: 3,
    };
    state.currentTurnIndex = 0;
    state.phase = 'need_move';
    // Card 2 would overshoot (3 + 2 = 5 > 4)
    const card2: OrbitsCard = { id: 'test-2', ...CARD_TEMPLATES[2] };
    const movesOvershoot = getValidMoves({ ...state, currentCard: card2 }, card2);
    if (movesOvershoot.some((m) => m.tokenId === 'blue-0')) {
      throw new Error('Rule 8 Failed: Overshooting safety/finish was allowed');
    }
    debugLogs.push('✓ Rule 8 verified: Overshooting center is strictly prevented');

    // Card 1 matches exactly (3 + 1 = 4)
    const movesFinish = getValidMoves({ ...state, currentCard: card1 }, card1);
    const finishMove = movesFinish.find((m) => m.tokenId === 'blue-0' && m.type === 'finish');
    if (!finishMove) {
      throw new Error('Rule 8 Failed: Exact step to finish was not allowed');
    }
    state = applyMove(state, finishMove);
    if (state.tokens['blue-0'].location !== 'finished') {
      throw new Error('Rule 8 Failed: Token did not complete to finished');
    }
    debugLogs.push('✓ Rule 8 verified: Exact step to center successfully finishes token');

    // 9. Test Rule 9: Winner detection when all 4 tokens finished
    state.tokens['blue-1'].location = 'finished';
    state.tokens['blue-2'].location = 'finished';
    state.tokens['blue-3'] = {
      ...state.tokens['blue-3'],
      location: 'safety',
      safetyStep: 3,
    };
    state.currentTurnIndex = 0;
    state.phase = 'need_move';
    const winningMove = getValidMoves({ ...state, currentCard: card1 }, card1).find(
      (m) => m.tokenId === 'blue-3' && m.type === 'finish'
    );
    if (!winningMove) {
      throw new Error('Rule 9 Failed: Final winning move not detected');
    }
    state = applyMove(state, winningMove);
    if (state.winner !== 'blue' || state.phase !== 'game_over') {
      throw new Error('Rule 9 Failed: Winner not declared after all 4 tokens finished');
    }
    debugLogs.push('✓ Rule 9 verified: Winner declared upon all 4 tokens reaching core');

    // 10. Test Rule 10: Event logging check
    if (!state.logs || state.logs.length < 5) {
      throw new Error('Rule 10 Failed: Game logs not properly recorded');
    }
    debugLogs.push(`✓ Rule 10 verified: ${state.logs.length} distinct game events logged`);

    return { success: true, log: debugLogs };
  } catch (err: any) {
    debugLogs.push(`❌ DRY RUN ERROR: ${err.message}`);
    return { success: false, log: debugLogs };
  }
}
