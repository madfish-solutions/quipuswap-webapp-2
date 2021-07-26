import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import { WhitelistedToken } from '@utils/types';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Bage } from '@components/ui/Bage';

import s from './ModalCell.module.sass';

// type TokenCellProps = {
//   contractAddress: string
//   icon?: string
//   name?: string
//   symbol?: string
//   badges: string[]
// };

type TokenCellProps = {
  token: WhitelistedToken
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TokenCell: React.FC<TokenCellProps> = ({
  token,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], s.listItem, s.splitRow)}>
      <div className={s.joinRow}>
        <TokensLogos
          token1={token}
        />
        <div className={s.mleft8}>
          <div className={s.joinRow}>
            <h6>
              {token.metadata?.symbol ?? token.metadata?.name ?? 'Unnamed'}
            </h6>
            {(token.type.toLowerCase() === 'fa1.2' ? ['FA 1.2'] : ['FA 2.0', `ID: ${token.fa2TokenId}`]).map((x) => (
              <Bage
                className={s.bage}
                key={x}
                text={x}
              />
            )) }
          </div>
          <span className={s.caption}>
            {token.metadata?.name ?? token.metadata?.symbol ?? token.contractAddress}
          </span>
        </div>
      </div>
    </div>
  );
};
