import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { TokensLogos } from '@shared/components';
import { getTokenName, getTokenSymbol, prepareTokenLogo } from '@shared/helpers';
import { Token } from '@shared/types';

import styles from './token-info.module.scss';

interface Props {
  token: Token;
  className?: string;
}
const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const TokenInfo: FC<Props> = ({ token, className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(modeClass[colorThemeMode], styles.tokenInfo, className);

  const tokenIcon = prepareTokenLogo(token.metadata.thumbnailUri);
  const tokenSymbol = getTokenSymbol(token);
  const tokenName = getTokenName(token, 50);

  return (
    <div className={compoundClassName}>
      <TokensLogos firstTokenIcon={tokenIcon} firstTokenSymbol={tokenSymbol} />
      <div>
        <h6>{tokenSymbol}</h6>
        <span>{tokenName}</span>
      </div>
    </div>
  );
};
