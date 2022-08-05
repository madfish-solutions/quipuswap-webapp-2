import { DOLLAR, PERCENT } from '@config/constants';
import { ActiveStatus } from '@shared/types';
import { i18n } from '@translation';

import { isHotPool } from './helpers/is-hot-pool.helper';
import { POOLS_DATA } from './hot-pools-data';

export const newLiquidityListDataHelper = () => {
  const hotPools = POOLS_DATA.filter(item => isHotPool(item));

  const listData = POOLS_DATA.map(
    ({ itemUrl, tokensInfo, tvlInUsd, newLiquidityLablesData, isNewLiquidity, visibleIcon }) => ({
      href: itemUrl,
      inputToken: tokensInfo,
      status: { status: ActiveStatus.ACTIVE, filled: true },
      isNewLiquidity,
      visibleIcon,
      newLiquidityLablesData,
      itemStats: [
        {
          cellName: i18n.t('newLiquidity|TVL'),
          tooltip: 'TVL tooltip',
          amounts: {
            amount: tvlInUsd,
            currency: DOLLAR,
            dollarEquivalent: tvlInUsd,
            dollarEquivalentOnly: true
          }
        },
        {
          cellName: i18n.t('newLiquidity|volume'),
          tooltip: 'Volume tooltip',
          amounts: {
            amount: tvlInUsd,
            currency: DOLLAR,
            dollarEquivalent: tvlInUsd,
            dollarEquivalentOnly: true
          }
        },
        {
          cellName: i18n.t('newLiquidity|APR'),
          tooltip: 'APR tooltip',
          amounts: {
            amount: tvlInUsd,
            currency: PERCENT
          }
        },
        {
          cellName: i18n.t('newLiquidity|maxApr'),
          tooltip: 'Max APR tooltip',
          amounts: {
            amount: tvlInUsd,
            currency: PERCENT
          }
        }
      ]
    })
  );

  return {
    list: listData,
    hotPools
  };
};
