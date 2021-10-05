import React, { useMemo } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';
import { FoundDex } from '@quipuswap/sdk';

import {
  getWhitelistedTokenSymbol, transformTokenDataToAnalyticsLink,
} from '@utils/helpers';
import { TEZOS_TOKEN } from '@utils/defaults';
import { TokenDataMap, WhitelistedToken } from '@utils/types';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Tooltip } from '@components/ui/Tooltip';
import { CardCell } from '@components/ui/Card/CardCell';
import { Skeleton } from '@components/ui/Skeleton';
import { Route } from '@components/common/Route';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '@styles/CommonContainer.module.sass';

type SwapDetailsProps = {
  currentTab: string
  fee: string
  token1: WhitelistedToken
  token2: WhitelistedToken
  tokensData: TokenDataMap
  priceImpact: BigNumber
  rate1: BigNumber
  rate2: BigNumber
  dex?: FoundDex
  dex2?: FoundDex
};

export const SwapDetails: React.FC<SwapDetailsProps> = ({
  currentTab,
  fee,
  token1,
  token2,
  tokensData,
  priceImpact,
  rate1,
  rate2,
  dex,
  dex2,
}) => {
  const { t } = useTranslation(['common', 'swap']);
  const loading = useMemo(() => !token1 || !token2, [token1, token2]);
  const tokenAName = useMemo(() => (token1 ? getWhitelistedTokenSymbol(token1) : 'Token A'), [token1]);
  const tokenBName = useMemo(() => (token2 ? getWhitelistedTokenSymbol(token2) : 'Token B'), [token2]);
  const sellRate = (((rate2 && !rate2.isNaN()) && !rate2.eq(0))
    ? rate2
    : new BigNumber(tokensData.first.exchangeRate ?? 1)
      .div(new BigNumber(tokensData.second.exchangeRate ?? 1)))
    .toString();
  const buyRate = (((rate1 && !rate1.isNaN()) && !rate1.eq(0))
    ? rate1
    : new BigNumber(tokensData.second.exchangeRate ?? 1)
      .div(new BigNumber(tokensData.first.exchangeRate ?? 1)))
    .toString();
  return (
    <Card
      header={{
        content: `${currentTab} Details`,
      }}
      contentClassName={s.content}
    >
      <CardCell
        header={(
          <>
            {t('common|Sell Price')}
            {!loading && (
            <Tooltip
              sizeT="small"
              content={t('common|The amount of {{tokenB}} you receive for 1 {{tokenA}}, according to the current exchange rate.', { tokenA: tokenAName, tokenB: tokenBName })}
            />
            )}
          </>
          )}
        className={s.cell}
      >
        <div className={s.cellAmount}>
          {loading ? <Skeleton className={s.currency} /> : (<CurrencyAmount amount="1" currency={tokenAName} />)}
          <span className={s.equal}>=</span>
          {loading ? <Skeleton className={s.currency2} /> : (
            <CurrencyAmount
              amount={sellRate}
              currency={tokenBName}
              dollarEquivalent={tokensData.first.exchangeRate ? `${tokensData.first.exchangeRate}` : undefined}
            />
          )}
        </div>
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common|Buy Price')}
            {!loading && (
            <Tooltip
              sizeT="small"
              content={t('common|The amount of {{tokenA}} you receive for 1 {{tokenB}}, according to the current exchange rate.', { tokenA: tokenAName, tokenB: tokenBName })}
            />
            )}
          </>
          )}
        className={s.cell}
      >
        <div className={s.cellAmount}>
          {loading ? <Skeleton className={s.currency} /> : (<CurrencyAmount amount="1" currency={tokenBName} />)}
          <span className={s.equal}>=</span>
          {loading ? <Skeleton className={s.currency2} /> : (
            <CurrencyAmount
              amount={buyRate}
              currency={tokenAName}
              dollarEquivalent={tokensData.second.exchangeRate ? `${tokensData.second.exchangeRate}` : undefined}
            />
          )}
        </div>
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common|Price impact')}
            <Tooltip
              sizeT="small"
              content={t('swap|The impact your transaction is expected to make on the exchange rate.')}
            />
          </>
          )}
        className={s.cell}
      >
        <CurrencyAmount amount={!priceImpact || priceImpact.isNaN() || priceImpact.lt(0.01) ? '<0.01' : priceImpact.toFixed(2)} currency="%" />
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common|Fee')}
            <Tooltip
              sizeT="small"
              content={t('swap|This fee is split by liquidity providers proportional to their contribution to liquidity reserves.')}
            />
          </>
          )}
        className={s.cell}
      >
        <CurrencyAmount amount={+fee < 0.00000001 || Number.isNaN(+fee) ? '<0.00000001' : fee} currency="TEZ" />
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common|Route')}
            <Tooltip
              sizeT="small"
              content={t("swap|When a direct swap is impossible (no liquidity pool for the pair exists yet) QuipuSwap's algorithm will conduct the swap in several transactions, picking the most beneficial chain of trades.")}
            />
          </>
          )}
        className={s.cell}
      >
        {loading ? <Skeleton className={s.routes} /> : (
          <Route
            routes={
                [{
                  id: 0,
                  name: tokenAName,
                  link: transformTokenDataToAnalyticsLink(tokensData.first),
                },
                ...(tokensData.first.token.address !== 'tez' && tokensData.second.token.address !== 'tez' ? [{
                  id: 1,
                  name: 'TEZ',
                  link: 'https://analytics.quipuswap.com/tokens/tez',
                }] : []),
                {
                  id: 2,
                  name: tokenBName,
                  link: transformTokenDataToAnalyticsLink(tokensData.second),
                }]
              }
          />
        )}
      </CardCell>
      <div className={s.detailsButtons}>
        {!loading && dex2 && dex && (
        <Button
          className={s.detailsButton}
          theme="inverse"
          href={`https://analytics.quipuswap.com/pairs/${dex.contract.address}`}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          { t('common|View {{tokenA}}/{{tokenB}} Pair Analytics',
            {
              tokenA: tokenAName,
              tokenB: TEZOS_TOKEN.metadata.symbol,
            })}
        </Button>
        )}
        {!loading && dex ? (
          <Button
            className={s.detailsButton}
            theme="inverse"
            href={`https://analytics.quipuswap.com/pairs/${dex2 ? dex2.contract.address : dex.contract.address}`}
            external
            icon={<ExternalLink className={s.linkIcon} />}
          >
            {dex2
              ? t('common|View {{tokenA}}/{{tokenB}} Pair Analytics',
                {
                  tokenA: TEZOS_TOKEN.metadata.symbol,
                  tokenB: tokenBName,
                })
              : t('common|View Pair Analytics')}
          </Button>
        ) : <Skeleton className={cx(s.buttonSkel, s.detailsButton)} />}
      </div>
    </Card>
  );
};
