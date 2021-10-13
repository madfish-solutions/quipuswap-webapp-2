import React, { useContext } from 'react';
import cx from 'classnames';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { TEZOS_TOKEN } from '@utils/defaults';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Button } from '@components/ui/Button';
import { CurrencyAmount } from '@components/common/CurrencyAmount';

import s from '../Card.module.sass';

type TokenCardItemProps = {
  token: WhitelistedToken
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TokenCardItem: React.FC<TokenCardItemProps> = ({
  token,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  return (
    <div className={cx(modeClass[colorThemeMode], s.card)}>
      <div className={cx(s.cardCellItem, s.cardCellText, s.tokenLogoBlock)}>
        <div className={s.links}>
          <TokensLogos token1={token} className={s.tokenLogo} />
          {getWhitelistedTokenSymbol(token)}
        </div>
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>Your Balance</div>
        <CurrencyAmount amount="888888888888888.00" />
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>Price</div>
        <div className={cx(s.bold, s.cardCellText)}>
          $
          <CurrencyAmount amount="888888.00" className={s.cardAmount} />
        </div>
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>Total Value</div>
        <div className={cx(s.bold, s.cardCellText)}>
          $
          <CurrencyAmount amount="888888888888888.00" className={s.cardAmount} />
        </div>
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
};
