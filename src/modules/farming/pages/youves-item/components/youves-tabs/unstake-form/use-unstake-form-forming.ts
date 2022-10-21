import { FormEvent, useState } from 'react';

import BigNumber from 'bignumber.js';

import { defined } from '@shared/helpers';

import { useDoYouvesFarmingWithdraw } from '../../../../../hooks';

export const useUnstakeFormForming = (
  contractAddress: Nullable<string>,
  stakeId: BigNumber,
  balance: Nullable<BigNumber>
) => {
  const { doWithdraw } = useDoYouvesFarmingWithdraw();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    await doWithdraw(defined(contractAddress, 'Contract address'), stakeId, defined(balance, 'Balance'));
    setIsSubmitting(false);
  };

  return {
    handleSubmit: handleSubmit,
    isSubmitting,
    disabled: isSubmitting
  };
};
