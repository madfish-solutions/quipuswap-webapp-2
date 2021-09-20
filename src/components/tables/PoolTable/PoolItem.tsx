import React, { useContext } from 'react';
import cx from 'classnames';
import { PoolTableType, WhitelistedToken } from '@utils/types';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';
import { Bage } from '@components/ui/Bage';

import s from './PoolTable.module.sass';

type PoolItemProps = {
  pool: PoolTableType
  isSponsored?: boolean
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const PoolItem: React.FC<PoolItemProps> = ({
  pool,
  isSponsored = false,
}) => {
  const { t } = useTranslation(['home']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(
    s.tableRow,
    s.farmRow,
    s.tableHeader,
    modeClass[colorThemeMode],
    s.tableHeaderBorder,
  );
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
    <tr>
      <td className={compoundClassName}>
        <div className={cx(s.links, s.cardCellItem, s.maxWidth, s.wideItem, s.cardCellText)}>
          <TokensLogos
            token1={token1}
            token2={token2}
            className={s.tokenLogo}
          />
          {pool.pair.token1.name}
          /
          {pool.pair.token2.name}
          {isSponsored && (<Bage className={s.bage} text={t('home:Sponsored')} />)}
        </div>
        <div className={s.cardCellItem}>
          $
          <CurrencyAmount className={s.cardAmount} amount={`${pool.data.tvl}`} />
        </div>
        <div className={s.cardCellItem}>
          $
          <CurrencyAmount className={s.cardAmount} amount={`${pool.data.volume24}`} />
        </div>
        <div className={cx(s.links, s.cardCellItem)}>
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
      </td>
    </tr>
  );
};
