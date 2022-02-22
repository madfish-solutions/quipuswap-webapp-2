import { FC } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';

import { PageTitle } from '@components/common/page-title';
import { StakingTabsCard } from '@containers/staking/item/components/staking-form/staking-tabs-card';
import { StakingRewardInfo } from '@containers/staking/item/components/staking-reward-info';
import { useStakeItemPageViewModel } from '@containers/staking/item/use-stake-item-page.vm';
import { isUndefined } from '@utils/helpers';

import { StakingDetails } from './components/staking-details';

export const StakingItemPage: FC = observer(() => {
  const router = useRouter();
  const { isLoading, stakeItem, getTitle } = useStakeItemPageViewModel();

  if (!isLoading && isUndefined(stakeItem)) {
    void router.replace('/404');

    return null;
  }

  return (
    <>
      <PageTitle>{getTitle()}</PageTitle>
      <StakingRewardInfo />
      <StickyBlock>
        <StakingTabsCard />
        <StakingDetails isError={!isLoading && !stakeItem} />
      </StickyBlock>
    </>
  );
});
