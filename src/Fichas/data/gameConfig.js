// Configuración del juego de fichas
export const GAME_CONFIG = {
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 6,
  MIN_BET: 10,
  MAX_BET: 1000,
  DEFAULT_CHIPS: 1000,
  TARGET_SCORE: 100,
  FICHAS_RANGE: { MIN: 1, MAX: 99 },
};

// Estados del juego
export const GAME_STATES = {
  WAITING: 'waiting',
  BETTING: 'betting',
  DRAWING: 'drawing',
  REBETTING: 'rebetting',
  REVEALING: 'revealing',
  FINISHED: 'finished',
};

// Estados del jugador
export const PLAYER_STATES = {
  WAITING: 'waiting',
  BETTING: 'betting',
  PLAYING: 'playing',
  STAND: 'stand',
  BUST: 'bust',
  ACTIVE: 'active',
};

export default GAME_CONFIG;
