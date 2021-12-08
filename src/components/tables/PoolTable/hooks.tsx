import { PoolTableType } from '@utils/types';
import s from '@components/tables/PoolTable/PoolTable.module.sass';
import {
  Button, CurrencyAmount, TokensLogos, Tooltip,
} from '@quipuswap/ui-kit';
import { fromDecimals, getWhitelistedTokenSymbol, prepareTokenLogo } from '@utils/helpers';
import { toLocaleString } from '@utils/helpers/toLocaleString';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'next-i18next';

export const useColumns = () => {
  const { t } = useTranslation(['home']);
  return [
    {
      Header: t('home|Name'),
      id: 'name',
      accessor: ({ token1, token2, pair }:PoolTableType) => (
        <div className={s.links}>
          <TokensLogos
            firstTokenIcon={prepareTokenLogo(token1.metadata?.thumbnailUri)}
            firstTokenSymbol={getWhitelistedTokenSymbol(token1)}
            secondTokenIcon={prepareTokenLogo(token2.metadata?.thumbnailUri)}
            secondTokenSymbol={getWhitelistedTokenSymbol(token2)}
            className={s.tokenLogo}
          />
          <span className={s.cardCellText}>
            {pair.name}
          </span>
        </div>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|TVL')}
          <Tooltip sizeT="small" content={t('TVL (Total Value Locked) represents the total amount of a specific token locked on QuipuSwap across different pools.')} />
        </div>
      ),
      id: 'tvl',
      accessor: ({ data: dataInside, xtzUsdQuote }:PoolTableType) => (
        <div className={s.links}>
          <CurrencyAmount
            amount={toLocaleString(fromDecimals(new BigNumber(dataInside.tvl), 6)
              .multipliedBy(new BigNumber(xtzUsdQuote))
              .integerValue()
              .toString())}
            currency="$"
            isLeftCurrency
            className={s.cardAmount}
          />
        </div>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Volume 24h')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
      ),
      id: 'volume24h',
      accessor: ({ data: dataInside, xtzUsdQuote }:PoolTableType) => (
        <>
          <CurrencyAmount
            amount={toLocaleString(fromDecimals(new BigNumber(dataInside.tvl), 6)
              .multipliedBy(new BigNumber(xtzUsdQuote))
              .integerValue()
              .toString())}
            currency="$"
            isLeftCurrency
            className={s.cardAmount}
          />
        </>
      ),
    },
    {
      id: 'poolButton',
      accessor: ({ buttons }:PoolTableType) => (
        <div className={s.last}>
          <Button
            theme="secondary"
            className={s.button}
            href={buttons.first.href ?? ''}
            external
          >
            {buttons.first.label}
          </Button>
          <Button
            href={buttons.second.href ?? ''}
            className={s.button}
          >
            {buttons.second.label}
          </Button>
        </div>
      ),
    },
  ];
};
