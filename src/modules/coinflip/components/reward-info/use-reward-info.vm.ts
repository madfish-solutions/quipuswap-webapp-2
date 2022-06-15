import { useCallback, useState } from 'react';

import { useAccountPkh } from '@providers/use-dapp';
import { useTranslation } from '@translation';

export const useRewardInfoViewModel = () => {
  const { t } = useTranslation();
  const accountPkh = useAccountPkh();
  const [isOpen, setToggles] = useState(false);
  const toggle = useCallback(() => setToggles(_isOpen => !_isOpen), []);

  return {
    isDetailsOpen: isOpen,
    toggle,
    showDetails: Boolean(accountPkh),
    transaction: {
      detailsButtonTransaction: isOpen ? t('common|lessDetails') : t('common|viewDetails')
    }
  };
};
