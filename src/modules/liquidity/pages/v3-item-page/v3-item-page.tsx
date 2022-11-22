import { FC } from 'react';

import { StickyBlock } from '@shared/components';

import { OpenNewPosition, PageTitleContainer } from './components';

export const V3ItemPage: FC = () => {
  return (
    <>
      <PageTitleContainer />
      <OpenNewPosition />

      <StickyBlock>body</StickyBlock>
    </>
  );
};
