import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { StateWrapper } from '@shared/components';

import { DexTwoRemoveLiq } from './dex-two-remove-liq';
import { useDexTwoPageContainerViewModel } from './use-dex-two-page-container.vm';

export const PageContainerRemove: FC = observer(() => {
  const { isInitialized } = useDexTwoPageContainerViewModel();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<>Loading...</>}>
      <DexTwoRemoveLiq />
    </StateWrapper>
  );
});
