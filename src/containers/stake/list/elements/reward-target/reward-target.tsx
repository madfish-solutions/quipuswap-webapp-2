import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { TokenLogo } from '@components/common/TokenLogo';
import { ArrowDown } from '@components/svg/ArrowDown';
import { getTokenSymbol } from '@utils/helpers';
import { Token } from '@utils/types';

import styles from './reward-target.module.scss';

interface RewardTargetProps {
  token: Token;
}

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

const EARN = 'Earn';

export const RewardTarget: FC<RewardTargetProps> = ({ token }) => {
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
