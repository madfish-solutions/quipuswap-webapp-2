import { useState } from 'react';

import { useTranslation } from '@translation';

import { useStableswapItemStore } from '../../../../../../hooks';

export const useAddLiqFormViewModel = () => {
  const { t } = useTranslation();

  const stableswapItemStore = useStableswapItemStore();
  const item = stableswapItemStore.item;

  const [input, setInput] = useState('');

  const userTokenBalance = '100000';
  const label = t('common|Input');
  const disabled = false;
  const isSubmitting = false;

  const data = item?.tokensInfo.map(info => {
    const tokenA = info.token;
    const decimals = info.token.metadata.decimals;

    return {
      label,
      tokenA,
      decimals,
      id: 'stableswap-input',
      value: input,
      balance: userTokenBalance,
      onInputChange: setInput
    };
  });

  return {
    data: data ?? [],
    disabled,
    isSubmitting
  };
};
