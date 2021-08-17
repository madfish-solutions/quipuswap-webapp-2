import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokensLogos } from '@components/ui/TokensLogos';
import { WhitelistedTokenPair } from '@utils/types';
import { getWhitelistedTokenName } from '@utils/helpers';

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
  const compoundClassName = cx(
    modeClass[colorThemeMode],
    s.listItem,
    s.clickable,
    s.hover,
  );
  const { token1, token2 } = tokenPair;

  return (
    <div className={compoundClassName}>
      <div className={s.positionBlockCell}>
        <TokensLogos
          token1={token1}
          token2={token2}
        />
        <div className={s.mleft8}>
          <h6>
            {getWhitelistedTokenName(token1)}
            /
            {getWhitelistedTokenName(token2)}
          </h6>

        </div>
      </div>
    </div>
  );
};
