import { useCallback, useMemo, useState } from 'react';

import { StakingTabs } from '../types';

export const TabsContent = [
  {
    id: StakingTabs.stake,
    label: 'Stake'
  },
  {
    id: StakingTabs.unstake,
    label: 'Unstake'
  }
];

export const useStakingRouter = () => {
  const [urlLoaded, setUrlLoaded] = useState(true);
  const [initialLoad, setInitialLoad] = useState(false);
  const [stakingTab, setStakingTab] = useState<StakingTabs>(StakingTabs.stake);

  const handleSetActiveId = useCallback((val: string) => {
    setStakingTab(val as StakingTabs);
  }, []);

  const currentTab = useMemo(() => TabsContent.find(({ id }) => id === stakingTab)!, [stakingTab]);

  return {
    urlLoaded,
    setUrlLoaded,
    initialLoad,
    setInitialLoad,
    stakingTab,
    currentTab,
    setStakingTab,
    handleSetActiveId
  };
};
