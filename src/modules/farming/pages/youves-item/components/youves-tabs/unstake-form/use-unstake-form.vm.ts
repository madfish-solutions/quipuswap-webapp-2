import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { isNotDefined, toReal } from '@shared/helpers';
import { useToken } from '@shared/hooks';

import { useFarmingYouvesItemStore } from '../../../../../hooks';
import { FormProps } from '../form-props.interface';
import { useStakeFormForming } from '../stake-form/use-stake-form-forming';

export const useUnstakeFormViewModel = (): FormProps => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const farmingYouvesItemStore = useFarmingYouvesItemStore();
  const { item, tokens, farmingAddress, currentStakeId, currentStakeBalance } = farmingYouvesItemStore;
  const stakedToken = useToken(item?.stakedToken ?? null);

  const form = useStakeFormForming(farmingAddress, currentStakeId, stakedToken, currentStakeBalance);

  const disabled = form.disabled || isNotDefined(tezos) || isNotDefined(accountPkh) || !currentStakeBalance;

  const balance =
    currentStakeBalance && stakedToken ? toReal(currentStakeBalance, stakedToken.metadata.decimals) : null;
  const inputAmount = balance ? balance.toString() : '';

  return {
    ...form,
    inputAmount,
    disabled,
    tokens,
    balance
  };
};
