import { useCallback, useState } from 'react';

import { defined } from '@shared/helpers';
import { i18n } from '@translation';

enum Tabs {
  details = 'details',
  guides = 'guides'
}

export const tabsContent = [
  {
    id: Tabs.details,
    label: i18n.t('common|Pool Details')
  },
  {
    id: Tabs.guides,
    label: i18n.t('common|guides')
  }
];

export const useTabs = () => {
  const [currentTab, setCurrentTab] = useState<{ id: Tabs; label: string }>(tabsContent[0]);

  const activeId = currentTab.id;
  const isDetails = activeId === Tabs.details;

  const setTabId = useCallback(
    (id: string) => {
      const tab = tabsContent.find(t => t.id === id);

      setCurrentTab(defined(tab));
    },
    [setCurrentTab]
  );

  return {
    activeId: currentTab.id,
    tabsContent,
    isDetails,
    setTabId
  };
};
