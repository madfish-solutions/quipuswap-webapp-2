import { DAYS_IN_YEAR, MS_IN_SECOND } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';
import { useFarmingYouvesItemStore } from '@modules/farming/hooks';
import { getTokensNames, getTokenSymbol, isNull } from '@shared/helpers';
import { useYoutubeTabs } from '@shared/hooks';
import { ActiveStatus } from '@shared/types';
import { useTranslation } from '@translation';

import { getTimeLockDescription } from '../../helpers/parse-timelock';

export const useYouvesDetailsViewModel = () => {
  const { t } = useTranslation();

  const { currentStake, currentStakeId } = useFarmingYouvesItemStore();

  const { isDetails, tabsContent, activeId, setTabId } = useYoutubeTabs({
    detailsLabel: t('farm|Farming Details'),
    page: t('common|Farming')
  });
  const farmingYouvesItemStore = useFarmingYouvesItemStore();
  const item = farmingYouvesItemStore.item;

  if (isNull(item)) {
    return {
      labels: [],
      tvl: null,
      tvlDollarEquivalent: null,
      apr: null,
      daily: null,
      dailyDistribution: null,
      dailyDistributionDollarEquivalent: null,
      vestingPeriod: null,
      stakeStatus: ActiveStatus.DISABLED,
      shouldShowTags: false,
      stakedTokenSymbol: null,
      rewardTokenSymbol: null,
      isLoading: farmingYouvesItemStore.itemStore.isLoading,
      isError: Boolean(farmingYouvesItemStore.itemStore.error),
      isDetails,
      tabsContent,
      activeId,
      setTabId,
      tokenContractUrl: TZKT_EXPLORER_URL,
      farmingContractUrl: TZKT_EXPLORER_URL,
      currentStakeId: null
    };
  }

  const { apr } = item;

  return {
    labels: [
      {
        status: ActiveStatus.ACTIVE,
        label: getTimeLockDescription(item.vestingPeriodSeconds.toNumber()),
        DTI: 'timeLockLabel'
      }
    ],
    tvl: item.tvlInStakedToken,
    tvlDollarEquivalent: item.tvlInUsd,
    apr: apr,
    daily: apr?.dividedBy(DAYS_IN_YEAR) ?? null,
    dailyDistribution: item.dailyDistribution,
    dailyDistributionDollarEquivalent: item.dailyDistributionDollarEquivalent,
    vestingPeriod: item.vestingPeriodSeconds.times(MS_IN_SECOND).toNumber(),
    stakeStatus: !apr || apr.isZero() ? ActiveStatus.DISABLED : ActiveStatus.ACTIVE,
    shouldShowTags: true,
    stakedTokenSymbol: getTokensNames(item.tokens),
    rewardTokenSymbol: getTokenSymbol(item.rewardToken),
    isLoading: false,
    isError: false,
    isDetails,
    tabsContent,
    activeId,
    setTabId,
    tokenContractUrl: item.depositTokenUrl,
    farmingContractUrl: item.stakeUrl,
    currentStakeId: currentStake ? currentStakeId.toFixed() : null
  };
};
