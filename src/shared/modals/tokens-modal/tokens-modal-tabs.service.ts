import { useState } from 'react';

import { TabsProps } from '@shared/components';
import { getFirstElement } from '@shared/helpers';

export const tabsContent = [
  {
    id: 'tokens',
    label: 'Tokens'
  },
  {
    id: 'manage',
    label: 'Manage'
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
