import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Bage } from '@components/ui/Bage';

import s from './ModalCell.module.sass';

type TokenCellProps = {
  contractAddress: string
  icon?: string
  name?: string
  symbol?: string
  badges: string[]
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TokenCell: React.FC<TokenCellProps> = ({
  contractAddress,
  icon,
  name,
  symbol,
  badges,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], s.listItem, s.splitRow)}>
      <div className={s.joinRow}>
        <TokensLogos
          token1={{
            icon,
            name: name ?? symbol ?? contractAddress,
          }}
        />
        <div className={s.mleft8}>
          <div className={s.joinRow}>
            <h6>
              {symbol ?? name ?? 'Unnamed'}
            </h6>
            {badges.map((x) => (
              <Bage
                className={s.bage}
                key={x}
                text={x}
              />
            )) }
          </div>
          <span className={s.caption}>
            {name ?? symbol ?? contractAddress}
          </span>
        </div>
      </div>
    </div>
  );
};
