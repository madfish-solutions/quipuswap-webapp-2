import { FC } from 'react';

import { StickyBlock } from '@shared/components';

import { PageTitleContainer } from './components';

export const V3ItemPage: FC = () => {
  return (
    <>
      <PageTitleContainer />

      <StickyBlock>body</StickyBlock>
    </>
  );
};
