import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { StateWrapper } from '@shared/components';

import { DexTwoAddLiq } from './dex-two-add-liq';
import { useDexTwoPageContainerViewModel } from './use-dex-two-page-container.vm';

export const PageContainerAdd: FC = observer(() => {
  const { isInitialized } = useDexTwoPageContainerViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<>Loading...</>}>
      <DexTwoAddLiq />
    </StateWrapper>
  );
});
