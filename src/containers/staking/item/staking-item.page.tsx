import { FC } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';

import { PageTitle } from '@components/common/page-title';
import { TestnetAlert } from '@components/common/testnet-alert';
import { isUndefined } from '@utils/helpers';

import { StakingDetails } from './components/staking-details';
import { StakingRewardInfo } from './components/staking-reward-info';
import { StakingTabsCard } from './components/staking-tabs/staking-tabs-card';
import { useStakeItemPageViewModel } from './use-stake-item-page.vm';

export const StakingItemPage: FC = observer(() => {
  const router = useRouter();
  const { isLoading, stakeItem, getTitle } = useStakeItemPageViewModel();

  if (!isLoading && isUndefined(stakeItem)) {
    void router.replace('/404');

    return null;
  }

  return (
    <>
      <TestnetAlert />
      <PageTitle>{getTitle()}</PageTitle>
      <StakingRewardInfo />
      <StickyBlock>
        <StakingTabsCard />
        <StakingDetails />
      </StickyBlock>
    </>
  );
});
