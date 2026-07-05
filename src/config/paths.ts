export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },

  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    schema: {
      path: '/app/schema',
      getHref: () => '/app/schema',
    },
    query: {
      path: '/app/query',
      getHref: () => '/app/query',
    },
    connections: {
      path: '/app/connections',
      getHref: () => '/app/connections',
    },
    newConnection: {
      path: '/app/connections/new',
      getHref: () => '/app/connections/new',
    },
    history: {
      path: '/app/history',
      getHref: () => '/app/history',
    },
  },
} as const
