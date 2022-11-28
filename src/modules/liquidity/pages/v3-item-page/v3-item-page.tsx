import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { ListStats, StickyBlock } from '@shared/components';

import { OpenNewPosition, PageTitleContainer } from './components';
import { useV3ItemPageViewModel } from './use-v3-item-page.vm';

export const V3ItemPage: FC = observer(() => {
  const { stats } = useV3ItemPageViewModel();

  return (
    <>
      <PageTitleContainer />
      <ListStats stats={stats} slidesToShow={3} />
      <OpenNewPosition />

      <StickyBlock>body</StickyBlock>
    </>
  );
});
