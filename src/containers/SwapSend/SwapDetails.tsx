import React from 'react';
import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';
import { FoundDex } from '@quipuswap/sdk';

import {
  getWhitelistedTokenSymbol,
} from '@utils/helpers';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { TokenDataMap, WhitelistedToken } from '@utils/types';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Tooltip } from '@components/ui/Tooltip';
import { CardCell } from '@components/ui/Card/CardCell';
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
            {t('common:Sell Price')}
            <Tooltip
              sizeT="small"
              content={t('common:The amount of token B you receive for 1 token A, according to the current exchange rate.')}
            />
          </>
          )}
        className={s.cell}
      >
        <div className={s.cellAmount}>
          <CurrencyAmount amount="1" currency={token1 ? getWhitelistedTokenSymbol(token1) : ''} />
          <span className={s.equal}>=</span>
          <CurrencyAmount
            amount={sellRate}
            currency={token2
              ? getWhitelistedTokenSymbol(token2) : getWhitelistedTokenSymbol(STABLE_TOKEN)}
            dollarEquivalent={tokensData.first.exchangeRate ? `${tokensData.first.exchangeRate}` : undefined}
          />
        </div>
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common:Buy Price')}
            <Tooltip
              sizeT="small"
              content={t('common:The amount of token A you receive for 1 token B, according to the current exchange rate.')}
            />
          </>
          )}
        className={s.cell}
      >
        <div className={s.cellAmount}>
          <CurrencyAmount amount="1" currency={token2 ? getWhitelistedTokenSymbol(token2) : getWhitelistedTokenSymbol(STABLE_TOKEN)} />
          <span className={s.equal}>=</span>
          <CurrencyAmount
            amount={buyRate}
            currency={token1 ? getWhitelistedTokenSymbol(token1) : ''}
            dollarEquivalent={tokensData.second.exchangeRate ? `${tokensData.second.exchangeRate}` : undefined}
          />
        </div>
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common:Price impact')}
            <Tooltip
              sizeT="small"
              content={t('swap:The impact your transaction is expected to make on the exchange rate.')}
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
            {t('common:Fee')}
            <Tooltip
              sizeT="small"
              content={t('swap:Expected fee for this transaction charged by the Tezos blockchain.')}
            />
          </>
          )}
        className={s.cell}
      >
        <CurrencyAmount amount={+fee < 0.00000001 || Number.isNaN(+fee) ? '<0.00000001' : fee} currency="XTZ" />
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common:Route')}
            <Tooltip
              sizeT="small"
              content={t("swap:When a direct swap is impossible (no liquidity pool for the pair exists yet) QuipuSwap's algorithm will conduct the swap in several transactions, picking the most beneficial chain of trades.")}
            />
          </>
          )}
        className={s.cell}
      >
        <Route
          routes={
                [{
                  id: 0,
                  name: token1 ? getWhitelistedTokenSymbol(token1) : '',
                  link: `https://analytics.quipuswap.com/tokens/${tokensData.first.token.address}`,
                },
                ...(tokensData.first.token.address !== 'tez' && tokensData.second.token.address !== 'tez' ? [{
                  id: 1,
                  name: 'XTZ',
                  link: 'https://analytics.quipuswap.com/tokens/tez',
                }] : []),
                {
                  id: 2,
                  name: token2 ? getWhitelistedTokenSymbol(token2) : '',
                  link: `https://analytics.quipuswap.com/tokens/${tokensData.second.token.address}`,
                }]
              }
        />
      </CardCell>
      {(dex || dex2) && (
      <div className={s.detailsButtons}>
        {dex2 && (
        <Button
          className={s.detailsButton}
          theme="inverse"
          href={`https://analytics.quipuswap.com/pairs/${dex2.contract.address}`}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          { t('common:View {{tokenA}}/{{tokenB}} Pair Analytics',
            {
              tokenA: getWhitelistedTokenSymbol(token1),
              tokenB: TEZOS_TOKEN.metadata.symbol,
            })}
        </Button>
        )}
        {dex && (
        <Button
          className={s.detailsButton}
          theme="inverse"
          href={`https://analytics.quipuswap.com/pairs/${dex.contract.address}`}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          {dex2
            ? t('common:View {{tokenA}}/{{tokenB}} Pair Analytics',
              {
                tokenA: TEZOS_TOKEN.metadata.symbol,
                tokenB: getWhitelistedTokenSymbol(token2),
              })
            : t('common:View Pair Analytics')}
        </Button>
        )}
      </div>
      )}
    </Card>
  );
};
