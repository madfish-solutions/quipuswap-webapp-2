import { useRootStore } from '@providers/root-store-provider';
import { defined, isNotDefined, toReal } from '@shared/helpers';
import { useAuthStore, useToken } from '@shared/hooks';

import { UnstakeFormProps } from './unstake-form-props.interface';
import { useUnstakeFormForming } from './use-unstake-form-forming';
import { useFarmingYouvesItemStore } from '../../../../../hooks';

export const useUnstakeFormViewModel = (): UnstakeFormProps => {
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();

  const { item, tokens, farmingAddress, currentStakeId, currentStakeBalance, id, version } =
    useFarmingYouvesItemStore();
  const stakedToken = useToken(item?.stakedToken ?? null);

  const balance =
    currentStakeBalance && stakedToken ? toReal(currentStakeBalance, stakedToken.metadata.decimals) : null;
  const inputAmount = balance ? balance.toFixed() : '';

  const form = useUnstakeFormForming(farmingAddress, id, defined(version, 'version'), currentStakeId, balance);

  const disabled = form.disabled || isNotDefined(tezos) || isNotDefined(accountPkh) || !currentStakeBalance;

  return {
    ...form,
    inputAmount,
    disabled,
    tokens,
    balance
  };
};
