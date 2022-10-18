import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TabProps } from '../tab-props.interface';
import { StakeFormView } from './stake-form.view';
import { useStakeFormViewModel } from './use-stake-form.vm';

export const StakeForm: FC<TabProps> = observer(props => {
  const params = useStakeFormViewModel(props);

  return <StakeFormView {...params} />;
});
