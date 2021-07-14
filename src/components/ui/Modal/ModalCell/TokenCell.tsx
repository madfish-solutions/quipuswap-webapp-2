import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Bage } from '@components/ui/Bage';
import Token from '@icons/Token.svg';

import s from './ModalCell.module.sass';

type TokenCellProps = {
  token?: any,
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
        <Token />
        <div className={s.mleft8}>
          <div className={s.joinRow}>
            <h6>
              {token?.name}
            </h6>
            {token?.badges.map((x:any) => (
              <Bage
                className={s.bage}
                key={x}
                text={x}
              />
            )) }

          </div>
          <span className={s.caption}>
            {token?.label}
          </span>
        </div>

      </div>
      <h6>{token?.price}</h6>
    </div>
  );
};
