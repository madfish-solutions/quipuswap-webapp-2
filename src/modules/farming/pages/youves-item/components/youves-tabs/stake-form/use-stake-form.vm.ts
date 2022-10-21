import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { isNotDefined } from '@shared/helpers';
import { useToken, useTokenBalance } from '@shared/hooks';

import { useFarmingYouvesItemStore } from '../../../../../hooks';
import { FormProps } from '../form-props.interface';
import { useStakeFormForming } from './use-stake-form-forming';

export const useStakeFormViewModel = (): FormProps => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const farmingYouvesItemStore = useFarmingYouvesItemStore();
  const { item, tokens, farmingAddress, currentStakeId } = farmingYouvesItemStore;
  const stakedToken = useToken(item?.stakedToken ?? null);
  const stakedTokenBalance = useTokenBalance(stakedToken);

  const form = useStakeFormForming(farmingAddress, currentStakeId, stakedToken, stakedTokenBalance);

  const disabled = form.disabled || isNotDefined(tezos) || isNotDefined(accountPkh);

  return {
    ...form,
    disabled,
    tokens,
    balance: stakedTokenBalance
  };
};
