import { observer } from 'mobx-react-lite';

import { StableswapFarmFormView } from '../stableswap-farm-form-view';
import { useUntakeFormViewModel } from './use-unstake-form.vm';

export const UnstakeForm = observer(() => {
  const params = useUntakeFormViewModel();

  return <StableswapFarmFormView {...params} />;
});
