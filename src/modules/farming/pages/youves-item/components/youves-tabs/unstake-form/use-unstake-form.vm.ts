import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { isNotDefined, toReal } from '@shared/helpers';
import { useToken } from '@shared/hooks';

import { useFarmingYouvesItemStore } from '../../../../../hooks';
import { FormProps } from '../form-props.interface';
import { useUnstakeFormForming } from './use-unstake-form-forming';

export const useUnstakeFormViewModel = (): FormProps => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const farmingYouvesItemStore = useFarmingYouvesItemStore();
  const { item, tokens, farmingAddress, currentStakeId, currentStakeBalance } = farmingYouvesItemStore;
  const stakedToken = useToken(item?.stakedToken ?? null);

  const balance =
    currentStakeBalance && stakedToken ? toReal(currentStakeBalance, stakedToken.metadata.decimals) : null;
  const inputAmount = balance ? balance.toString() : '';

  const form = useUnstakeFormForming(farmingAddress, currentStakeId, balance);

  const disabled = form.disabled || isNotDefined(tezos) || isNotDefined(accountPkh) || !currentStakeBalance;

  return {
    ...form,
    inputAmount,
    disabled,
    tokens,
    balance
  };
};
