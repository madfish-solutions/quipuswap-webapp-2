import { FormEvent, useState } from 'react';

import BigNumber from 'bignumber.js';
import { useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { defined } from '@shared/helpers';

import { FarmingRoutes } from '../../../../../farming.router';
import { useDoYouvesFarmingWithdraw } from '../../../../../hooks';
import { YouvesFormTabs } from '../../../types';
import { useYouvesUnstakeConfirmationPopup } from './use-unstake-confirmation-popup';

export const useUnstakeFormForming = (
  contractAddress: Nullable<string>,
  farmId: string,
  stakeId: BigNumber,
  balance: Nullable<BigNumber>
) => {
  const confirmationPopup = useYouvesUnstakeConfirmationPopup();
  const { doWithdraw } = useDoYouvesFarmingWithdraw();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    confirmationPopup(async () => {
      setIsSubmitting(true);
      await doWithdraw(defined(contractAddress, 'Contract address'), stakeId, defined(balance, 'Balance'));
      setIsSubmitting(false);
      navigate(`${AppRootRoutes.Farming}${FarmingRoutes.VersionTwo}/${farmId}/${YouvesFormTabs.stake}`);
    });
  };

  return {
    handleSubmit: handleSubmit,
    isSubmitting,
    disabled: isSubmitting
  };
};
