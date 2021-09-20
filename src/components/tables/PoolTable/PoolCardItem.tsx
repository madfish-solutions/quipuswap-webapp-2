import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { PoolTableType, WhitelistedToken } from '@utils/types';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';
import { Bage } from '@components/ui/Bage';

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
  const token1: WhitelistedToken = {
    contractAddress: '',
    type: 'fa1.2',
    metadata: {
      decimals: 6,
      thumbnailUri: pool.pair.token1.icon,
      name: pool.pair.token1.name ?? '',
      symbol: pool.pair.token1.name ?? '',
    },
  };
  const token2: WhitelistedToken = {
    contractAddress: '',
    type: 'fa1.2',
    metadata: {
      decimals: 6,
      thumbnailUri: pool.pair.token2.icon,
      name: pool.pair.token2.name ?? '',
      symbol: pool.pair.token2.name ?? '',
    },
  };
  return (
    <div className={cx(modeClass[colorThemeMode], s.card)}>
      <div className={cx(s.cardCellItem, s.tokenLogoBlock)}>
        <div className={s.links}>
          <TokensLogos
            token1={token1}
            token2={token2}
            className={s.tokenLogo}
          />
          {pool.pair.token1.name}
          /
          {pool.pair.token2.name}
        </div>
        {isSponsored && (<Bage text={t('home:Sponsored')} />)}
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>
          {t('home:TVL')}
          <Tooltip sizeT="small" content={t('TVL (Total Value Locked) represents the total amount of a specific token locked on QuiuSwap across different pools.')} />
        </div>
        <div className={cx(s.bold, s.cardCellText)}>
          $
          <CurrencyAmount className={s.cardAmount} amount={`${pool.data.tvl}`} />
        </div>
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>
          {t('home:Volume 24h')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
        <div className={cx(s.bold, s.cardCellText)}>
          $
          <CurrencyAmount className={s.cardAmount} amount={`${pool.data.volume24}`} />
        </div>
      </div>
      <div className={cx(s.links, s.cardCellItem, s.buttons)}>
        <Button
          theme="secondary"
          className={s.button}
          href={pool.buttons.first.href}
          external
        >
          {t('home:Analytics')}
        </Button>
        <Button
          href="/swap"
          className={s.button}
        >
          {t('home:Trade')}
        </Button>
      </div>
    </div>
  );
};
