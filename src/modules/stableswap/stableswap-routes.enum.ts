export enum StableswapRoutes {
  root = '/',
  liquidity = '/liquidity',
  farming = '/farming'
}

export type StableswapContentRoutes = Extract<StableswapRoutes, StableswapRoutes.farming | StableswapRoutes.liquidity>;
