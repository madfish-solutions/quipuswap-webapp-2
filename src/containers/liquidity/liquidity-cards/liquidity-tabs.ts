export enum LiquidityTabs {
  Add = 'add',
  Remove = 'remove'
}

export interface LiquidityTab {
  id: LiquidityTabs;
  label: string;
}

export const TABS_CONTENT: LiquidityTab[] = [
  {
    id: LiquidityTabs.Add,
    label: 'Add'
  },
  {
    id: LiquidityTabs.Remove,
    label: 'Remove'
  }
];

export const getTabById = (tabId: LiquidityTabs) => {
  const findActiveTab = TABS_CONTENT.find(tab => tab.id === tabId);
  if (!findActiveTab) {
    throw new Error('Tab is undefined: ' + tabId);
  }

  return findActiveTab;
};
