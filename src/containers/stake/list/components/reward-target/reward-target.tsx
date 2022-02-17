import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { TokenLogo } from '@components/common/TokenLogo';
import { ArrowDown } from '@components/svg/ArrowDown';
import { RawToken } from '@interfaces/types';
import { getTokenSymbol } from '@utils/helpers';

import styles from './reward-target.module.scss';

interface Props {
  token: RawToken;
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
