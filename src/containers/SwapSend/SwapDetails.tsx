import React from 'react';
import { useTranslation } from 'next-i18next';
import { TransferParams } from '@taquito/taquito';

import {
  getWhitelistedTokenSymbol,
} from '@utils/helpers';
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
  swapParams: TransferParams[]
};

export const SwapDetails: React.FC<SwapDetailsProps> = ({
  currentTab,
  fee,
  token1,
  token2,
  tokensData,
  swapParams,
}) => {
  const { t } = useTranslation(['common', 'swap']);
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
            amount={`${(+(tokensData.first.exchangeRate ?? 1)) / (+(tokensData.second.exchangeRate ?? 1))}`}
            currency={token2 ? getWhitelistedTokenSymbol(token2) : ''}
            dollarEquivalent={`${tokensData.first.exchangeRate}`}
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
          <CurrencyAmount amount="1" currency={token2 ? getWhitelistedTokenSymbol(token2) : ''} />
          <span className={s.equal}>=</span>
          <CurrencyAmount
            amount={`${(+(tokensData.second.exchangeRate ?? 1)) / (+(tokensData.first.exchangeRate ?? 1))}`}
            currency={token1 ? getWhitelistedTokenSymbol(token1) : ''}
            dollarEquivalent={`${tokensData.second.exchangeRate}`}
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
        {/* TODO: find how to calculate */}
        {/* depends on token amount and token pool */}
        <CurrencyAmount amount="<0.01" currency="%" />
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
        <CurrencyAmount amount={fee} currency="XTZ" />
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
      {swapParams.length > 0 && (
      <Button
        className={s.detailsButton}
        theme="inverse"
        target="_blank"
        href={`https://analytics.quipuswap.com/pairs/${swapParams.find((x) => x.parameter?.entrypoint === 'tezToTokenPayment' || x.parameter?.entrypoint === 'tezToTokenPayment')?.to}`}
      >
        View Pair Analytics
        <ExternalLink className={s.linkIcon} />
      </Button>
      )}
    </Card>
  );
};
