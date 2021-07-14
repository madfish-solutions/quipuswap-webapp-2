import React, { useContext } from 'react';
import Token from '@icons/Token.svg';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import cx from 'classnames';
import { Bage } from '../Bage';

import s from './Modal.module.sass';

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
    <div className={cx(modeClass[colorThemeMode], s.listItem)}>
      <div className={s.splitRow}>
        <div className={s.joinRow}>
          <Token />
          <div className={s.blockRow}>
            <div className={s.joinRow}>
              <h6>
                {token?.name}
              </h6>
              {token?.badges.map((x:any) => <Bage className={s.bage} key={x} text={x} />) }

            </div>
            <span>
              {token?.label}
            </span>
          </div>

        </div>
        <h6>{token?.price}</h6>
      </div>
    </div>
  );
};
