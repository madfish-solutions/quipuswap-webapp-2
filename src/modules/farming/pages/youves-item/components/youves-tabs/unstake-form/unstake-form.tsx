import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { UnstakeFormView } from './unstake-form.view';
import { useUnstakeFormViewModel } from './use-unstake-form.vm';

export const UnstakeForm: FC = observer(() => {
  const params = useUnstakeFormViewModel();

  return <UnstakeFormView {...params} />;
});
