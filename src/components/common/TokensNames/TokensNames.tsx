import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokensLogosInterface, TokensLogos } from '@components/ui/TokensLogos';

import s from './TokensNames.module.sass';

export type TokensNamesProps = {
  name: string
  className?: string
} & TokensLogosInterface;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TokensNames: React.FC<TokensNamesProps> = ({
  token1,
  token2,
  name,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div
      className={cx(s.root, modeClass[colorThemeMode], className)}
    >
      <TokensLogos
        token1={token1}
        token2={token2}
      />

      <div className={s.name}>
        {name ?? 'Unnamed'}
      </div>
    </div>
  );
};
