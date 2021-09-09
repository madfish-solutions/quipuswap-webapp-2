import React from 'react';
import cx from 'classnames';
import { WhitelistedTokenPair } from '@utils/types';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';

import s from '../PortfolioTable.module.sass';

type PoolItemProps = {
  pair: WhitelistedTokenPair
};

export const PoolItem: React.FC<PoolItemProps> = ({
  pair,
}) => (
  <tr>
    <td className={cx(s.tableRow, s.poolRow, s.tableHeader)}>
      <div className={cx(s.links, s.cardCellItem, s.cardCellText)}>
        <TokensLogos token1={pair.token1} token2={pair.token2} className={s.tokenLogo} />
        {getWhitelistedTokenSymbol(pair.token1)}
        /
        {getWhitelistedTokenSymbol(pair.token2)}
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
    </td>
  </tr>
);
