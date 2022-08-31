import { useTokensBalancesOnly } from '@shared/hooks';
import { noopMap } from '@shared/mapping';
import { useTranslation } from '@translation';

import { MOCK_CHOOSED_TOKENS } from './mock-data';

export const useNewLiquidityCreatePageViewModel = () => {
  const { t } = useTranslation();

  const userBalances = useTokensBalancesOnly(MOCK_CHOOSED_TOKENS);

  const handleSubmit = () => noopMap;

  const data = MOCK_CHOOSED_TOKENS.map((_, index) => ({
    value: '',
    label: t('common|Input'),
    balance: userBalances[index],
    onInputChange: noopMap
  }));

  const bakerData = {
    value: '',
    error: '',
    handleChange: noopMap,
    shouldShowBakerInput: true
  };

  return { data, bakerData, handleSubmit };
};
