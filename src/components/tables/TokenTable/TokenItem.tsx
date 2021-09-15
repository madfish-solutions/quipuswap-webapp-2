import React, { useContext } from 'react';
import cx from 'classnames';
import { WhitelistedToken } from '@utils/types';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TEZOS_TOKEN } from '@utils/defaults';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';

import s from '../Table.module.sass';

type TokenItemProps = {
  token: WhitelistedToken
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TokenItem: React.FC<TokenItemProps> = ({
  token,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  return (
    <tr>
      <td className={cx(s.tableRow, s.poolRow, s.tableHeader, modeClass[colorThemeMode])}>
        <div className={cx(s.links, s.cardCellItem, s.maxWidth, s.wideItem, s.cardCellText)}>
          <TokensLogos token1={token} className={s.tokenLogo} />
          {getWhitelistedTokenSymbol(token)}
        </div>
        <div className={s.cardCellItem}>
          $
          <CurrencyAmount className={s.cardAmount} amount="888888888888888.00" />
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
};
