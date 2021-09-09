import React from 'react';
import cx from 'classnames';
import { WhitelistedTokenPair } from '@utils/types';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';

import s from '../PortfolioCardTable.module.sass';

type PoolMobileItemProps = {
  pair: WhitelistedTokenPair
};

export const PoolMobileItem: React.FC<PoolMobileItemProps> = ({
  pair,
}) => (
  <div className={s.card}>
    <div className={cx(s.cardCellItem, s.cardCellText, s.tokenLogoBlock)}>
      <div className={s.links}>
        <TokensLogos token1={pair.token1} token2={pair.token2} className={s.tokenLogo} />
        {getWhitelistedTokenSymbol(pair.token1)}
        /
        {getWhitelistedTokenSymbol(pair.token2)}
      </div>
    </div>
    <div className={cx(s.textItem, s.cardCellItem)}>
      <div>Your Share</div>
      <CurrencyAmount amount="888888888888888.00" currency="%" />
    </div>
    <div className={cx(s.textItem, s.cardCellItem)}>
      <div>Your LP Balance</div>
      <CurrencyAmount amount="888888888888888.00" currency="$" />
    </div>
    <div className={cx(s.textItem, s.cardCellItem)}>
      <div>Your Liquidity</div>
      <CurrencyAmount amount="888888888888888.00" currency="$" />
    </div>
    <div className={cx(s.links, s.cardCellItem, s.buttons)}>
      <Button
        href={`/liquidity/remove/${getWhitelistedTokenSymbol(pair.token1)}-${getWhitelistedTokenSymbol(pair.token2)}`}
        theme="secondary"
        className={s.button}
      >
        Remove
      </Button>
      <Button
        href={`/liquidity/add/${getWhitelistedTokenSymbol(pair.token1)}-${getWhitelistedTokenSymbol(pair.token2)}`}
        className={s.button}
      >
        Add
      </Button>
    </div>
  </div>
);
