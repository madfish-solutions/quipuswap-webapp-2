export enum StableswapRoutes {
  root = '/',
  liquidity = '/liquidity',
  dividends = '/dividends'
}

export type StableswapContentRoutes = Extract<
  StableswapRoutes,
  StableswapRoutes.dividends | StableswapRoutes.liquidity
>;
