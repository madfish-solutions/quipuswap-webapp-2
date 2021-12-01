import React, { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';
import {
  Button,
  Card,
  CardCell,
  CurrencyAmount,
  Tooltip,
  Route,
  RouteProps,
} from '@quipuswap/ui-kit';

import { useNewExchangeRates } from '@hooks/useNewExchangeRate';
import {
  fromDecimals,
  getTokenInput,
  getTokenSlug,
  getWhitelistedTokenSymbol,
  transformTokenDataToAnalyticsLink,
} from '@utils/helpers';
import { MAINNET_DEFAULT_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { DexPair, WhitelistedToken } from '@utils/types';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '@styles/CommonContainer.module.sass';

type SwapDetailsProps = {
  currentTab: string;
  fee: string;
  priceImpact: BigNumber;
  inputToken?: WhitelistedToken;
  outputToken?: WhitelistedToken;
  inputAmount?: BigNumber;
  outputAmount?: BigNumber;
  route?: DexPair[];
};

export const SwapDetails: React.FC<SwapDetailsProps> = ({
  currentTab,
  fee,
  priceImpact,
  inputToken,
  outputToken,
  inputAmount,
  outputAmount,
  route = [],
}) => {
  const { t } = useTranslation(['common', 'swap']);
  const exchangeRates = useNewExchangeRates();
  const inputTokenUsdExchangeRate = inputToken && exchangeRates[getTokenSlug(inputToken)];
  const outputTokenUsdExchangeRate = outputToken && exchangeRates[getTokenSlug(outputToken)];

  const sellRate = useMemo(
    () => (inputToken && outputToken && inputAmount?.gt(0) && outputAmount
      ? outputAmount.div(inputAmount).decimalPlaces(outputToken.metadata.decimals)
      : undefined
    ),
    [inputAmount, outputAmount, inputToken, outputToken],
  );

  const buyRate = useMemo(
    () => {
      if (inputToken && outputToken && inputAmount?.gt(0) && route.length > 0) {
        const reversedRoute = [...route].reverse();
        try {
          const tokenAAmount = inputAmount;
          const tokenBAmount = fromDecimals(
            getTokenInput(
              inputToken,
              fromDecimals(inputAmount, -inputToken.metadata.decimals),
              reversedRoute,
            ),
            outputToken.metadata.decimals,
          );
          return tokenAAmount.div(tokenBAmount).decimalPlaces(inputToken.metadata.decimals);
          // eslint-disable-next-line no-empty
        } catch {}
      }
      return undefined;
    },
    [route, inputToken, outputToken, inputAmount],
  );

  const sellUsdRate = useMemo(
    () => (outputTokenUsdExchangeRate && sellRate
      ? sellRate.times(outputTokenUsdExchangeRate)
      : undefined),
    [outputTokenUsdExchangeRate, sellRate],
  );
  const buyUsdRate = useMemo(
    () => (inputTokenUsdExchangeRate && sellRate
      ? sellRate.times(inputTokenUsdExchangeRate)
      : undefined),
    [inputTokenUsdExchangeRate, sellRate],
  );

  const routes = useMemo(
    () => {
      const displayedRoute: RouteProps['routes'] = [];
      if (inputToken && route.length > 0) {
        displayedRoute.push({
          id: 0,
          name: getWhitelistedTokenSymbol(inputToken),
          link: transformTokenDataToAnalyticsLink({
            token: {
              address: inputToken.contractAddress,
              type: inputToken.type,
              id: inputToken.fa2TokenId,
              decimals: inputToken.metadata.decimals,
            },
            balance: '0',
          }),
        });
        let currentToken = inputToken;
        route.forEach(({ token1, token2 }, index) => {
          const token1IsNext = getTokenSlug(token2) === getTokenSlug(currentToken);
          currentToken = token1IsNext ? token1 : token2;
          displayedRoute.push({
            id: index + 1,
            name: getWhitelistedTokenSymbol(currentToken),
            link: transformTokenDataToAnalyticsLink({
              token: {
                address: currentToken.contractAddress,
                type: currentToken.type,
                id: currentToken.fa2TokenId,
                decimals: currentToken.metadata.decimals,
              },
              balance: '0',
            }),
          });
        });
      }
      return displayedRoute;
    },
    [inputToken, route],
  );

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
            <Tooltip
              sizeT="small"
              content={t('common|The amount of token B you receive for 1 token A, according to the current exchange rate.')}
            />
          </>
          )}
        className={s.cell}
      >
        <div className={s.cellAmount}>
          {sellRate && (
            <>
              <CurrencyAmount
                amount="1"
                currency={inputToken ? getWhitelistedTokenSymbol(inputToken) : ''}
              />
              <span className={s.equal}>=</span>
              <CurrencyAmount
                amount={sellRate.toFixed()}
                currency={getWhitelistedTokenSymbol(outputToken ?? MAINNET_DEFAULT_TOKEN)}
                dollarEquivalent={sellUsdRate?.toFixed(2)}
              />
            </>
          )}
        </div>
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common|Buy Price')}
            <Tooltip
              sizeT="small"
              content={t('common|The amount of token A you receive for 1 token B according to the current exchange rate.')}
            />
          </>
          )}
        className={s.cell}
      >
        <div className={s.cellAmount}>
          {buyRate && (
            <>
              <CurrencyAmount
                amount="1"
                currency={getWhitelistedTokenSymbol(outputToken ?? MAINNET_DEFAULT_TOKEN)}
              />
              <span className={s.equal}>=</span>
              <CurrencyAmount
                amount={buyRate.toFixed()}
                currency={getWhitelistedTokenSymbol(inputToken ?? TEZOS_TOKEN)}
                dollarEquivalent={buyUsdRate?.toFixed(2)}
              />
            </>
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
        <CurrencyAmount
          amount={!priceImpact || priceImpact.isNaN() || priceImpact.lt(0.01) ? '<0.01' : priceImpact.toFixed(2)}
          currency="%"
        />
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common|Fee')}
            <Tooltip
              sizeT="small"
              content={t('swap|Expected fee for this transaction charged by the Tezos blockchain.')}
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
            {t('common|Route')}
            <Tooltip
              sizeT="small"
              content={t("swap|When a direct swap is impossible (no liquidity pool for the pair exists yet) QuipuSwap's algorithm will conduct the swap in several transactions, picking the most beneficial chain of trades.")}
            />
          </>
          )}
        className={s.cell}
      >
        <Route routes={routes} />
      </CardCell>
      {(route.length > 0) && (
        <div className={s.detailsButtons}>
          {route.map(({ id, token1, token2 }) => (
            <Button
              key={id}
              className={s.detailsButton}
              theme="inverse"
              href={typeof id === 'string'
                ? `https://analytics.quipuswap.com/pairs/${id}`
                : '#'}
              external
              icon={<ExternalLink className={s.linkIcon} />}
            >
              {t(
                'common|View {{tokenA}}/{{tokenB}} Pair Analytics',
                {
                  tokenA: getWhitelistedTokenSymbol(token1),
                  tokenB: getWhitelistedTokenSymbol(token2),
                },
              )}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
};
