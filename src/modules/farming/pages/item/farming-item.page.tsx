import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, TestnetAlert } from '@shared/components';

import { FarmingInfo } from './components/farming-info';
import { useFarmingItemPageViewModel } from './use-farming-item-page.vm';

export const FarmingItemPage: FC = observer(() => {
  const { getTitle, isYouves } = useFarmingItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="farmingItemPageTitle">{getTitle()}</PageTitle>
      <FarmingInfo isYouves={isYouves} />
    </>
  );
});
