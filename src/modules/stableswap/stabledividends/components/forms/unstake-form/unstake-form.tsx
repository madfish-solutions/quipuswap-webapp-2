import { observer } from 'mobx-react-lite';

import { useUntakeFormViewModel } from './use-unstake-form.vm';
import { StableDividendsFormView } from '../stabledividends-form-view';

export const UnstakeForm = observer(() => {
  const params = useUntakeFormViewModel();

  return <StableDividendsFormView {...params} />;
});
