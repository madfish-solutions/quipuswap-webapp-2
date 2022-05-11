import { useMemo } from 'react';

import { ActiveStatus } from '@shared/types';
import { useTranslation } from '@translation';

export const usePoolCardViewModel = () => {
  const { t } = useTranslation();

  const whitelistedTag = useMemo(
    () => ({
      status: ActiveStatus.ACTIVE,
      label: t('common|whiteListed')
    }),
    [t]
  );

  return {
    whitelistedTag,
    translation: {
      totalValueTranslation: t('common|totalValue'),
      liquidityProvidersFeeTranslation: t('stableswap|liquidityProvidersFee'),
      selectTranslation: t('common|select'),
      valueTranslation: t('common|value')
    }
  };
};
