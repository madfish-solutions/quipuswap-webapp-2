import { useState } from 'react';

import { TabsProps } from '@shared/components';
import { getFirstElement } from '@shared/helpers';

export const tabsContent = [
  {
    id: 'tokens',
    label: 'Tokens'
  },
  {
    id: 'list',
    label: 'List'
  },
  {
    id: 'settings',
    label: 'Settings'
  }
];

export const useTokensModalTabsService = (): TabsProps => {
  const [activeId, setActiveId] = useState(getFirstElement(tabsContent).id);

  return {
    values: tabsContent,
    activeId,
    setActiveId
  };
};
