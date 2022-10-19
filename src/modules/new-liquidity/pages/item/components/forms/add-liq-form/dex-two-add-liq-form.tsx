import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { DexTwoAddLiqFormView } from '@shared/components';

import { useDexTwoAddLiqFormViewModel } from './use-dex-two-add-liq-form.vm';

interface Props {
  isSubmitting?: boolean;
  canMigrateLiquidity?: boolean;
  handleMigrateLiquidity?: () => void;
}

export const DexTwoAddLiqForm: FC<Props> = observer(props => {
  const params = useDexTwoAddLiqFormViewModel();

  const commonParams = { ...params, ...props };

  return <DexTwoAddLiqFormView {...commonParams} />;
});
