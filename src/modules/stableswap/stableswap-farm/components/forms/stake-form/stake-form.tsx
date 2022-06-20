import { observer } from 'mobx-react-lite';

import { StableswapFarmFormView } from '../stableswap-farm-form-view';
import { useStakeFormViewModel } from './stake-form.vm';

export const StakeForm = observer(() => {
  const params = useStakeFormViewModel();

  return <StableswapFarmFormView {...params} />;
});
