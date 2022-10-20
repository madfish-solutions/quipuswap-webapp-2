import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { defined, isNotDefined } from '@shared/helpers';

import { FormProps } from '../form-props.interface';
import { TabProps } from '../tab-props.interface';
import { useStakeFormForming } from './use-stake-form-forming';

export const useStakeFormViewModel = (props: TabProps): FormProps => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const { contractAddress, stakeId, stakedToken, stakedTokenBalance } = props;
  const form = useStakeFormForming(
    defined(contractAddress, 'Contract address'),
    stakeId,
    stakedToken,
    stakedTokenBalance
  );

  const disabled = form.disabled || isNotDefined(tezos) || isNotDefined(accountPkh);

  return {
    ...props,
    ...form,
    stakedTokenBalance,
    disabled
  };
};
