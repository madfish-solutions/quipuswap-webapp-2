import BigNumber from 'bignumber.js';

import { AppRootRoutes } from '@app.router';
import { DOLLAR, PERCENT } from '@config/constants';
import { extractTokens } from '@modules/stableswap/helpers';
import { StableswapRoutes } from '@modules/stableswap/stableswap-routes.enum';
import { StableDividendsFormTabs, StableDividendsItem, StakerInfo } from '@modules/stableswap/types';
import { isNull } from '@shared/helpers';
import { ActiveStatus } from '@shared/types';
import { i18n } from '@translation';

const DEFAULT_VALUE = new BigNumber('0');

export const stableDividendsListDataHelper = (item: StableDividendsItem & StakerInfo, accountPkh: Nullable<string>) => {
  const shouldShowUserStats =
    !isNull(accountPkh) && (item.yourDeposit?.gt(DEFAULT_VALUE) || item.yourEarned?.gt(DEFAULT_VALUE));

  const link = `${AppRootRoutes.Stableswap}${StableswapRoutes.dividends}/${StableDividendsFormTabs.stake}/${item.stableDividendsItemUrl}`;
  const status = { status: ActiveStatus.ACTIVE, label: i18n.t('common|whiteListed'), filled: true };
  const extractedTokens = extractTokens(item.tokensInfo);

  const stableDividendsItemDTI = `stable-dividends-item-${item.id}`;

  const itemStats = [
    {
      cellName: i18n.t('stableswap|tvl'),
      amounts: {
        amount: item.tvl,
        dollarEquivalent: item.tvl,
        currency: DOLLAR,
        dollarEquivalentOnly: true
      }
    },
    {
      cellName: i18n.t('stableswap|apr'),
      amounts: {
        amount: item.apr,
        currency: PERCENT,
        amountDecimals: 2
      }
    },
    {
      cellName: i18n.t('stableswap|apy'),
      amounts: {
        amount: item.apy,
        currency: PERCENT,
        amountDecimals: 2
      }
    }
  ];

  const userStats = shouldShowUserStats
    ? [
        {
          cellName: i18n.t('stableswap|yourDeposit'),
          amounts: {
            amount: item.yourDeposit,
            dollarEquivalent: item.yourDeposit.multipliedBy(item.stakedTokenExchangeRate),
            dollarEquivalentOnly: true
          }
        },
        {
          cellName: i18n.t('stableswap|yourEarned'),
          amounts: {
            amount: item.yourEarned,
            dollarEquivalent: item.yourEarned.multipliedBy(item.stakedTokenExchangeRate),
            dollarEquivalentOnly: true
          }
        }
      ]
    : undefined;

  return {
    href: link,
    status: status,
    inputToken: item.stakedToken,
    outputToken: extractedTokens,
    itemStats,
    userStats,
    stableDividendsItemDTI
  };
};
