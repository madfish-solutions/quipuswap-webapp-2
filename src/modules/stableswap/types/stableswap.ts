export enum StableswapLiquidityFormTabs {
  add = 'add',
  remove = 'remove'
}

export enum StableDividendsFormTabs {
  stake = 'stake',
  unstake = 'unstake'
}

export type StableswapFormTabs = StableDividendsFormTabs | StableswapLiquidityFormTabs;
