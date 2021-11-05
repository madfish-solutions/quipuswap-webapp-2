import React, { useContext } from 'react';
import { WhitelistedFarm } from '@utils/types';
import {
  Bage,
  Button,
  ColorModes,
  TokensLogos,
  CurrencyAmount,
  ColorThemeContext,
} from '@madfish-solutions/quipu-ui-kit';
import cx from 'classnames';

import { getWhitelistedTokenSymbol } from '@utils/helpers';

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
  const compoundClassName = cx(
    s.tableRow,
    s.farmRow,
    s.tableHeader,
    modeClass[colorThemeMode],
    s.tableHeaderBorder,
  );
  return (
    <tr>
      <td className={compoundClassName}>
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
          <CurrencyAmount className={s.cardAmount} amount="888888888888888.00" currency="%" />
        </div>
        <div className={cx(s.links, s.cardCellItem)}>
          <Button
            theme="secondary"
            className={s.button}
            href="#"
          >
            Get LP
          </Button>
          <Button
            href="/swap"
            className={s.button}
          >
            Farm
          </Button>
        </div>
      </td>
    </tr>
  );
};
