import React, { useContext } from 'react';

import { Switcher } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { QuipuToken } from '@components/svg/quipu-token';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './ModalCell.module.sass';

interface ChooseListCellProps {
  // eslint-disable-next-line
  tokenList?: any;
  isActive: boolean;
  onChange: (state: boolean) => void;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const ChooseListCell: React.FC<ChooseListCellProps> = ({ tokenList, isActive, onChange }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], s.listItem, s.splitRow)}>
      <div className={s.joinRow}>
        <QuipuToken />
        <div className={s.mleft8}>
          <h6>{tokenList?.name}</h6>
          <span className={s.caption}>{tokenList?.label}</span>
        </div>
      </div>

      <Switcher isActive={isActive} onChange={onChange} />
    </div>
  );
};
