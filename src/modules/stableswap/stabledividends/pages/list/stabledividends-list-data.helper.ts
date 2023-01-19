import BigNumber from 'bignumber.js';

import { AppRootRoutes } from '@app.router';
import { DOLLAR, PERCENT } from '@config/constants';
import { StableswapDividendsItemModel } from '@modules/stableswap/models';
import { StableswapRoutes } from '@modules/stableswap/stableswap-routes.enum';
import { StableDividendsFormTabs, StakerInfo } from '@modules/stableswap/types';
import { extractTokens, isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';
import { i18n } from '@translation';

import { defineWhitelistedItemLabel } from './helpers';

const DEFAULT_VALUE = new BigNumber('0');

export const stableDividendsListDataHelper = (
  item: StableswapDividendsItemModel & StakerInfo,
  accountPkh: Nullable<string>
) => {
  const shouldShowUserStats =
    !isNull(accountPkh) && (item.yourDeposit?.gt(DEFAULT_VALUE) || item.yourEarnedInUsd?.gt(DEFAULT_VALUE));

  const link = `${AppRootRoutes.Stableswap}${StableswapRoutes.dividends}/${StableDividendsFormTabs.stake}/${item.version}/${item.stableDividendsItemUrl}`;
  const status = defineWhitelistedItemLabel(item);
  const extractedTokens = extractTokens(item.tokensInfo);

  const itemDTI = `stable-dividends-item-${item.id}`;

  const itemStats = [
    {
      cellName: i18n.t('stableswap|tvl'),
      amounts: {
        amount: item.tvl,
        dollarEquivalent: item.tvl.multipliedBy(item.stakedTokenExchangeRate),
        currency: DOLLAR,
        dollarEquivalentOnly: true
      }
    },
    {
      cellName: i18n.t('stableswap|apr'),
      amounts: {
        amount: item.maxApr,
        currency: PERCENT,
        amountDecimals: 2
      }
    },
    {
      cellName: i18n.t('stableswap|apy'),
      amounts: {
        amount: item.maxApy,
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
            amount: item.yourEarnedInUsd,
            dollarEquivalent: item.yourEarnedInUsd,
            dollarEquivalentOnly: true
          }
        }
      ]
    : undefined;

  return {
    href: link,
    status,
    inputToken: item.stakedToken,
    outputToken: extractedTokens,
    itemStats,
    userStats,
    itemDTI
  };
};
