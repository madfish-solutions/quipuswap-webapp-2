import { Tabs } from '../stableswap.page';

export const checkForAddOrRemoveInUrlParts = (urlParts: Array<string>) =>
  urlParts.some(part => part === Tabs.add || part === Tabs.remove);
