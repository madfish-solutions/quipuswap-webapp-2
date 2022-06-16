import { StableswapFarmFormView } from '../stableswap-farm-form-view';
import { useStakeFormViewModel } from './stake-form.vm';

export const StakeForm = () => {
  const params = useStakeFormViewModel();

  return <StableswapFarmFormView {...params} />;
};
