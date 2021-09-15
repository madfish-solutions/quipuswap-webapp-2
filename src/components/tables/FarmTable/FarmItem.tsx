import React, { useContext } from 'react';
import cx from 'classnames';
import { WhitelistedFarm } from '@utils/types';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';
import { Bage } from '@components/ui/Bage';

import s from './FarmTable.module.sass';

type FarmItemProps = {
  farm: WhitelistedFarm
  isSponsored?: boolean
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const FarmItem: React.FC<FarmItemProps> = ({
  farm,
  isSponsored = false,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  return (
    <tr>
      <td className={cx(s.tableRow, s.farmRow, s.tableHeader, modeClass[colorThemeMode])}>
        <div className={cx(s.links, s.cardCellItem, s.maxWidth, s.wideItem, s.cardCellText)}>
          <TokensLogos
            token1={farm.tokenPair.token1}
            token2={farm.tokenPair.token2}
            className={s.tokenLogo}
          />
          {getWhitelistedTokenSymbol(farm.tokenPair.token1)}
          /
          {getWhitelistedTokenSymbol(farm.tokenPair.token2)}
          {isSponsored && (<Bage className={s.bage} text="Sponsored" />)}
        </div>
        <div className={s.cardCellItem}>
          $
          <CurrencyAmount className={s.cardAmount} amount="888888888888888.00" />
        </div>
        <div className={s.cardCellItem}>
          $
          <CurrencyAmount className={s.cardAmount} amount="888888888888888.00" />
        </div>
        <div className={cx(s.links, s.cardCellItem)}>
          <Button
            theme="secondary"
            className={s.button}
            href={`https://analytics.quipuswap.com/tokens/${farm.tokenPair.token1}`}
            external
          >
            Analytics
          </Button>
          <Button
            href="/swap"
            className={s.button}
          >
            Trade
          </Button>
        </div>
      </td>
    </tr>
  );
};
