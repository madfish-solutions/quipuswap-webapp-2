import { ReactNode, useCallback, useState } from 'react';

import BigNumber from 'bignumber.js';

import { useAccountPkh } from '@providers/use-dapp';
import { Undefined } from '@shared/types';
import { useTranslation } from '@translation';

export const useRewardInfoViewModel = (
  gamesCount: Nullable<BigNumber>,
  details: ReactNode,
  isError: Undefined<boolean>,
  hasTokensReward: boolean
) => {
  const { t } = useTranslation();
  const accountPkh = useAccountPkh();
  const [isOpen, setToggles] = useState(false);
  const toggle = useCallback(() => setToggles(_isOpen => !_isOpen), []);

  const isYourGamesVisible = gamesCount?.isGreaterThan('0') && accountPkh;
  const isViewDetailsVisible = hasTokensReward && details && Boolean(accountPkh) && isError;

  return {
    accountPkh,
    isYourGamesVisible,
    isViewDetailsVisible,
    isDetailsOpen: isOpen,
    toggle,
    showDetails: Boolean(accountPkh),
    transaction: {
      detailsButtonTransaction: isOpen ? t('common|lessDetails') : t('common|viewDetails')
    }
  };
};
