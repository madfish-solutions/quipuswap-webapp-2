import { observer } from 'mobx-react-lite';

import { StableDividendsFormView } from '../stableswap-farm-form-view';
import { useStakeFormViewModel } from './use-stake-form.vm';

export const StakeForm = observer(() => {
  const params = useStakeFormViewModel();

  return <StableDividendsFormView {...params} />;
});
