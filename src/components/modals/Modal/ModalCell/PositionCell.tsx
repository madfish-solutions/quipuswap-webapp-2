import React, { useContext } from 'react';

import cx from 'classnames';

import { TokensLogos } from '@components/common/TokensLogos';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './ModalCell.module.sass';

interface PositionCellProps {
  firstTokenIcon: string;
  firstTokenSymbol: string;
  secondTokenIcon: string;
  secondTokenSymbol: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const PositionCell: React.FC<PositionCellProps> = ({
  firstTokenIcon,
  firstTokenSymbol,
  secondTokenIcon,
  secondTokenSymbol
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], s.listItem)}>
      <div className={s.positionBlockCell}>
        <TokensLogos
          firstTokenIcon={firstTokenIcon}
          firstTokenSymbol={firstTokenSymbol}
          secondTokenIcon={secondTokenIcon}
          secondTokenSymbol={secondTokenSymbol}
        />
        <div className={s.mleft8}>
          <h6>
            {firstTokenSymbol}/{secondTokenSymbol}
          </h6>
        </div>
      </div>
    </div>
  );
};
