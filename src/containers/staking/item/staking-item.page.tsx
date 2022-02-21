import { FC } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';

import { PageTitle } from '@components/common/page-title';
import { StakingTabsCard } from '@containers/staking/item/components/staking-tabs/staking-tabs-card';
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

      {/* TODO: add items like reward stats */}

      <StickyBlock>
        <StakingTabsCard />
        <StakingDetails item={stakeItem} isError={!isLoading && !stakeItem} />
      </StickyBlock>
    </>
  );
});
