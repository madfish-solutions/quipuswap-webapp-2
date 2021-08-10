import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokensLogos } from '@components/ui/TokensLogos';
import { WhitelistedTokenPair } from '@utils/types';

import s from './ModalCell.module.sass';

type PositionCellProps = {
  tokenPair: WhitelistedTokenPair
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const PositionCell: React.FC<PositionCellProps> = ({
  tokenPair,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { token1, token2 } = tokenPair;
  const { name: name1 } = token1.metadata;
  const { name: name2 } = token2.metadata;

  return (
    <div className={cx(modeClass[colorThemeMode], s.listItem)}>
      <div className={s.positionBlockCell}>
        <TokensLogos
          token1={token1}
          token2={token2}
        />
        <div className={s.mleft8}>
          <h6>
            {name1}
            /
            {name2}
          </h6>

        </div>
      </div>
    </div>
  );
};
