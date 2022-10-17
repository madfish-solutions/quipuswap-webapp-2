import { useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';

import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { useAccountPkh, useTezos } from '@providers/use-dapp';

import { YouvesFarmingApi } from '../../../../../api/blockchain/youves-farming.api';

export const useStakeFormViewModel = () => {
  const tezos = useTezos();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const accountPkh = useAccountPkh();

  const [inputAmount, inputAmountChange] = useState('');

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('submit');
  };

  useEffect(() => {
    (async () => {
      if (!tezos) {
        return;
      }
      // eslint-disable-next-line no-console
      console.log('load', await YouvesFarmingApi.getToken(tezos));
    })();
  }, [tezos]);

  return {
    inputAmount,
    handleSubmit,
    userTokenBalance: new BigNumber(10),
    tokens: [QUIPU_TOKEN, TEZOS_TOKEN],
    handleInputAmountChange: inputAmountChange,
    disabled: false,
    isSubmitting: false
  };
};
