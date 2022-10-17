import { FC } from 'react';

import { UnstakeFormView } from './unstake-form.view';
import { useUnstakeFormViewModel } from './use-unstake-form.vm';

export const UnstakeForm: FC = () => {
  const params = useUnstakeFormViewModel();

  return <UnstakeFormView {...params} />;
};
