import { StableDividendsItem, StakerInfo } from '@modules/stableswap/types';

export const listWithUserInfo = (listStore: Array<StableDividendsItem>, stakerInfo: Array<StakerInfo>) => {
  return listStore.map((item: StableDividendsItem, index: number) => {
    return { ...item, ...stakerInfo[index] };
  });
};
