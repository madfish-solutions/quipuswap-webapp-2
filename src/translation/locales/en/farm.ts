export const farm = {
  'Farming Details': 'Farming Details',
  'Value Locked': 'Value Locked',
  APR: 'APR',
  dailyApr: 'Daily',
  'Current Delegate': 'Current Delegate',
  'Next Delegate': 'Next Delegate',
  farmingEndsIn: 'Ends in',
  'Lock Period': 'Lock Period',
  'Unlock Fee': 'Unlock Fee',
  'Interface Fee': 'Interface Fee',
  'Token Contract': 'Token Contract',
  'Farming Contract': 'Farming Contract',
  'Harvest All': 'Harvest all',
  'Your Claimed': 'Your Claimed',
  'Your Claimable Rewards': 'Your Claimable Rewards',
  'Your Claimable': 'Your Claimable',
  'Your Full Rewards': 'Your Full Rewards',
  Harvest: 'Harvest',
  'Earn extra income with QuipuSwap': 'Earn extra income with QuipuSwap',
  'Connect Wallet now!': 'Connect Wallet now!',
  valueLockedTooltip: 'Total amount of assets locked in the farm.',
  dailyDistributionTooltip: 'The total number of tokens that are released by the farm in 24 hours.',
  aprTooltip: 'Annual Percentage Rate. An estimation of the annual rate of return.',
  dailyAprTooltip: 'Daily rate of return as the percentage of your initial stake.',
  currentDelegateTooltip: 'The farm votes for this baker on the Dex pool with all deposited tokens.',
  nextDelegateTooltip: 'The next candidate to become the baker chosen and voted by the farm.',
  farmingEndsInTooltip: 'The amount of time until the current farming ends.',
  lockPeriodTooltip:
    "The minimum amount of time locked assets should not be withdrawn. If withdrawn earlier, all earned rewards will be burned. Some pools, as noted in the farm's details, also apply an early unlock fee, substracting a portion of deposited tokens.",
  unlockFeeTooltip:
    'The fee will be charged from your deposit amount if you withdraw your assets before the farm locked period ends. All unlock fees may be used to buy back and burn QUIPU.',
  interfaceFeeTooltip: 'Percentage of earned tokens charged for providing an interface.',
  'Back to the list': 'Back to the list',
  yourShareTooltip: 'Current value of your stake in this farm.',
  yourDelegateTooltip:
    'The baker you prefer to vote for with your tokens on the Dex to increase chances this baker will be chosen as the delegate for the pool.',
  feeEndsInTooltip:
    'Countdown till the moment when the stake can be withdrawn without paying the unlock fee and without burning earned rewards.',
  singleFarmRewardTooltip: 'Your unclaimed farming reward from this farm.',
  select: 'Select',
  fullCardTooltip: 'Add Liquidity to the selected liquidity pool, stake liquidity tokens here, earn rewards.',
  tokenContract: 'Token Contract',
  farmingContract: 'Farming Contract',
  tvl: 'TVL',
  tvlTooltip: 'Total amount of assets locked in the farm.',
  apr: 'APR',
  apy: 'APY',
  apyTooltip:
    'Annual Percentage Yield. An estimated  annual compounded return — expected earnings if you reinvest the reward daily. APY is indicative and should not be used as a performance measure!',
  yourBalance: 'Your Balance',
  yourBalanceTooltip: 'The amount of corresponding tokens on your currently synced account.',
  yourDeposit: 'Your Deposit',
  yourDepositTooltip:
    'The amount of corresponding tokens currently staked in this pool from your currently synced account.',
  yourEarned: 'Your Earned',
  yourEarnedTooltip: 'Your total farming earning in this farm.',
  totalValueLocked: 'Total Value Locked',
  totalValueLockedTooltip: 'Total value of assets locked across all farms.',
  totalDailyReward: 'Total Daily Reward',
  totalDailyRewardTooltip: 'Total amount of rewards generated in the last 24h.',
  totalPendingReward: 'Total Pending Reward',
  totalPendingRewardTooltip: 'Total amount of rewards that have not been claimed yet.',
  totalClaimedReward: 'Total Claimed Reward',
  totalClaimedRewardTooltip: 'Total amount of rewards collected by users so far.',
  harvestAll: 'Harvest All',
  rewardsTooltip: 'Your rewards that can be claimed now across all farms.',
  stakedOnly: 'Staked Only',
  activeOnly: 'Active Only',
  balance: 'Balance',
  deposit: 'Deposit',
  earned: 'Earned',
  disabled: 'Farming is finished! Please withdraw all your stake and rewards.',
  pending: 'Farming is paused!',
  'Failed to load farming': 'Failed to load farming',
  'Daily Distribution': 'Daily Distribution',
  'Your Share': 'Your Share',
  'Your delegate': 'Your delegate',
  'Lock period ends in': 'Lock period ends in',
  'Vesting period ends in': 'Vesting period ends in',
  Stake: 'Stake',
  Unstake: 'Unstake',
  confirmationFirstStake:
    'This is the farm with lock period. You will need to wait {{days}} days {{hours}} hours to make the free withdrawal or pay {{persent}}% of your deposit and lose all your rewards if you decide to withdraw earlier.',
  confirmationUpdateStake:
    'If you make the new stake, your lock countdown will be reset but all rewards will be saved. Your lock countdown ends in {{days}} days {{hours}} hours {{minutes}} minutes.',
  confirmationUnstake:
    'If you make the withdrawal now, the {{persent}}% unlock fee will be charged from your deposit and all your rewards will be lost. You can wait {{days}} days {{hours}} hours to make the free withdrawal.',
  confirmationUnstakeZero:
    'If you make the withdrawal now, all your rewards will be lost. You can wait {{days}} days {{hours}} hours to make the free withdrawal.',
  Tags: 'Tags',
  'Wanna earn more?': 'Wanna earn more?',
  increaseYourIncome:
    'Increase your income by reinvesting the rewards to QUIPU pool with no lock periods and unlock fees. The compound effect is your best friend.',
  JustHarvest: 'Just harvest',
  iAmIn: 'Yes, I am in!',
  'Harvest successful': 'Harvest successful',
  'Stake successful': 'Stake successful',
  Token: 'Token',
  Full: 'Full',
  Claimable: 'Claimable',
  YouvesCheckout: 'Check out alternative farming on Youves',
  lock: '{{timelock}} LOCK',
  unlockFee: '{{unlockFee}}% UNLOCK FEE',
  harvestOrRoll: 'Harvest or Roll',
  harvestAndRoll: 'Harvest and Roll',
  harvestOrRollDescription:
    'Collect rewards or take a chance and double them? Click the flip button to use Coinflip and try to almost double your rewards instead of the usual harvesting. Pay attention: losing bets will be lost. Fortune favors the brave!',
  maximumAllowableBid: 'Maximum allowable bid',
  longTerm: 'Long Term Rewards',
  farmingTokens: 'Farming {{tokens}}',
  'Vesting Period': 'Vesting Period',
  vestingPeriodTooltip:
    'The longer you stake, the higher your yield. Vesting period shows how long you should stake to receive the full rewards. Claiming earlier results in smaller reward allocation and distributes the difference to the full rewards back to the pool.'
} as const;
