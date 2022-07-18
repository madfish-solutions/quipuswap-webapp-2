export enum StableswapLiquidityFormTabs {
  add = 'add',
  remove = 'remove',
  create = 'create'
}

export enum StableDividendsFormTabs {
  stake = 'stake',
  unstake = 'unstake'
}

export type StableswapFormTabs = StableDividendsFormTabs | StableswapLiquidityFormTabs;
