import { useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import * as yup from 'yup';

import { LpTokensApi } from '@blockchain';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { defined, getFormikError, isExist, toAtomic } from '@shared/helpers';
import { useToken, useTokenBalance } from '@shared/hooks';
import { Optional, TokenAddress, TokenIdFa2 } from '@shared/types';
import { balanceAmountSchema } from '@shared/validators';

import { YouvesFarmingApi } from '../../../../../api/blockchain/youves-farming.api';
import { useDoYouvesFarmingDeposit } from '../../../../../hooks';
import { StakeFormFields } from '../../../../item/components/farming-tabs/stake-form/stake-form.interface';

enum FormFields {
  inputAmount = 'inputAmount'
}

interface FormValues {
  [FormFields.inputAmount]: string;
}

const getValidationSchema = (userBalance: Optional<BigNumber>) =>
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
  const { doDeposit } = useDoYouvesFarmingDeposit();

  const [stakes, setStakes] = useState<BigNumber[]>([]);
  const [lpToken, setLpToken] = useState<Nullable<TokenIdFa2>>(null);
  const [tokens, setTokens] = useState(DEFAULT_TOKENS);
  const tokenA = useToken(tokens.tokenA);
  const tokenB = useToken(tokens.tokenB);
  const loFullToken = useToken(lpToken);
  const userLpTokenBalance = useTokenBalance(loFullToken);

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    actions.setSubmitting(true);
    await doDeposit(
      0,
      toAtomic(new BigNumber(values.inputAmount), defined(loFullToken, 'LP Full Token').metadata.decimals)
    );
    actions.resetForm();
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    validationSchema: getValidationSchema(userLpTokenBalance),
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

      const _stakes = await YouvesFarmingApi.getStakes(tezos, accountPkh);
      setStakes(_stakes);
      // eslint-disable-next-line no-console
      console.log('load._stakes', _stakes);

      const _lpToken = await YouvesFarmingApi.getToken(tezos);
      setLpToken(_lpToken);

      const _tokens = tezos && _lpToken ? await LpTokensApi.getTokens(tezos, _lpToken) : DEFAULT_TOKENS;
      setTokens(_tokens);
    })();
  }, [accountPkh, tezos]);

  const disabled = formik.isSubmitting || !isExist(tezos) || !isExist(accountPkh);

  return {
    stakes,
    userLpTokenBalance,
    tokens: [tokenA, tokenB],
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[FormFields.inputAmount],
    inputAmountError: getFormikError(formik, FormFields.inputAmount),
    handleInputAmountChange: inputAmountChange,
    isSubmitting: formik.isSubmitting,
    disabled
  };
};
