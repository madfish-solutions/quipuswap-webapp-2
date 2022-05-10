import { getLastElement } from '@shared/helpers';

import { Tabs } from '../stableswap.page';

export const getLastRouterTabsAndCheckForAddOrRemove = (path: string) => {
  const pathParts = path.split('/').filter(part => part);
  const lastTab = getLastElement(pathParts);
  const isAddOrRemoveInUrl = pathParts.some(part => part === Tabs.add || part === Tabs.remove);
  const isLastTabAddOrRemove = lastTab === Tabs.add || lastTab === Tabs.remove;

  return { lastTab, isAddOrRemoveInUrl, isLastTabAddOrRemove };
};
