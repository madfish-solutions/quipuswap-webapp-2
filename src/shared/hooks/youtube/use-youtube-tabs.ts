import { useCallback, useMemo, useState } from 'react';

import { amplitudeService } from '@shared/services';
import { i18n } from '@translation';

enum Tabs {
  details = 'details',
  guides = 'guides'
}

interface Params {
  detailsLabel: string;
  page: string;
}

export const useYoutubeTabs = ({ detailsLabel, page }: Params) => {
  const tabsContent = useMemo(
    () => [
      {
        id: Tabs.details,
        label: detailsLabel
      },
      {
        id: Tabs.guides,
        label: i18n.t('common|guides')
      }
    ],
    [detailsLabel]
  );

  const [activeId, setActiveId] = useState<Tabs>(tabsContent[0].id);

  const isDetails = activeId === Tabs.details;

  const setTabId = useCallback(
    (id: string) => {
      if (id === Tabs.guides) {
        amplitudeService.logEvent('OPEN_GUIDE_TAB', { page });
      }

      setActiveId(id as Tabs);
    },
    [page]
  );

  return {
    activeId,
    tabsContent,
    isDetails,
    setTabId
  };
};
