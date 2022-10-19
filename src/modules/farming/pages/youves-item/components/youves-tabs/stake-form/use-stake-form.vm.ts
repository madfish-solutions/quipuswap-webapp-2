import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { defined, isNotDefined } from '@shared/helpers';

import { TabProps } from '../tab-props.interface';
import { StakeProps } from './stake-props.interface';
import { useStakeFormForming } from './use-stake-form-forming';

export const useStakeFormViewModel = (props: TabProps): StakeProps => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const { contractAddress, stakeId, lpToken, userLpTokenBalance } = props;
  const form = useStakeFormForming(defined(contractAddress, 'Contract address'), stakeId, lpToken, userLpTokenBalance);

  const disabled = form.disabled || isNotDefined(tezos) || isNotDefined(accountPkh);

  return {
    ...props,
    ...form,
    userLpTokenBalance,
    disabled
  };
};
