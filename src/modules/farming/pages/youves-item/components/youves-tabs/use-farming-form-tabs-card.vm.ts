import { useCallback, useMemo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { ITab } from '@shared/components';
import { isExist } from '@shared/helpers';

import { useFarmingYouvesItemStore } from '../../../../hooks';
import { YouvesFormTabs } from '../../types';

export const TABS_CONTENT: ITab[] = [
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
  const navigate = useNavigate();
  const { id, tab, version } = useParams();

  const { currentStakeBalance, item } = useFarmingYouvesItemStore();

  const isStakeForm = !tab || tab === YouvesFormTabs.stake;
  const currentTab = isStakeForm ? YouvesFormTabs.stake : YouvesFormTabs.unstake;
  const canShowUnstakeForm = isExist(item);

  const setCurrentTab = useCallback(
    (tabName: YouvesFormTabs) => {
      navigate(`${AppRootRoutes.Farming}/${version}/${id}/${tabName}`);
    },
    [id, navigate, version]
  );

  const tabs = useMemo(() => {
    TABS_CONTENT[1].disabled = !currentStakeBalance;

    return TABS_CONTENT;
  }, [currentStakeBalance]);

  return {
    canShowUnstakeForm,
    tabs,
    currentTab,
    setCurrentTab,
    isStakeForm
  };
};
