export enum StableswapLiquidityFormTabs {
  add = 'add',
  remove = 'remove'
}

export enum StableFarmFormTabs {
  stake = 'stake',
  unstake = 'unstake'
}

export type StableswapFormTabs = StableFarmFormTabs | StableswapLiquidityFormTabs;
