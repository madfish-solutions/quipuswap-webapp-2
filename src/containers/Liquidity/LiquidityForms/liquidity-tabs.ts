export enum LiquidityTabsEnum {
  Add = 'add',
  Remove = 'remove'
}

export interface LiquidityTab {
  id: LiquidityTabsEnum;
  label: string;
}

export const TABS_CONTENT: LiquidityTab[] = [
  {
    id: LiquidityTabsEnum.Add,
    label: 'Add'
  },
  {
    id: LiquidityTabsEnum.Remove,
    label: 'Remove'
  }
];

export const getTabById = (tabId: LiquidityTabsEnum) => {
  const findActiveTab = TABS_CONTENT.find(tab => tab.id === tabId);
  if (!findActiveTab) {
    throw new Error('Tab is undefined: ' + tabId);
  }

  return findActiveTab;
};
