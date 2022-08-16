import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { DexTwoAddLiqFormView } from '@shared/components';

import { useDexTwoAddLiqFormViewModel } from './use-dex-two-add-liq-form.vm';

export const DexTwoAddLiqForm: FC = observer(() => {
  const params = useDexTwoAddLiqFormViewModel();

  return <DexTwoAddLiqFormView {...params} />;
});
