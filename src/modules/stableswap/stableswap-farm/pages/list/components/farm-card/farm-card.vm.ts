import { ActiveStatus } from '@shared/types';
import { useTranslation } from '@translation';

export const useFarmCardViewModel = (contractAddress: string) => {
  const { t } = useTranslation();

  return {
    whitelistedTag: {
      status: ActiveStatus.ACTIVE,
      label: t('common|whiteListed')
    },
    translation: {
      aprTranslation: t('farm|apr'),
      apyTranslation: t('farm|apy'),
      totalValueLockedTranslation: t('farm|tvl'),
      yourDeposiTranslation: t('farm|yourDeposit'),
      yourEarnedTranslation: t('farm|yourEarned')
    }
  };
};
