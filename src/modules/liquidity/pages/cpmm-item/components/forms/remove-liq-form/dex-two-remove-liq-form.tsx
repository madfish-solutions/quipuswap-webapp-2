import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { DexTwoRemoveLiqFormView } from '@shared/components';

import { useDexTwoRemoveLiqFormViewModel } from './use-dex-two-remove-liq-form.vm';

export const DexTwoRemoveLiqForm: FC = observer(() => {
  const params = useDexTwoRemoveLiqFormViewModel();

  return <DexTwoRemoveLiqFormView {...params} />;
});
