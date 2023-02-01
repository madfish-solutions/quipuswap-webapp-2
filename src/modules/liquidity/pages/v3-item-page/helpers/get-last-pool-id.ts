import { PoolType } from '@modules/liquidity/interfaces';
import { LiquidityItemModel } from '@modules/liquidity/models';
import { getLastElementFromArray, isEqual } from '@shared/helpers';

import { mapLiquidityListItem } from '../../list/map-liquidity-list-item';

export const getLastPoolId = (list: never[] | LiquidityItemModel[]) => {
  return getLastElementFromArray(
    list
      .filter(item => isEqual(item.type, PoolType.UNISWAP))
      .map(mapLiquidityListItem)
      .map(item => item.id.toFixed())
  );
};
