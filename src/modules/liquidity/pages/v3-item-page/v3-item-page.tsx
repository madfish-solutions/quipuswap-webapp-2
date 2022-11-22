import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock } from '@shared/components';

import { useV3ItemPageViewModel } from './use-v3-item-page.vm';

export const V3ItemPage: FC = observer(() => {
  const { title } = useV3ItemPageViewModel();

  return (
    <>
      <PageTitle data-test-id="v3LiqTitle">{title}</PageTitle>

      <StickyBlock>body</StickyBlock>
    </>
  );
});
