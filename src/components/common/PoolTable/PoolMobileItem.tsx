import React from 'react';
import cx from 'classnames';
import { WhitelistedFarm } from '@utils/types';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';
import { Bage } from '@components/ui/Bage';

import s from './PoolCardTable.module.sass';

type PoolMobileItemProps = {
  farm: WhitelistedFarm
  isSponsored?: boolean
};

export const PoolMobileItem: React.FC<PoolMobileItemProps> = ({
  farm,
  isSponsored,
}) => (
  <div className={s.card}>
    <div className={cx(s.cardCellItem, s.cardCellText, s.tokenLogoBlock)}>
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
      <div>Total staked</div>
      <CurrencyAmount amount="888888888888888.00" currency="$" />
    </div>
    <div className={cx(s.textItem, s.cardCellItem)}>
      <div>APR</div>
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
