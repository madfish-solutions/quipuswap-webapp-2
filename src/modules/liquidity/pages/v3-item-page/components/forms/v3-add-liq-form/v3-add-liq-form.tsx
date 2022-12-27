import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { useV3AddLiqFormViewModel } from './use-v3-add-liq-form.vm';
import { V3AddLiqFormView } from './v3-add-liq-form.view';

export const V3AddLiqForm: FC = observer(() => {
  const params = useV3AddLiqFormViewModel();

  return <V3AddLiqFormView {...params} />;
});
