import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { DexTwoAddLiqFormView } from '@shared/components';

import { useDexTwoAddLiqFormViewModel } from './use-dex-two-add-liq-form.vm';

interface Props {
  canMigrateLiquidity?: boolean;
  onMigrateLiquidity?: () => void;
}

export const DexTwoAddLiqForm: FC<Props> = observer(props => {
  const params = useDexTwoAddLiqFormViewModel();

  const comonParams = { ...params, ...props };

  return <DexTwoAddLiqFormView {...comonParams} />;
});
