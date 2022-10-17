import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { StakeFormView } from './stake-form.view';
import { useStakeFormViewModel } from './use-stake-form.vm';

export const StakeForm: FC = observer(() => {
  const params = useStakeFormViewModel();

  return <StakeFormView {...params} />;
});
