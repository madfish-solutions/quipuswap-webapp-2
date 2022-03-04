import { useEffect, useState } from 'react';

import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

import { STAKING_CONTRACT_ADDRESS } from '@app.config';
import { useStakingItemStore } from '@hooks/stores/use-staking-item-store';
import { getContract, useAccountPkh, useTezos } from '@utils/dapp';
import { bigNumberToString, defined, fromDecimals, isEmptyArray, toDecimals } from '@utils/helpers';
import { Nullable } from '@utils/types';

import { useDoUnstake } from '../../../../hooks/use-do-unstake';
import { UnstakingFormFields, UnstakingFormValues } from './unstaking-form.interface';
import { useUnstakingFormValidation } from './use-unstaking-form.validation';

export const useUnstakingFormViewModel = () => {
  const stakingItemStore = useStakingItemStore();
  const { doUnstake } = useDoUnstake();
  const accountPkh = useAccountPkh();
  const tezos = useTezos();
  const { itemStore, isLpToken, availableBalanceStore, inputAmount } = stakingItemStore;
  const { data: stakeItem } = itemStore;
  const { data: availableBalance } = availableBalanceStore;

  const [userTokenBalance, setUserTokenBalance] = useState<Nullable<string>>(null);

  useEffect(() => {
    const userStakedBalance = async () => {
      if (!tezos || !stakeItem || !accountPkh) {
        return;
      }

      const contract = await getContract(tezos, STAKING_CONTRACT_ADDRESS);
      const storage = await contract.storage();

      // @ts-ignore
      const stakedAmount = await storage.storage.users_info.get([stakeItem.id, accountPkh]);

      setUserTokenBalance(bigNumberToString(fromDecimals(stakedAmount.staked, stakeItem.stakedToken)));
    };

    void userStakedBalance();
  });

  const validationSchema = useUnstakingFormValidation(availableBalance);

  const handleStakeSubmit = async (values: UnstakingFormValues, actions: FormikHelpers<UnstakingFormValues>) => {
    actions.setSubmitting(true);
    const token = defined(stakeItem).stakedToken;
    const inputAmountWithDecimals = toDecimals(inputAmount, token);
    await doUnstake(defined(stakeItem), inputAmountWithDecimals);
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: {
      [UnstakingFormFields.inputAmount]: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleStakeSubmit
  });

  // TODO
  // eslint-disable-next-line no-console
  console.log('isLpToken', isLpToken);

  const disabled = formik.isSubmitting || !isEmptyArray(Object.keys(formik.errors));
  const inputAmountError =
    formik.errors[UnstakingFormFields.inputAmount] && formik.touched[UnstakingFormFields.inputAmount]
      ? formik.errors[UnstakingFormFields.inputAmount]
      : undefined;

  const handleInputAmountChange = (value: string) => {
    stakingItemStore.setInputAmount(value);
    formik.setFieldValue(UnstakingFormFields.inputAmount, value);
  };

  return {
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[UnstakingFormFields.inputAmount],
    userTokenBalance,
    inputAmountError,
    stakeItem,
    disabled,
    handleInputAmountChange
  };
};
