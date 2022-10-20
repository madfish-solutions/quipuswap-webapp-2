import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { defined, isNotDefined } from '@shared/helpers';

import { FormProps } from '../form-props.interface';
import { useStakeFormForming } from '../stake-form/use-stake-form-forming';
import { TabProps } from '../tab-props.interface';

export const useUnstakeFormViewModel = (props: TabProps): FormProps => {
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
    disabled
  };
};
