import { Undefined } from '@shared/types';

import { FarmingFormTabs } from '../pages/item/types';

export const isValidFamingTab = (farmingTab: Undefined<string>): farmingTab is FarmingFormTabs =>
  Boolean(farmingTab && Object.values(FarmingFormTabs).includes(farmingTab as FarmingFormTabs));
