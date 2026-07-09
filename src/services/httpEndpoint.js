// Route Paths
export const ENDPOINT = {
  PLAYERS: {
    LIST: '/api/v1/players',
    CREATE: '/api/v1/players',
    GET: (id) => `/api/v1/players/${id}`,
    UPDATE: (id) => `/api/v1/players/${id}`,
    DELETE: (id) => `/api/v1/players/${id}`,
    BULK_DELETE: '/api/v1/players/bulk-delete',
    HARD_DELETE: (id) => `/api/v1/players/${id}/hard-delete`,
    STATS: (id) => `/api/v1/players/${id}/stats`,
    RANDOM: '/api/v1/players/random',
  },
  GAMES: {
    START: '/api/v1/games/start',
    GUESS: (gameId) => `/api/v1/games/${gameId}/guess`,
    FINISH: (gameId) => `/api/v1/games/${gameId}/finish`,
    GET: (gameId) => `/api/v1/games/${gameId}`,
  },
  LEADERBOARD: {
    DAILY: '/api/v1/leaderboard/daily',
    GLOBAL: '/api/v1/leaderboard/global',
  },
  SETTINGS: {
    GET: '/api/v1/settings',
    UPDATE: '/api/v1/settings',
    BULK: '/api/v1/settings/bulk',
  },
  ANALYTICS: {
    OVERVIEW: '/api/v1/analytics/overview',
  },
};
