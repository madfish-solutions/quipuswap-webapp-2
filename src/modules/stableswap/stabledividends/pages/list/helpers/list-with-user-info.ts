import { StableswapDividendsItemModel } from '@modules/stableswap/models';
import { StakerInfo } from '@modules/stableswap/types';

export const listWithUserInfo = (listStore: Array<StableswapDividendsItemModel>, stakerInfo: Array<StakerInfo>) => {
  return listStore.map((item: StableswapDividendsItemModel, index: number) => {
    return {
      ...item,
      ...stakerInfo[index],
      apr: item.aprOneWeek,
      apy: item.apyOneWeek,
      tvl: item.tvl,
      stableDividendsItemUrl: item.stableDividendsItemUrl
    };
  });
};
