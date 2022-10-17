import { useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import * as yup from 'yup';

import { LpTokensApi } from '@blockchain';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { defined, getFormikError, isExist } from '@shared/helpers';
import { useToken } from '@shared/hooks';
import { TokenAddress } from '@shared/types';
import { balanceAmountSchema } from '@shared/validators';

import { YouvesFarmingApi } from '../../../../../api/blockchain/youves-farming.api';
import { StakeFormFields } from '../../../../item/components/farming-tabs/stake-form/stake-form.interface';

enum FormFields {
  inputAmount = 'inputAmount'
}

interface FormValues {
  [FormFields.inputAmount]: string;
}

const getValidationSchema = (userBalance: Nullable<BigNumber>) =>
  yup.object().shape({
    [StakeFormFields.inputAmount]: balanceAmountSchema(userBalance).required('Value is required')
  });

const DEFAULT_TOKENS: { tokenA: Nullable<TokenAddress>; tokenB: Nullable<TokenAddress> } = {
  tokenA: null,
  tokenB: null
};

export const useStakeFormViewModel = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [stakes, setStakes] = useState<BigNumber[]>([]);
  const [tokens, setTokens] = useState(DEFAULT_TOKENS);
  const tokenA = useToken(tokens.tokenA);
  const tokenB = useToken(tokens.tokenB);

  const userTokenBalance = new BigNumber(100);

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    // eslint-disable-next-line no-console
    console.log('submit', values);
    actions.setSubmitting(true);
    try {
      await YouvesFarmingApi.deposit(defined(tezos), defined(accountPkh), 0, values.inputAmount);
      actions.resetForm();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('error', error);
    }
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    validationSchema: getValidationSchema(userTokenBalance),
    initialValues: {
      [FormFields.inputAmount]: ''
    },
    onSubmit: handleSubmit
  });

  const inputAmountChange = async (value: string) => await formik.setFieldValue(FormFields.inputAmount, value);

  // Load LP token & User stakes
  useEffect(() => {
    (async () => {
      if (!tezos || !accountPkh) {
        return;
      }

      setStakes(await YouvesFarmingApi.getStakes(tezos, accountPkh));

      const _lpToken = await YouvesFarmingApi.getToken(tezos);

      const _tokens = tezos && _lpToken ? await LpTokensApi.getTokens(tezos, _lpToken) : DEFAULT_TOKENS;
      setTokens(_tokens);
      // eslint-disable-next-line no-console
      console.log('load.tokens', _tokens);
    })();
  }, [accountPkh, tezos]);

  const disabled = formik.isSubmitting || !isExist(tezos) || !isExist(accountPkh);

  return {
    stakes,
    userTokenBalance,
    tokens: [tokenA, tokenB],
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[FormFields.inputAmount],
    inputAmountError: getFormikError(formik, FormFields.inputAmount),
    handleInputAmountChange: inputAmountChange,
    isSubmitting: formik.isSubmitting,
    disabled
  };
};
