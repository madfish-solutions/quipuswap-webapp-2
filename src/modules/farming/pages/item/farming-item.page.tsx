import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';

import { YouvesCard } from '../list/components';
import { FarmingDetails } from './components/farming-details';
import { FarmingRewardInfo } from './components/farming-reward-info';
import { FarmingFormTabsCard } from './components/farming-tabs/farming-from-tabs-card';
import { useFarmingItemPageViewModel } from './use-farming-item-page.vm';

export const FarmingItemPage: FC = observer(() => {
  const { getTitle, isYouves } = useFarmingItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="farmingItemPageTitle">{getTitle()}</PageTitle>
      <FarmingRewardInfo />
      {isYouves && <YouvesCard />}
      <StickyBlock>
        <FarmingFormTabsCard />
        <FarmingDetails />
      </StickyBlock>
    </>
  );
});
