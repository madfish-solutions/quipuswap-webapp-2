import { FC } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';

import { PageTitle } from '@components/common/page-title';
import { TestnetAlert } from '@components/common/testnet-alert';
import { isUndefined } from '@utils/helpers';

import { FarmingDetails } from './components/farming-details';
import { FarmingRewardInfo } from './components/farming-reward-info';
import { FarmingTabsCard } from './components/farming-tabs/farming-tabs-card';
import { useFarmingItemPageViewModel } from './use-farming-item-page.vm';

export const FarmingItemPage: FC = observer(() => {
  const router = useRouter();
  const { isLoading, farmingItem, getTitle } = useFarmingItemPageViewModel();

  if (!isLoading && isUndefined(farmingItem)) {
    void router.replace('/404');

    return null;
  }

  return (
    <>
      <TestnetAlert />
      <PageTitle>{getTitle()}</PageTitle>
      <FarmingRewardInfo />
      <StickyBlock>
        <FarmingTabsCard />
        <FarmingDetails />
      </StickyBlock>
    </>
  );
});
