import { FC } from 'react';

import { TabProps } from '../tab-props.interface';
import { UnstakeFormView } from './unstake-form.view';
import { useUnstakeFormViewModel } from './use-unstake-form.vm';

export const UnstakeForm: FC<TabProps> = () => {
  const params = useUnstakeFormViewModel();

  return <UnstakeFormView {...params} />;
};
