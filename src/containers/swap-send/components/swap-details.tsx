import React, { useMemo } from 'react';

import { Button, Card, CardCell, ExternalLink, CurrencyAmount, Tooltip, Route, RouteProps } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';

import { useNewExchangeRates } from '@hooks/useNewExchangeRate';
import s from '@styles/CommonContainer.module.sass';
import { MAINNET_DEFAULT_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { getTokenSlug, getWhitelistedTokenSymbol, transformTokenDataToAnalyticsLink } from '@utils/helpers';
import { FormatNumber } from '@utils/helpers/formatNumber';
import { DexPair, WhitelistedToken } from '@utils/types';

interface SwapDetailsProps {
  currentTab: string;
  fee?: BigNumber;
  priceImpact?: BigNumber;
  inputToken?: WhitelistedToken;
  outputToken?: WhitelistedToken;
  route?: DexPair[];
  buyRate?: BigNumber;
  sellRate?: BigNumber;
}

const dexRouteToQuipuUiKitRoute = (inputToken: WhitelistedToken, dexRoute: DexPair[]) => {
  if (dexRoute.length === 0) {
    return [];
  }

  return dexRoute.reduce<{ displayedRoute: RouteProps['routes']; currentToken: WhitelistedToken }>(
    ({ displayedRoute, currentToken }, { token1, token2 }, index) => {
      const token1IsNext = getTokenSlug(token2) === getTokenSlug(currentToken);
      const newCurrentToken = token1IsNext ? token1 : token2;
      const {
        contractAddress,
        type: tokenType,
        fa2TokenId,
        metadata: { decimals }
      } = newCurrentToken;

      return {
        displayedRoute: [
          ...displayedRoute,
          {
            id: index + 1,
            name: getWhitelistedTokenSymbol(newCurrentToken),
            link: transformTokenDataToAnalyticsLink({
              token: {
                address: contractAddress,
                type: tokenType,
                id: fa2TokenId,
                decimals
              },
              balance: '0'
            })
          }
        ],
        currentToken: newCurrentToken
      };
    },
    {
      displayedRoute: [
        {
          id: 0,
          name: getWhitelistedTokenSymbol(inputToken),
          link: transformTokenDataToAnalyticsLink({
            token: {
              address: inputToken.contractAddress,
              type: inputToken.type,
              id: inputToken.fa2TokenId,
              decimals: inputToken.metadata.decimals
            },
            balance: '0'
          })
        }
      ],
      currentToken: inputToken
    }
  ).displayedRoute;
};

export const SwapDetails: React.FC<SwapDetailsProps> = ({
  currentTab,
  fee,
  priceImpact,
  inputToken,
  outputToken,
  route = [],
  buyRate,
  sellRate
}) => {
  const { t } = useTranslation(['common', 'swap']);
  const exchangeRates = useNewExchangeRates();
  const inputTokenUsdExchangeRate = inputToken && exchangeRates[getTokenSlug(inputToken)];
  const outputTokenUsdExchangeRate = outputToken && exchangeRates[getTokenSlug(outputToken)];

  const sellUsdRate = useMemo(
    () => (outputTokenUsdExchangeRate && sellRate ? sellRate.times(outputTokenUsdExchangeRate) : undefined),
    [outputTokenUsdExchangeRate, sellRate]
  );
  const buyUsdRate = useMemo(
    () => (inputTokenUsdExchangeRate && sellRate ? sellRate.times(inputTokenUsdExchangeRate) : undefined),
    [inputTokenUsdExchangeRate, sellRate]
  );

  const routes = useMemo(() => (inputToken ? dexRouteToQuipuUiKitRoute(inputToken, route) : []), [inputToken, route]);

  return (
    <Card
      header={{
        content: `${currentTab} Details`
      }}
      contentClassName={s.content}
    >
      <CardCell
        header={
          <>
            {t('common|Sell Price')}
            <Tooltip
              sizeT="small"
              content={t(
                'common|The amount of token B you receive for 1 token A, according to the current exchange rate.'
              )}
            />
          </>
        }
        className={s.cell}
      >
        <div className={s.cellAmount}>
          {sellRate && (
            <>
              <CurrencyAmount amount="1" currency={inputToken ? getWhitelistedTokenSymbol(inputToken) : ''} />
              <span className={s.equal}>=</span>
              <CurrencyAmount
                amount={FormatNumber(sellRate)}
                currency={getWhitelistedTokenSymbol(outputToken ?? MAINNET_DEFAULT_TOKEN)}
                dollarEquivalent={sellUsdRate?.toFixed(2)}
              />
            </>
          )}
        </div>
      </CardCell>
      <CardCell
        header={
          <>
            {t('common|Buy Price')}
            <Tooltip
              sizeT="small"
              content={t(
                'common|The amount of token A you receive for 1 token B according to the current exchange rate.'
              )}
            />
          </>
        }
        className={s.cell}
      >
        <div className={s.cellAmount}>
          {buyRate && (
            <>
              <CurrencyAmount amount="1" currency={getWhitelistedTokenSymbol(outputToken ?? MAINNET_DEFAULT_TOKEN)} />
              <span className={s.equal}>=</span>
              <CurrencyAmount
                amount={FormatNumber(buyRate)}
                currency={getWhitelistedTokenSymbol(inputToken ?? TEZOS_TOKEN)}
                dollarEquivalent={buyUsdRate?.toFixed(2)}
              />
            </>
          )}
        </div>
      </CardCell>
      <CardCell
        header={
          <>
            {t('common|Price impact')}
            <Tooltip
              sizeT="small"
              content={t('swap|The impact your transaction is expected to make on the exchange rate.')}
            />
          </>
        }
        className={s.cell}
      >
        <CurrencyAmount
          amount={
            !priceImpact || priceImpact.isNaN() || priceImpact.lt(0.01)
              ? '<0.01'
              : FormatNumber(priceImpact, { decimals: 2 })
          }
          currency="%"
        />
      </CardCell>
      <CardCell
        header={
          <>
            {t('common|Fee')}
            <Tooltip
              sizeT="small"
              content={t('swap|Expected fee for this transaction charged by the Tezos blockchain.')}
            />
          </>
        }
        className={s.cell}
      >
        {fee && <CurrencyAmount amount={fee.toFixed()} currency="XTZ" />}
      </CardCell>
      <CardCell
        header={
          <>
            {t('common|Route')}
            <Tooltip
              sizeT="small"
              content={t(
                "swap|When a direct swap is impossible (no liquidity pool for the pair exists yet) QuipuSwap's algorithm will conduct the swap in several transactions, picking the most beneficial chain of trades."
              )}
            />
          </>
        }
        className={s.cell}
      >
        <Route routes={routes} />
      </CardCell>
      {route.length > 0 && (
        <div className={s.detailsButtons}>
          {route.map(({ id, type: dexType, token1, token2 }) => (
            <Button
              key={id}
              className={s.detailsButton}
              theme="inverse"
              href={dexType === 'tokenxtz' ? `https://analytics.quipuswap.com/pairs/${id}` : '#'}
              external
              icon={<ExternalLink className={s.linkIcon} />}
            >
              {t('common|View {{tokenA}}/{{tokenB}} Pair Analytics', {
                tokenA: getWhitelistedTokenSymbol(token1),
                tokenB: getWhitelistedTokenSymbol(token2)
              })}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
};
