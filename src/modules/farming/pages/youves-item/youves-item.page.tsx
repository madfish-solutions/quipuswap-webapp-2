import { FC } from 'react';

import { PageTitle, TestnetAlert } from '@shared/components';

import { YouvesRewardInfo } from './components/youves-reward-info';
import { useYouvesItemPageViewModel } from './use-youves-item-page.vm';

export const YouvesItemPage: FC = () => {
  const { getTitle } = useYouvesItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="farmingItemPageTitle">{getTitle()}</PageTitle>
      <YouvesRewardInfo />
    </>
  );
};
