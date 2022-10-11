import { FC } from 'react';

import { YouvesCard } from '@modules/farming/pages/list/components';
import { StickyBlock } from '@shared/components';

import { FarmingDetails } from '../farming-details';
import { FarmingRewardInfo } from '../farming-reward-info';
import { FarmingFormTabsCard } from '../farming-tabs/farming-from-tabs-card';

interface Props {
  isYouves: boolean;
}

export const FarmingInfo: FC<Props> = ({ isYouves }) => {
  return isYouves ? (
    <YouvesCard />
  ) : (
    <>
      <FarmingRewardInfo />
      <StickyBlock>
        <FarmingFormTabsCard />
        <FarmingDetails />
      </StickyBlock>
    </>
  );
};
