import { useState } from 'react';

import { TabsProps } from '@shared/components';
import { getFirstElement } from '@shared/helpers';

export enum TokensModalTab {
  TOKENS = 'TOKENS',
  MANAGE = 'MANAGE'
}

export const tabsContent = [
  {
    id: TokensModalTab.TOKENS,
    label: 'Tokens'
  },
  {
    id: TokensModalTab.MANAGE,
    label: 'Manage'
  }
];

export const useTokensModalTabsService = (): TabsProps<TokensModalTab> => {
  const [activeId, setActiveId] = useState<TokensModalTab>(getFirstElement(tabsContent).id);

  return {
    values: tabsContent,
    activeId,
    setActiveId
  };
};
