import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { StickyBlock } from '@shared/components';

import { PageTitleContainer } from './components';
import { useV3PositionsViewModel } from './use-v3-positions.vm';

export const V3PositionsPage: FC = observer(() => {
  const viewModel = useV3PositionsViewModel();

  // eslint-disable-next-line
  console.log(JSON.stringify(viewModel, undefined, 2));

  return (
    <>
      <PageTitleContainer />

      <StickyBlock>TODO: add a list of positions</StickyBlock>
    </>
  );
});
