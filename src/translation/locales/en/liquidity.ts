export const liquidity = {
  'Token A Locked': 'Token A Locked',
  'The amount of token A locked in the pool by liquidity providers.':
    'The amount of token A locked in the pool by liquidity providers.',
  'Token B Locked': 'Token B Locked',
  'The amount of token B locked in the pool by liquidity providers.':
    'The amount of token B locked in the pool by liquidity providers.',
  'Your Total LP': 'Your Total LP',
  yourTotalLPTooltip:
    "It's the number of liquidity tokens you currently hold in your wallet and stake in the Voting section.",
  'Your Frozen LP': 'Your Frozen LP',
  yourFrozenLPTooltip:
    'Shows how many your liquidity tokens were staked in the Voting section. If you want to unstake them - please, visit the Voting section and check the Vote and Veto tabs for this pool.',
  "Note! The pool doesn't exist. You will create the new one.":
    "Note! The pool doesn't exist. You will create the new one.",
  '{{tokenBSymbol}} Locked': '{{tokenBSymbol}} Locked',
  'The amount of {{tokenBSymbol}} locked in the pool by liquidity providers.':
    'The amount of {{tokenBSymbol}} locked in the pool by liquidity providers.',
  'Pair Analytics': 'Pair Analytics',
  'Pair Contract': 'Pair Contract',
  "Note! The pool doesn't exist": "Note! The pool doesn't exist",
  'Liquidity Page': 'Liquidity Page',
  "Total amount of this pool'styles LP tokens you will own after adding liquidity. LP (liquidity Pool) tokens represent your current share in a pool.":
    "Total amount of this pool'styles LP tokens you will own after adding liquidity. LP (liquidity Pool) tokens represent your current share in a pool.",
  Liquidity: 'Liquidity',
  invested: 'invested',
  received: 'received',
  // V2 (new liquidity)
  poolDetails: 'Pool Details',
  volume: 'Volume (7d)',
  TVL: 'TVL',
  tvl: 'Total Value Locked',
  tvlTooltip: 'Total amount of assets locked in pool.',
  tvlTooltipStats: 'Total amount of assets locked across all pools.',
  APR: 'APR',
  aprUpTo: 'APR up to',
  aprTooltip: 'Annual percentage rate which is earned by liquidity providers from trading fees.',
  maxApr: 'Max APR',
  maxAprTooltip: 'Highest annual percentage rate among all active farms on the QuipuSwap platform.',
  pools: 'Pools',
  poolsTooltip:
    'The total number of token pools on QuipuSwap, including stable pools, token-to-token pools, and tez-to-token pools.',
  feesRateTooltip: 'Trading fees charged in this pool.',
  totalLpSupplyTooltip: 'Number of liquidity provider tokens.',
  weeklyVolumeTooltip: 'How many assets were exchanged during the 7 days.',
  successful: 'Successful',
  createPool: 'Create Pool',
  regularPool: '2 assets with the volatile exchange rates',
  stablePool: 'From 2 to 4 tokens with the equal value',
  back: 'Back',
  noPool: 'Can’t find appropriate pool? Create own!',
  migrate: 'Migrate',
  assetsMigrated: 'Assets successfully migrated',
  successfullyAdded: 'Liquidity has been successfully added',
  successfullyRemoved: 'Liquidity has been successfully removed',
  bakerReward: 'Baker reward',
  heyBro: 'Hey, bro!',
  migrateAssets: 'Please, migrate your assets to the new ecxiting AMM version.',
  migrateAssetsTooltip:
    'New exchange version broadens earning opportunities by enabling flash loans as another income source. Also, Oracles feature allows a token listing in other Tezos platforms. New, improved governance for the baking rewards makes voting fair and baker rewards for liquidity providers more stable.',
  why: 'Why?',
  showDust: 'Show Dust',
  investedOnly: 'Invested Only',
  poolAlreadyExists: 'Pool already exists. Check out',
  here: 'here',
  emptyPoolWarning:
    'Note: you provide liquidity to the empty pool and initialise its exchange rates. Make sure the value of both assets is provided 50/50.',
  tooltipStableSwap: 'Stable',
  tooltipBridge: 'Bridge',
  tooltipQuipu: 'QuipuSwap',
  tooltipTezotopia: 'Tezotopia',
  tooltipBTC: 'BTC-based',
  tooltipDexTwo: 'Dex 2.0 Pools',
  currentBaker: 'Current baker',
  currentBakerTooltip:
    'A current baker elected by a simple majority of votes. All TEZ in the pool are delegated for him.',
  // Chart
  defaultChartText: 'Oops... Imagine a beautiful chart with pool reserves while we handle the issue.'
} as const;
