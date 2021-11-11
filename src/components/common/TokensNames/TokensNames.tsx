import React, { useContext } from 'react';
import { TokensLogos, TokensLogosProps } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './TokensNames.module.sass';

export type TokensNamesProps = {
  name: string
  className?: string
} & TokensLogosProps;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TokensNames: React.FC<TokensNamesProps> = ({
  firstTokenIcon,
  firstTokenSymbol,
  secondTokenIcon,
  secondTokenSymbol,
  name,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div
      className={cx(s.root, modeClass[colorThemeMode], className)}
    >
      <TokensLogos
        firstTokenIcon={firstTokenIcon}
        firstTokenSymbol={firstTokenSymbol}
        secondTokenIcon={secondTokenIcon}
        secondTokenSymbol={secondTokenSymbol}
      />

      <div className={s.name}>
        {name ?? 'Unnamed'}
      </div>
    </div>
  );
};
