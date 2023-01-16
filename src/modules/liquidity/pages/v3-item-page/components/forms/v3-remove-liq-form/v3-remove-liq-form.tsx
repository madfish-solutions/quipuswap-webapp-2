import { FC } from 'react';

import { useV3RemoveLiqFormViewModel } from './use-v3-remove-liq-form.vm';
import { V3RemoveLiqFormView } from './v3-remove-liq-form.view';

export const V3RemoveLiqForm: FC = () => {
  const params = useV3RemoveLiqFormViewModel();

  return <V3RemoveLiqFormView {...params} />;
};
