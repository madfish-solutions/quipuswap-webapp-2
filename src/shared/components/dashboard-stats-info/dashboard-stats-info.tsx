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
  const contentClassName = mobileRight ? styles.rootWithRightColumn : styles.root;

  const isRight = (index: number) => mobileRight?.includes(index);

  return (
    <Card
      header={{
        content: 'Game Info'
      }}
      contentClassName={contentClassName}
    >
      {cards.map((card: ReactElement, index: number) => (
        <div className={cx(styles.card, { [styles.rightCard]: isRight(index) }, modeClass[colorThemeMode])}>{card}</div>
      ))}
    </Card>
  );
};
