import React, { useContext } from 'react';

import { Bage, Button, Tooltip, ColorModes, TokensLogos, CurrencyAmount, ColorThemeContext } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { fromDecimals, getWhitelistedTokenSymbol, prepareTokenLogo } from '@utils/helpers';
import { PoolTableType } from '@utils/types';

import s from './PoolCardTable.module.sass';

interface PoolCardItemProps {
  pool: PoolTableType;
  isSponsored?: boolean;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const PoolCardItem: React.FC<PoolCardItemProps> = ({ pool, isSponsored }) => {
  const { t } = useTranslation(['home']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], s.card)}>
      <div className={cx(s.cardCellItem, s.tokenLogoBlock)}>
        <div className={s.links}>
          <TokensLogos
            firstTokenIcon={prepareTokenLogo(pool.token1.metadata.thumbnailUri)}
            firstTokenSymbol={getWhitelistedTokenSymbol(pool.token1)}
            secondTokenIcon={prepareTokenLogo(pool.token2.metadata.thumbnailUri)}
            secondTokenSymbol={getWhitelistedTokenSymbol(pool.token2)}
            className={s.tokenLogo}
          />
          {pool.pair.name}
        </div>
        {isSponsored && <Bage text={t('home|Sponsored')} />}
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>
          {t('home|TVL')}
          <Tooltip
            sizeT="small"
            content={t(
              'TVL (Total Value Locked) represents the total amount of a specific token locked on QuipuSwap across different pools.'
            )}
          />
        </div>
        <div className={cx(s.bold, s.cardCellText)}>
          <CurrencyAmount
            amount={fromDecimals(new BigNumber(pool.data.tvl), 6)
              .multipliedBy(new BigNumber(pool.xtzUsdQuote))
              .integerValue()
              .toString()}
            currency="$"
            isLeftCurrency
            className={s.cardAmount}
          />
        </div>
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>
          {t('home|Volume 24h')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
        <div className={cx(s.bold, s.cardCellText)}>
          $
          <CurrencyAmount
            className={s.cardAmount}
            amount={fromDecimals(new BigNumber(pool.data.volume24h), 6)
              .multipliedBy(new BigNumber(pool.xtzUsdQuote))
              .integerValue()
              .toString()}
          />
        </div>
      </div>
      <div className={cx(s.links, s.cardCellItem, s.buttons)}>
        <Button theme="secondary" className={s.button} href={pool.buttons.first.href} external>
          {t('home|Analytics')}
        </Button>
        <Button href="/swap" className={s.button}>
          {t('home|Trade')}
        </Button>
      </div>
    </div>
  );
};
