import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { StickyBlock } from '@shared/components';

import { PageTitleContainer } from '../v3-item-page/components';
import { useV3PositionsViewModel } from './use-v3-positions.vm';

export const V3PositionsPage: FC = observer(() => {
  const viewModel = useV3PositionsViewModel();

  // eslint-disable-next-line no-console
  console.log(viewModel);

  return (
    <>
      <PageTitleContainer />

      <StickyBlock>body</StickyBlock>
    </>
  );
});
