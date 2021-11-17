import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { mixed as mixedSchema, object as objectSchema, string as stringSchema } from 'yup';

import { useDexGraph } from '@hooks/useDexGraph';
import useUpdateToast from '@hooks/useUpdateToast';
import {
  NewSwapFormValues,
  WhitelistedToken,
} from '@utils/types';
import {
  getUserBalance,
  useAccountPkh,
  useTezos,
} from '@utils/dapp';
import {
  convertUnits,
  fromDecimals,
  getRouteWithInput,
  getTokenSlug,
  slippageToBignum,
  slippageToNum,
  swap,
} from '@utils/helpers';
import { addressSchema, bigNumberSchema } from '@utils/validators';

import { NewSwapForm } from './NewSwapForm';

type SwapSendProps = {
  className?: string
};

const initialErrors = {
  amount1: 'Required',
  amount2: 'Required',
};
const initialValues: Partial<NewSwapFormValues> = {
  action: 'swap',
  slippage: '0.5 %',
};

export const SwapSend: React.FC<SwapSendProps> = ({
  className,
}) => {
  const { t } = useTranslation(['common', 'swap']);
  const updateToast = useUpdateToast();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { dexGraph } = useDexGraph();
  const [
    knownTokensBalances,
    setKnownTokensBalances,
  ] = useState<Record<string, BigNumber>>({});

  const updateTokenBalance = useCallback((token: WhitelistedToken) => {
    const newTokenSlug = getTokenSlug(token);
    if (!accountPkh) {
      return;
    }
    getUserBalance(
      tezos!,
      accountPkh!,
      token.contractAddress,
      token.type,
      token.fa2TokenId,
    ).then(
      (balance) => {
        setKnownTokensBalances(
          (prevValue) => ({
            ...prevValue,
            [newTokenSlug]: convertUnits(balance ?? new BigNumber(0), token.metadata.decimals),
          }),
        );
      },
    ).catch(console.error);
  }, [accountPkh, tezos]);

  const validationSchema = useMemo(() => objectSchema().shape({
    token1: objectSchema().required(),
    token2: objectSchema().required(),
    amount1: objectSchema().when(
      'token1',
      (firstToken?: WhitelistedToken) => bigNumberSchema(
        firstToken ? fromDecimals(new BigNumber(1), firstToken.metadata.decimals) : undefined,
        firstToken && knownTokensBalances[getTokenSlug(firstToken)],
      ).required(),
    ),
    amount2: objectSchema().when(
      'token2',
      (secondToken?: WhitelistedToken) => bigNumberSchema(
        secondToken ? fromDecimals(new BigNumber(1), secondToken.metadata.decimals) : undefined,
      ).required(),
    ),
    recipient: mixedSchema().when(
      'action',
      (currentAction: string) => (currentAction === 'swap'
        ? mixedSchema()
        : addressSchema().required()
      ),
    ),
    slippage: stringSchema().test((value = '') => {
      const normalizedValue = slippageToNum(value);
      return (value !== '') && (normalizedValue > 0) && (normalizedValue <= 30);
    }).required(),
    action: stringSchema().oneOf(['swap', 'send']).required(),
  }), [knownTokensBalances]);

  const handleErrorToast = useCallback((err) => {
    updateToast({
      type: 'error',
      render: `${err.name}: ${err.message}`,
    });
  }, [updateToast]);

  const handleLoader = useCallback(() => {
    updateToast({
      type: 'info',
      render: t('common|Loading'),
    });
  }, [updateToast, t]);

  const handleSuccessToast = useCallback(() => {
    updateToast({
      type: 'success',
      render: t('swap|Swap completed!'),
    });
  }, [updateToast, t]);

  const handleSubmit = useCallback(async (formValues: Partial<NewSwapFormValues>) => {
    console.log(tezos, formValues);
    if (!tezos) {
      return;
    }

    const {
      amount1,
      token1,
      token2,
      recipient,
      slippage,
      action,
    } = formValues;

    handleLoader();
    const inputAmount = convertUnits(amount1!, -token1!.metadata.decimals);
    try {
      await swap(
        tezos,
        accountPkh!,
        {
          inputAmount,
          inputToken: token1!,
          recipient: action === 'send' ? recipient : undefined,
          slippageTolerance: slippageToBignum(slippage!).div(100),
          dexChain: getRouteWithInput({
            startTokenSlug: getTokenSlug(token1!),
            endTokenSlug: getTokenSlug(token2!),
            graph: dexGraph,
            inputAmount,
          })!,
        },
      );
      handleSuccessToast();
    } catch (e) {
      handleErrorToast(e);
      throw e;
    }
  }, [handleLoader, tezos, handleErrorToast, handleSuccessToast, accountPkh, dexGraph]);

  const formikProps = useFormik({
    validationSchema,
    initialValues,
    initialErrors,
    onSubmit: handleSubmit,
    validateOnChange: true,
  });

  return (
    <NewSwapForm
      {...formikProps}
      className={className}
      knownTokensBalances={knownTokensBalances}
      updateTokenBalance={updateTokenBalance}
    />
  );
};
