import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { isNotDefined } from '@shared/helpers';
import { useToken } from '@shared/hooks';

import { useFarmingYouvesItemStore } from '../../../../../hooks';
import { FormProps } from '../form-props.interface';
import { useStakeFormForming } from '../stake-form/use-stake-form-forming';

export const useUnstakeFormViewModel = (): FormProps => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const farmingYouvesItemStore = useFarmingYouvesItemStore();
  const { item, tokens, farmingAddress, currentStakeId, currentStake } = farmingYouvesItemStore;
  const stakedToken = useToken(item?.stakedToken ?? null);

  const stakeBalance = currentStake?.stake ?? null;

  const form = useStakeFormForming(farmingAddress, currentStakeId, stakedToken, stakeBalance);

  const disabled = form.disabled || isNotDefined(tezos) || isNotDefined(accountPkh);

  return {
    ...form,
    disabled,
    tokens,
    balance: stakeBalance
  };
};
