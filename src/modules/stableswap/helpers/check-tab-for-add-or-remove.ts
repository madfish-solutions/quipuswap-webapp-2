import { Tabs } from '../stableswap-liquidity';

export const checkTabForAddOrRemove = (tab: string) => tab === Tabs.add || tab === Tabs.remove;
