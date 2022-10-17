import { FC } from 'react';

import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';

import { YouvesDetails } from './components/youves-details';
import { YouvesRewardInfo } from './components/youves-reward-info/youves-reward-info';
import { YouvesFormTabsCard } from './components/youves-tabs';
import { useYouvesItemPageViewModel } from './use-youves-item-page.vm';

export const YouvesItemPage: FC = () => {
  const { getTitle } = useYouvesItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="youvesItemPageTitle">{getTitle()}</PageTitle>
      <YouvesRewardInfo />
      <StickyBlock>
        <YouvesFormTabsCard />
        <YouvesDetails />
      </StickyBlock>
    </>
  );
};
