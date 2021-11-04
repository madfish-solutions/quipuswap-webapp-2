import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';
import { Button, Bage } from '@madfish-solutions/quipu-ui-kit';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { PoolTableType } from '@utils/types';
import { fromDecimals } from '@utils/helpers';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Tooltip } from '@components/ui/Tooltip';

import s from './PoolCardTable.module.sass';

type PoolCardItemProps = {
  pool: PoolTableType
  isSponsored?: boolean
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const PoolCardItem: React.FC<PoolCardItemProps> = ({
  pool,
  isSponsored,
}) => {
  const { t } = useTranslation(['home']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  return (
    <div className={cx(modeClass[colorThemeMode], s.card)}>
      <div className={cx(s.cardCellItem, s.tokenLogoBlock)}>
        <div className={s.links}>
          <TokensLogos
            token1={pool.token1}
            token2={pool.token2}
            className={s.tokenLogo}
          />
          {pool.pair.name}
        </div>
        {isSponsored && (<Bage text={t('home|Sponsored')} />)}
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>
          {t('home|TVL')}
          <Tooltip sizeT="small" content={t('TVL (Total Value Locked) represents the total amount of a specific token locked on QuiuSwap across different pools.')} />
        </div>
        <div className={cx(s.bold, s.cardCellText)}>
          $
          <CurrencyAmount
            className={s.cardAmount}
            amount={fromDecimals(new BigNumber(pool.data.tvl), 6)
              .multipliedBy(new BigNumber(pool.xtzUsdQuote))
              .integerValue()
              .toString()}
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
        <Button
          theme="secondary"
          className={s.button}
          href={pool.buttons.first.href}
          external
        >
          {t('home|Analytics')}
        </Button>
        <Button
          href="/swap"
          className={s.button}
        >
          {t('home|Trade')}
        </Button>
      </div>
    </div>
  );
};
