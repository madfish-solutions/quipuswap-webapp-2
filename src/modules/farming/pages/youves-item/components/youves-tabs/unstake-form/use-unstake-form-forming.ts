import { FormEvent, useState } from 'react';

import BigNumber from 'bignumber.js';
import { useNavigate } from 'react-router-dom';

import { defined } from '@shared/helpers';

import { getFarmItemUrl } from '../../../../../helpers';
import { useDoYouvesFarmingWithdraw } from '../../../../../hooks';
import { FarmVersion } from '../../../../../interfaces';
import { YouvesFormTabs } from '../../../types';
import { useYouvesUnstakeConfirmationPopup } from './use-unstake-confirmation-popup';

export const useUnstakeFormForming = (
  contractAddress: Nullable<string>,
  id: string,
  version: FarmVersion,
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
      navigate(`${getFarmItemUrl({ id, version })}/${YouvesFormTabs.stake}`);
    });
  };

  return {
    handleSubmit: handleSubmit,
    isSubmitting,
    disabled: isSubmitting
  };
};
