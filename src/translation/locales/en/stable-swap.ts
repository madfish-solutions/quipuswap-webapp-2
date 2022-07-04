export const stableswap = {
  token: 'Token',
  claimable: 'Claimable',
  tvl: 'TVL',
  apr: 'APR',
  apy: 'APY',
  deposit: 'Deposit',
  earned: 'Earned',
  liquidityProvidersFee: 'Liquidity providers fee',
  'Whitelisted Only': 'Whitelisted Only',
  stakedOnly: 'Staked Only',
  'Total LP Supply': 'Total LP Supply',
  'Interface Fee': 'Interface Fee',
  'QUIPU Stakers Fee': 'QUIPU Stakers Fee',
  'Dev Fee': 'Dev Fee',
  'Token {{tokenSymbol}} locked': 'Token {{tokenSymbol}} locked',
  balancedProportionAdd: 'Add all coins in a balanced proportion',
  balancedProportionRemove: 'Remove all coins in a balanced proportion',
  sucessfullyAdded: 'Liquidity has been successfully added',
  sucessfullyRemoved: 'Liquidity has been successfully removed',
  sucessfullyStaked: 'Stake has been successfull',
  sucessfullyUnstaked: 'Unstake has been successfull',
  sucessfullyHarvested: 'Harvest has been successfull',
  createPool: 'Create Pool',
  createOwnPool: 'Can’t Find appropriate pool? Create Own!',
  yourDeposit: 'Your Deposit',
  yourEarned: 'Your Earned',
  stableDividendsTitle: 'Stable Swap Dividends',
  allZeroInpupts: "Investing of 0 assets doesn't make a lot of sense. Please, provide at least one non-zero input.",
  dexContract: 'Dex Contract',
  APR: 'APR',
  valueLocked: 'Value Locked',
  Tags: 'Tags',
  totalValueLocked: 'Total Value Locked',
  yourShare: 'Your Share',
  yourShareTooltip: 'Current value of your stake in this farm.',
  Harvest: 'Harvest',
  harvestAll: 'Harvest All',
  poolAddress: 'Pool Address',
  poolId: 'Pool ID',
  tvlProtocolTooltip: 'Total value of assets locked in the Stableswap protocol.',
  tvlPoolTooltip: 'Total value of assets locked in this farm farms.',
  tokenValuesTooltip: 'Value of type of asset locked in this farm.',
  liquidityProvidersFeeTooltip:
    "The percentage of your swapped sum you pay to the pool's liquidity providers on each swap.",
  pairAddress: 'Direct smart contract address for this farm.',
  pairId: 'The ID number of the LP token for this pair. (Default ID is 0)',
  totalLPSupply: 'The total amount of LP tokens issued by this pool.',
  liquidityProviersFee:
    'This fee is divided between the liquidity providers in proportion to their share size in the pool.',
  interfaceFee: 'A fee for using the farming interface. Goes to the interface devs.',
  quipuStakersFee: 'This fee is proportionally distributed among the users who staked QUIPU under this pool.',
  devFee: 'The fee is charged by QuipuSwap team on each swap.',
  coinsBalancedProportion:
    "Automatically match input balances for all selected assets according to the current asset ratio in the pool. Input value will be proportionally higher the asset's current representation in the pool is.",
  tokenAmountLocked: 'The amount of {{tokenName}} locked within this pool by liquidity providers.'
} as const;
