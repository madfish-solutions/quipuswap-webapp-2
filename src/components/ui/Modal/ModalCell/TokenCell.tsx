import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import { getWhitelistedTokenName, getWhitelistedTokenSymbol } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Bage } from '@components/ui/Bage';

import s from './ModalCell.module.sass';

type TokenCellProps = {
  token: WhitelistedToken,
  onClick?: () => void,
  tabIndex?: number
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TokenCell: React.FC<TokenCellProps> = ({
  token,
  onClick,
  tabIndex,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    modeClass[colorThemeMode],
    s.listItem,
    s.splitRow,
    s.clickable,
    s.hover,
  );

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyUp={(e) => {
        if (e.key === 'Enter' && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={compoundClassName}
    >
      <div className={s.joinRow}>
        <TokensLogos
          token1={token}
        />
        <div className={cx(s.mleft8, s.tokenBody)}>
          <div className={s.joinRow}>
            <h6>
              {getWhitelistedTokenSymbol(token)}
            </h6>
            {token?.type && (token.type.toLowerCase() === 'fa1.2' ? ['FA 1.2'] : ['FA 2.0', `ID: ${token.fa2TokenId}`]).map((x) => (
              <Bage
                className={s.bage}
                key={x}
                text={x}
              />
            ))}
          </div>

          <span className={cx(s.caption)}>
            {getWhitelistedTokenName(token, 100)}
          </span>

        </div>
      </div>
    </div>
  );
};
