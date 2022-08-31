import { FormikValues, useFormik } from 'formik';

import { numberAsString } from '@shared/helpers';
import { useTokensBalancesOnly } from '@shared/hooks';
import { WhitelistedBaker } from '@shared/types';
import { useTranslation } from '@translation';

import { getInputSlugByIndex } from './components/helpers';
import { MOCK_CHOOSED_TOKENS } from './mock-data';

enum Input {
  FIRST_INPUT = 'new-liq-create-input-0',
  SECOND_INPUT = 'new-liq-create-input-1',
  BAKER_INPUT = 'baker-input'
}

export const useNewLiquidityCreatePageViewModel = () => {
  const { t } = useTranslation();

  const userBalances = useTokensBalancesOnly(MOCK_CHOOSED_TOKENS);

  // const shouldShowBakerInput = canDelegate(MOCK_CHOOSED_TOKENS);

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('submit');
  };

  const formik = useFormik({
    initialValues: {
      [Input.FIRST_INPUT]: '',
      [Input.SECOND_INPUT]: '',
      [Input.BAKER_INPUT]: ''
    },
    onSubmit: handleSubmit
  });

  const handleInputChange = (index: number) => {
    const localToken = MOCK_CHOOSED_TOKENS[index];
    const localTokenDecimals = localToken.metadata.decimals;

    return async (inputAmount: string) => {
      const { realValue } = numberAsString(inputAmount, localTokenDecimals);

      formik.setFieldValue(getInputSlugByIndex(index), realValue);
    };
  };

  const handleBakerChange = (baker: WhitelistedBaker) => {
    formik.setFieldValue(Input.BAKER_INPUT, baker.address);
  };

  const data = MOCK_CHOOSED_TOKENS.map((_, index) => ({
    value: (formik.values as FormikValues)[getInputSlugByIndex(index)],
    label: t('common|Input'),
    balance: userBalances[index],
    onInputChange: handleInputChange(index)
  }));

  const bakerData = {
    value: '',
    error: '',
    handleChange: handleBakerChange,
    shouldShowBakerInput: true
  };

  return { data, bakerData, onSubmit: formik.handleSubmit };
};
