import BigNumber from 'bignumber.js';

import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { getTimeLockDescription, getTokenSymbol } from '@shared/helpers';
import { useYoutubeTabs } from '@shared/hooks';
import { ActiveStatus } from '@shared/types';
import { i18n, useTranslation } from '@translation';

export const useYouvesDetailsViewModel = () => {
  const { t } = useTranslation();
  const { isDetails, tabsContent, activeId, setTabId } = useYoutubeTabs({
    detailsLabel: t('farm|Farming Details'),
    page: t('common|Farming')
  });

  return {
    labels: [
      {
        status: ActiveStatus.ACTIVE,
        label: i18n.t('farm|lock', { timelock: getTimeLockDescription(1000) }),
        DTI: 'timeLockLabel'
      }
    ],
    tvl: new BigNumber(100),
    tvlDollarEquivalent: new BigNumber(100),
    apr: new BigNumber(100),
    daily: new BigNumber(100),
    dailyDistribution: new BigNumber(100),
    dailyDistributionDollarEquivalent: new BigNumber(100),
    vestingPeriod: 1000,
    stakeStatus: ActiveStatus.ACTIVE,
    shouldShowTags: true,
    stakedTokenSymbol: getTokenSymbol(QUIPU_TOKEN),
    rewardTokenSymbol: getTokenSymbol(TEZOS_TOKEN),
    isLoading: false,
    isError: false,
    isDetails,
    tabsContent,
    activeId,
    setTabId
  };
};
