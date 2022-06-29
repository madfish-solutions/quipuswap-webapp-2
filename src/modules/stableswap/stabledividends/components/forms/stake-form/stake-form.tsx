import { observer } from 'mobx-react-lite';

import { StableDividendsFormView } from '../stabledividends-form-view';
import { useStakeFormViewModel } from './use-stake-form.vm';

export const StakeForm = observer(() => {
  const params = useStakeFormViewModel();

  return <StableDividendsFormView {...params} />;
});
