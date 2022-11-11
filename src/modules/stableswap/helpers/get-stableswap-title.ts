import { extractTokens, getSymbolsString, isExist } from '@shared/helpers';
import { Nullable } from '@shared/types';
import { i18n } from '@translation';

import { StableswapItemModel } from '../models';

export const getStableswapTitle = (stableswapItem: Nullable<StableswapItemModel>) => {
  if (isExist(stableswapItem)) {
    const { tokensInfo } = stableswapItem;
    const tokenSymbols = getSymbolsString(extractTokens(tokensInfo));

    return `${i18n.t('liquidity|Liquidity')} ${tokenSymbols}`;
  }
};
