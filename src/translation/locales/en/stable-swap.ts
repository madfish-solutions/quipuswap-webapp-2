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
  successfullyAdded: 'Liquidity has been successfully added',
  successfullyRemoved: 'Liquidity has been successfully removed',
  successfullyStaked: 'Stake has been successful',
  successfullyUnstaked: 'Unstake has been successful',
  successfullyHarvested: 'Harvest has been successful',
  createPool: 'Create Pool',
  createOwnPool: 'Can’t Find appropriate pool? Create Own!',
  yourDeposit: 'Your Deposit',
  yourEarned: 'Your Earned',
  stableDividendsTitle: 'Stableswap Dividends',
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
  tvlPoolTooltip: 'Total value of assets locked in this Stable DEX pool.',
  tokenValuesTooltip: 'Value of type of asset locked in this farm.',
  liquidityProvidersFeeTooltip:
    "The percentage of your swapped sum you pay to the pool's liquidity providers on each swap.",
  pairAddress: 'Direct smart contract address for this farm.',
  pairId: 'The ID number of the LP token for this pair. (Default ID is 0)',
  totalLPSupply: 'The total amount of LP tokens issued by this pool.',
  liquidityProvidersFeeFeeDescription:
    'This fee is divided between the liquidity providers in proportion to their share size in the pool.',
  interfaceFee: 'A fee for using the farming interface. Goes to the interface devs.',
  quipuStakersFee: 'This fee is proportionally distributed among the users who staked QUIPU under this pool.',
  devFee: 'The fee is charged by QuipuSwap team on each swap.',
  coinsBalancedProportion:
    "Automatically match input balances for all selected assets according to the current asset ratio in the pool. Input value will be proportionally higher the asset's current representation in the pool is.",
  tokenAmountLocked: 'The amount of {{tokenName}} locked within this pool by liquidity providers.',
  selectTokens: 'Select 2–4 Tokens',
  fees: 'Fees',
  feesRate: 'Fees rate',
  amplificationParameters: 'A (amplification parameters)',
  amplification10: '10 (uncollateralized algoritmic stablecoins)',
  amplification100: '100 (non-redeemable, collateralized assets)',
  amplification200: '200 (redeemable assets)',
  noMoreDecimals: `The value can't be more than {{decimalsAmount}} decimals`,
  interfaceOrReferralFee: 'Interface/Referral Fee',
  cost: 'Cost',
  burnedCost: 'Burned',
  devFeeCost: 'Dev Fee',
  totalCost: 'Total',
  create: 'Create',
  newPool: 'New Pool',
  chooseTokensRecommendations: 'Choose from {{min}} to {{max}} tokens to create stableswap pool',

  //#region creation rules
  creationRules: 'Stable DEX liquidity pool creation rules',
  youMayCreatePool: 'With the aid of this tool, you may create token pools with equal value.',
  rules: 'Rules:',
  chooseTokens: 'Choose two to four equal-value Tezos-based tokens and put the starting values in the input field.',
  followingFees: ' By creating a pool, you will pay the following fees:',
  standardFee: 'Standard tezos blockchain fee for interaction with the smart-contract',
  ourFee:
    '{{price}} QUIPU, where {{halfPrice}} QUIPU are immediately burned, and {{halfPrice}} QUIPU will move to the QuipuSwap dev fund.',
  setupLiquidityProvidersFee: ' Set up a fee that will be paid to the liquidity providers of your pool.',
  maxLiquidityProviderFeeDecriptions:
    "The maximum fee is 1%, but we advise you to set the fee around 0.07% to balance out the provider's incentive and low transaction fees.",
  chooseAmplification: 'Choose the Amplification parameters (A).',
  amplificationDecriptions:
    "The amplification parameter determines a pool's tolerance for the imbalance between its assets. A higher value means that trades will incur slippage sooner as the assets within the pool become imbalanced.",
  rememberInbuiltFee: 'Remember that QuipuSwap will charge the following fees',
  forEachOperation: 'for each trading operation in your pool:',
  liquidityProvidersFeeDecriptions: 'Liquidity providers fee:',
  interfaceFeeDecriptions: 'Interface Fee:',
  stakersFeeDecriptions: 'QUIPU Stakers Fee:',
  devFeeDecriptions: 'Dev Fee:',
  clickThe: 'Click the',
  button: 'button!',
  weeklyVolume: 'Volume(7d)'
  //#endregion creation rules
} as const;
