import React, { useContext } from 'react';
import {
  TokensLogosProps,
  TokensLogos,
  ColorModes,
  ColorThemeContext,
} from '@madfish-solutions/quipu-ui-kit';
import cx from 'classnames';

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
