import React from 'react';

import { Button, TokensLogos, Tooltip } from '@quipuswap/ui-kit';
import { useTranslation } from 'next-i18next';

import s from '@components/tables/PoolTable/PoolTable.module.sass';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { calculateRateAmount, getWhitelistedTokenSymbol, prepareTokenLogo } from '@utils/helpers';
import { PoolTableType } from '@utils/types';

import { getHref } from './get-swap-href.helper';

export const useColumns = () => {
  const { t } = useTranslation(['home']);

  return [
    {
      Header: t('home|Name'),
      id: 'name',
      accessor: ({ token1, token2, pair }: PoolTableType) => (
        <div className={s.links}>
          <TokensLogos
            firstTokenIcon={prepareTokenLogo(token1.metadata?.thumbnailUri)}
            firstTokenSymbol={getWhitelistedTokenSymbol(token1)}
            secondTokenIcon={prepareTokenLogo(token2.metadata?.thumbnailUri)}
            secondTokenSymbol={getWhitelistedTokenSymbol(token2)}
            className={s.tokenLogo}
          />
          <span className={s.cardCellText}>{pair.name}</span>
        </div>
      )
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|TVL')}
          <Tooltip
            sizeT="small"
            content={t(
              'TVL (Total Value Locked) represents the total amount of a specific token locked on QuipuSwap across different pools.'
            )}
          />
        </div>
      ),
      id: 'tvl',
      accessor: ({ data: dataInside, xtzUsdQuote }: PoolTableType) => (
        <div className={s.links}>
          <StateCurrencyAmount
            amount={calculateRateAmount(dataInside.tvl, xtzUsdQuote)}
            currency="$"
            isLeftCurrency
            className={s.cardAmount}
          />
        </div>
      )
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Volume 24h')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
      ),
      id: 'volume24h',
      accessor: ({ data: dataInside, xtzUsdQuote }: PoolTableType) => (
        <>
          <StateCurrencyAmount
            amount={calculateRateAmount(dataInside.volume24h, xtzUsdQuote)}
            currency="$"
            isLeftCurrency
            className={s.cardAmount}
          />
        </>
      )
    },
    {
      id: 'poolButton',
      accessor: ({ buttons, pair }: PoolTableType) => (
        <div className={s.last}>
          <Button theme="secondary" className={s.button} href={buttons.first.href ?? ''} external>
            {buttons.first.label}
          </Button>
          <Button href={getHref({ pair })} className={s.button}>
            {buttons.second.label}
          </Button>
        </div>
      )
    }
  ];
};
