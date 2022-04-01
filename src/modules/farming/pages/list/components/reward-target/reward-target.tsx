import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { TokenLogo } from '@shared/components';
import { getTokenSymbol } from '@shared/helpers';
import { ArrowDown } from '@shared/svg';
import { Token } from '@shared/types';

import styles from './reward-target.module.scss';

interface Props {
  token: Token;
}

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

const EARN = 'Earn';

export const RewardTarget: FC<Props> = ({ token }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const tokenIcon = token.metadata.thumbnailUri;
  const tokenSymbol = getTokenSymbol(token);

  return (
    <div className={cx(styles.container, themeClass[colorThemeMode])}>
      <ArrowDown className={styles.iconButton} />
      <TokenLogo src={tokenIcon} tokenSymbol={tokenSymbol} />
      <span className={styles.earn}>{EARN}</span>
      <span className={styles.tokenSymbol}>{tokenSymbol}</span>
    </div>
  );
};
