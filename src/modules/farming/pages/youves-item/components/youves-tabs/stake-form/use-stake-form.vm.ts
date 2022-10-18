import { useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { AppRootRoutes } from '@app.router';
import { LpTokensApi } from '@blockchain';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { defined, getFormikError, isExist, toAtomic } from '@shared/helpers';
import { useToken, useTokenBalance } from '@shared/hooks';
import { Optional, TokenAddress, TokenIdFa2 } from '@shared/types';
import { useToasts } from '@shared/utils';
import { balanceAmountSchema } from '@shared/validators';

import { YouvesFarmingApi } from '../../../../../api/blockchain/youves-farming.api';
import { useDoYouvesFarmingDeposit } from '../../../../../hooks';
import { StakeFormFields } from '../../../../item/components/farming-tabs/stake-form/stake-form.interface';
import { isNotFoundError } from './helpers';

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

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useStakeFormViewModel = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { doDeposit } = useDoYouvesFarmingDeposit();
  const { showErrorToast } = useToasts();

  const navigate = useNavigate();
  const { contractAddress } = useParams();
  if (!contractAddress) {
    throw new Error('Contract address is not defined');
  }

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
      contractAddress,
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
      if (!tezos || !accountPkh || !contractAddress) {
        return;
      }

      try {
        const _lpToken = await YouvesFarmingApi.getToken(tezos, contractAddress);
        setLpToken(_lpToken);

        const _stakes = await YouvesFarmingApi.getStakes(tezos, accountPkh, contractAddress);
        setStakes(_stakes);
        // eslint-disable-next-line no-console
        console.log('load._stakes', _stakes);

        const _tokens = tezos && _lpToken ? await LpTokensApi.getTokens(tezos, _lpToken) : DEFAULT_TOKENS;
        setTokens(_tokens);
      } catch (error) {
        showErrorToast(error as Error);
        if (isNotFoundError(error as Error)) {
          navigate(`${AppRootRoutes.NotFound}/${contractAddress}`);
        }
      }
    })();
  }, [accountPkh, contractAddress, navigate, showErrorToast, tezos]);

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
