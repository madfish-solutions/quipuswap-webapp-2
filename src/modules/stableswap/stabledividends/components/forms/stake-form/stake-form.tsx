import { observer } from 'mobx-react-lite';

import { useStakeFormViewModel } from './use-stake-form.vm';
import { StableDividendsFormView } from '../stabledividends-form-view';

export const StakeForm = observer(() => {
  const params = useStakeFormViewModel();

  return <StableDividendsFormView {...params} />;
});
