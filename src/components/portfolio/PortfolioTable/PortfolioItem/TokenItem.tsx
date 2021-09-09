import React from 'react';
import cx from 'classnames';
import { WhitelistedToken } from '@utils/types';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { TEZOS_TOKEN } from '@utils/defaults';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';

import s from '../PortfolioTable.module.sass';

type TokenItemProps = {
  token: WhitelistedToken
};

export const TokenItem: React.FC<TokenItemProps> = ({
  token,
}) => (
  <tr>
    <td className={cx(s.tableRow, s.poolRow, s.tableHeader)}>
      <div className={cx(s.links, s.cardCellItem, s.cardCellText)}>
        <TokensLogos token1={token} className={s.tokenLogo} />
        {getWhitelistedTokenSymbol(token)}
      </div>
      <div className={s.cardCellItem}>
        <CurrencyAmount amount="888888888888888.00" />
      </div>
      <div className={s.cardCellItem}>
        <CurrencyAmount amount="888888888888888.00" currency="$" />
      </div>
      <div className={s.cardCellItem}>
        <CurrencyAmount amount="888888888888888.00" currency="$" />
      </div>
      <div className={cx(s.links, s.cardCellItem)}>
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
    </td>
  </tr>
);
