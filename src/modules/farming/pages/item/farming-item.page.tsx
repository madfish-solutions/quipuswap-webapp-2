import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';

import { FarmingDetails } from './components/farming-details';
import { FarmingRewardInfo } from './components/farming-reward-info';
import { FarmingFormTabsCard } from './components/farming-tabs/farming-from-tabs-card';
import { useFarmingItemPageViewModel } from './use-farming-item-page.vm';
import { YouvesCard } from '../list/components';

export const FarmingItemPage: FC = observer(() => {
  const { title, isYouves } = useFarmingItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="farmingItemPageTitle">{title}</PageTitle>
      <FarmingRewardInfo />
      {isYouves && <YouvesCard />}
      <StickyBlock>
        <FarmingFormTabsCard />
        <FarmingDetails />
      </StickyBlock>
    </>
  );
});
