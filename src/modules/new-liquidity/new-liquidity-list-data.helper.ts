import { AppRootRoutes } from '@app.router';
import { DOLLAR, PERCENT } from '@config/constants';
import { ActiveStatus } from '@shared/types';
import { i18n } from '@translation';

import { LiquidityItemWrap } from './interfaces';

export const newLiquidityListDataHelper = ({ item: { id, tokensInfo, tvlInUsd, apr, maxApr } }: LiquidityItemWrap) => ({
  href: `${AppRootRoutes.NewLiquidity}/${id.toFixed()}`,
  inputToken: tokensInfo.map(({ token }) => token),
  status: { status: ActiveStatus.ACTIVE, filled: true },
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
        amount: apr,
        currency: PERCENT
      }
    },
    {
      cellName: i18n.t('newLiquidity|maxApr'),
      tooltip: 'Max APR tooltip',
      amounts: {
        amount: maxApr,
        currency: PERCENT
      }
    }
  ]
});
