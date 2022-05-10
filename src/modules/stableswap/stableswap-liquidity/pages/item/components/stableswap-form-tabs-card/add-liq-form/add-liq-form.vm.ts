import { isUndefined } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useStableswapItemStore } from '../../../../../../hooks';

export const useAddLiqFormViewModel = () => {
  const { t } = useTranslation();

  const stableswapItemStore = useStableswapItemStore();
  const item = stableswapItemStore.item;

  const label = t('common|Input');
  const disabled = false;
  const isSubmitting = false;

  const data = item?.tokensInfo.map((info, index) => {
    const tokenA = info.token;
    const decimals = info.token.metadata.decimals;
    const _value = stableswapItemStore.getInputAmount(index);
    const value = isUndefined(_value) ? '' : _value;

    const handleInputChange = (inputAmount: string) => {
      stableswapItemStore.setInputAmount(inputAmount, index);
    };

    return {
      label,
      value,
      tokenA,
      decimals,
      id: 'stableswap-input',
      balance: '100000',
      onInputChange: handleInputChange
    };
  });

  return {
    data: data ?? [],
    disabled,
    isSubmitting
  };
};
