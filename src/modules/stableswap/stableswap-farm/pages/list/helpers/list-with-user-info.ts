import { StableFarmItem, StakerInfo } from '@modules/stableswap/types';

export const listWithUserInfo = (listStore: Array<StableFarmItem>, stakerInfo: Array<StakerInfo>) => {
  return listStore.map((item: StableFarmItem, index: number) => {
    return { ...item, ...stakerInfo[index] };
  });
};
