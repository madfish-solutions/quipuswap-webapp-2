import { FC } from 'react';

import { DexTwoAddLiqFormView } from '@shared/components';

import { useDexTwoAddLiqFormViewModel } from './use-dex-two-add-liq-form.vm';

export const DexTwoAddLiqForm: FC = () => {
  const params = useDexTwoAddLiqFormViewModel();

  return <DexTwoAddLiqFormView {...params} />;
};
