import React from 'react';
import cx from 'classnames';
import { WhitelistedToken } from '@utils/types';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { TEZOS_TOKEN } from '@utils/defaults';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';

import s from '../PortfolioCardTable.module.sass';

type TokenMobileItemProps = {
  token: WhitelistedToken
};

export const TokenMobileItem: React.FC<TokenMobileItemProps> = ({
  token,
}) => (
  <div className={s.card}>
    <div className={cx(s.cardCellItem, s.cardCellText, s.tokenLogoBlock)}>
      <div className={s.links}>
        <TokensLogos token1={token} className={s.tokenLogo} />
        {getWhitelistedTokenSymbol(token)}
      </div>
    </div>
    <div className={cx(s.textItem, s.cardCellItem)}>
      <div>Your Balance</div>
      <CurrencyAmount amount="888888888888888.00" />
    </div>
    <div className={cx(s.textItem, s.cardCellItem)}>
      <div>Price</div>
      <CurrencyAmount amount="888888888888888.00" currency="$" />
    </div>
    <div className={cx(s.textItem, s.cardCellItem)}>
      <div>Total Value</div>
      <CurrencyAmount amount="888888888888888.00" currency="$" />
    </div>
    <div className={cx(s.links, s.cardCellItem, s.buttons)}>
      <Button
        href={`https://analytics.quipuswap.com/tokens/${token.contractAddress === TEZOS_TOKEN.contractAddress
          ? TEZOS_TOKEN.contractAddress
          : `${token.contractAddress}_${token.fa2TokenId ?? 0}`}`}
        external
        theme="secondary"
        className={s.button}
      >
        Analytics
      </Button>
      <Button
        href={`/swap/${TEZOS_TOKEN.contractAddress}-${getWhitelistedTokenSymbol(token)}`}
        className={s.button}
      >
        Trade
      </Button>
    </div>
  </div>
);
