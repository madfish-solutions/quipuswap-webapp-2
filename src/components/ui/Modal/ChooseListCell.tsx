import React, { useContext } from 'react';
import Token from '@icons/Token.svg';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import cx from 'classnames';

import s from './Modal.module.sass';
import { Switcher } from '../Switcher';

type ChooseListCellProps = {
  token?: any,
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ChooseListCell: React.FC<ChooseListCellProps> = ({
  token,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  return (
    <div className={cx(modeClass[colorThemeMode], s.listItem)}>
      <div
        className={s.splitRow}
      >
        <div className={s.joinRow}>
          <Token />
          <div className={s.mleft8}>
            <h6>
              {token?.name}
            </h6>
            <span className={s.caption}>
              {token?.label}
            </span>
          </div>

        </div>
        <Switcher
          isActive
          onChange={() => {}}
        />
      </div>
    </div>
  );
};
