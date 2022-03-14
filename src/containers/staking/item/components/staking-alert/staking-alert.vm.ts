import { useTranslation } from 'next-i18next';

import { StakingStatus } from '@interfaces/staking.interfaces';

export const useStakingAlertViewModel = () => {
  const { t } = useTranslation(['stake']);

  return {
    stakeStatusTranslation: {
      [StakingStatus.PENDING]: t('stake|pending'),
      [StakingStatus.DISABLED]: t('stake|disabled')
    }
  };
};
