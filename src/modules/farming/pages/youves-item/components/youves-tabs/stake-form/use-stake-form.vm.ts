import { useRootStore } from '@providers/root-store-provider';
import { isNotDefined } from '@shared/helpers';
import { useAuthStore, useToken, useTokenBalance } from '@shared/hooks';

import { useFarmingYouvesItemStore } from '../../../../../hooks';
import { StakeFormProps } from './stake-form-props.interface';
import { useStakeFormForming } from './use-stake-form-forming';

export const useStakeFormViewModel = (): StakeFormProps => {
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();

  const { item, tokens, currentStakeId, farmingId } = useFarmingYouvesItemStore();
  const stakedToken = useToken(item?.stakedToken ?? null);
  const stakedTokenBalance = useTokenBalance(stakedToken);

  const form = useStakeFormForming(
    item?.contractAddress ?? null,
    farmingId,
    currentStakeId,
    stakedToken,
    stakedTokenBalance
  );

  const disabled = form.disabled || isNotDefined(tezos) || isNotDefined(accountPkh);

  return {
    ...form,
    disabled,
    tokens,
    balance: stakedTokenBalance
  };
};
