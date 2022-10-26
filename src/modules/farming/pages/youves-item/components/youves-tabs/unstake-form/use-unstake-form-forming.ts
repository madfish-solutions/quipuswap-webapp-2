import { FormEvent, useState } from 'react';

import BigNumber from 'bignumber.js';
import { useNavigate } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { defined } from '@shared/helpers';

import { FarmingRoutes } from '../../../../../farming.router';
import { useDoYouvesFarmingWithdraw } from '../../../../../hooks';
import { YouvesFormTabs } from '../../../types';

export const useUnstakeFormForming = (
  contractAddress: Nullable<string>,
  farmingId: Nullable<string>,
  stakeId: BigNumber,
  balance: Nullable<BigNumber>
) => {
  const { doWithdraw } = useDoYouvesFarmingWithdraw();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    await doWithdraw(
      defined(contractAddress, 'Contract address'),
      defined(farmingId, 'Farming id'),
      stakeId,
      defined(balance, 'Balance')
    );
    setIsSubmitting(false);
    navigate(`${AppRootRoutes.Farming}${FarmingRoutes.Youves}/${farmingId}/${YouvesFormTabs.stake}`);
  };

  return {
    handleSubmit: handleSubmit,
    isSubmitting,
    disabled: isSubmitting
  };
};
