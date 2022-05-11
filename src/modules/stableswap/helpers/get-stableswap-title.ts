import { getSymbolsString, isExist } from '@shared/helpers';
import { i18n } from '@translation';

import { StableswapItem } from '../types';
import { extractTokens } from './../stableswap-liquidity/pages/list/components/pool-card/pool-card.helpers';

export const getStableswapTitle = (stableswapItem: Nullable<StableswapItem>) => {
  if (isExist(stableswapItem)) {
    const { tokensInfo } = stableswapItem;
    const tokenSymbols = getSymbolsString(extractTokens(tokensInfo));

    return `${i18n.t('liquidity|Liquidity')} ${tokenSymbols}`;
  }
};
