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
      totalValueTranslation: t('common|tvl'),
      liquidityProvidersFeeTranslation: t('stableswap|liquidityProvidersFee'),
      selectTranslation: t('common|select'),
      valueTranslation: t('common|tokenValues')
    },
    tooltip: {
      tokenValuesTooltip: t('stableswap|tokenValuesTooltip'),
      tvlFarmTooltip: t('stableswap|tvlFarmTooltip'),
      liquidityProvidersFeeTooltip: t('stableswap|liquidityProvidersFeeTooltip')
    }
  };
};
