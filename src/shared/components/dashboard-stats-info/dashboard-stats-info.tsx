import { FC, ReactElement, useContext } from 'react';

import cx from 'classnames';

import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';

import { Card } from '../card';
import styles from './dashboard-stats-info.module.scss';

interface Props {
  cards: ReactElement[];
  mobileRight?: number[];
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const DashboardStatsInfo: FC<Props> = ({ cards, mobileRight }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  // const contentClassName = !mobileRight ? styles.rootMobile : styles.root;/

  return (
    <Card
      header={{
        content: 'Game Info'
      }}
      contentClassName={styles.root}
    >
      {cards.map((card: ReactElement) => (
        <div className={cx(styles.card, { [styles.right]: false }, modeClass[colorThemeMode])}>{card}</div>
      ))}
    </Card>
  );
};
