import React, { useContext } from 'react';
import cx from 'classnames';
import { WhitelistedFarm } from '@utils/types';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';
import { Bage } from '@components/ui/Bage';

import s from './PoolCardTable.module.sass';

type PoolCardItemProps = {
  farm: WhitelistedFarm
  isSponsored?: boolean
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const PoolCardItem: React.FC<PoolCardItemProps> = ({
  farm,
  isSponsored,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  return (
    <div className={cx(modeClass[colorThemeMode], s.card)}>
      <div className={cx(s.cardCellItem, s.tokenLogoBlock)}>
        <div className={s.links}>
          <TokensLogos
            token1={farm.tokenPair.token1}
            token2={farm.tokenPair.token2}
            className={s.tokenLogo}
          />
          {getWhitelistedTokenSymbol(farm.tokenPair.token1)}
          /
          {getWhitelistedTokenSymbol(farm.tokenPair.token2)}
        </div>
        {isSponsored && (<Bage text="Sponsored" />)}
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>Total staked</div>
        <div className={cx(s.bold, s.cardCellText)}>
          $
          <CurrencyAmount amount="888888888888888.00" className={s.cardAmount} />
        </div>
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>APR</div>
        <CurrencyAmount amount="888888888888888.00" currency="%" />
      </div>
      <div className={cx(s.links, s.cardCellItem, s.buttons)}>
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
    </div>
  );
};
