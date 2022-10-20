import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';

import { YouvesDetails } from './components/youves-details';
import { YouvesRewardInfo } from './components/youves-reward-info';
import { YouvesFormTabsCard } from './components/youves-tabs';
import { useYouvesItemPageViewModel } from './use-youves-item-page.vm';

export const YouvesItemPage: FC = observer(() => {
  const { title, ...props } = useYouvesItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="youvesItemPageTitle">{title}</PageTitle>
      <YouvesRewardInfo />
      <StickyBlock>
        <YouvesFormTabsCard {...props} />
        <YouvesDetails />
      </StickyBlock>
      <div>({`${props.stakeId}`})</div>
    </>
  );
});
