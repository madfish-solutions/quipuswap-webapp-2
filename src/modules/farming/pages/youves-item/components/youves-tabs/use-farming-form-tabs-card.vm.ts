import { useState } from 'react';

import { YouvesFormTabs } from '../../types';

export const TabsContent = [
  {
    id: YouvesFormTabs.stake,
    label: 'Stake'
  },
  {
    id: YouvesFormTabs.unstake,
    label: 'Unstake'
  }
];

export const useFarmingFormTabsCardViewModel = () => {
  const [currentTab, setCurrentTab] = useState(YouvesFormTabs.stake);
  const isStakeForm = currentTab === YouvesFormTabs.stake;

  return {
    currentTab,
    setCurrentTab,
    isStakeForm
  };
};
