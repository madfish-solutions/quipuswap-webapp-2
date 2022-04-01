import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';

import { FarmingDetails } from './components/farming-details';
import { FarmingRewardInfo } from './components/farming-reward-info';
import { FarmingFormTabsCard } from './components/farming-tabs/farming-from-tabs-card';
import { useFarmingItemPageViewModel } from './use-farming-item-page.vm';

export const FarmingItemPage: FC = observer(() => {
  const { getTitle } = useFarmingItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{getTitle()}</PageTitle>
      <FarmingRewardInfo />
      <StickyBlock>
        <FarmingFormTabsCard />
        <FarmingDetails />
      </StickyBlock>
    </>
  );
});
