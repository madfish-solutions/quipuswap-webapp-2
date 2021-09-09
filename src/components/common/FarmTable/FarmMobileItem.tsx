import React from 'react';
import cx from 'classnames';
import { WhitelistedFarm } from '@utils/types';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';
import { Bage } from '@components/ui/Bage';

import s from './FarmCardTable.module.sass';

type FarmMobileItemProps = {
  farm: WhitelistedFarm
  isSponsored?: boolean
};

export const FarmMobileItem: React.FC<FarmMobileItemProps> = ({
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
      <div>Volume 24h</div>
      <CurrencyAmount amount="888888888888888.00" currency="$" />
    </div>
    <div className={cx(s.textItem, s.cardCellItem)}>
      <div>TVL</div>
      <CurrencyAmount amount="888888888888888.00" currency="$" />
    </div>
    <div className={cx(s.links, s.cardCellItem, s.buttons)}>
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
  </div>
);
