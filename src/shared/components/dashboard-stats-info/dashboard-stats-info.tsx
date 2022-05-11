import { FC, ReactElement, useContext } from 'react';

import cx from 'classnames';

import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';

import { Card } from '../card';
import styles from './dashboard-stats-info.module.scss';

const ZERO = 0;
const TWO = 2;

interface Props {
  cards: ReactElement[];
  countOfRightElements?: number;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const DashboardStatsInfo: FC<Props> = ({ cards, countOfRightElements = ZERO }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const contentClassName = countOfRightElements ? styles.rootWithRightColumn : styles.root;

  return (
    <Card
      header={{
        content: 'Game Info'
      }}
      contentClassName={contentClassName}
      className={styles.rootCard}
    >
      {cards.map((card: ReactElement, index: number) => (
        <div
          className={cx(
            styles.card,
            {
              [styles.rightCard]: index < countOfRightElements * TWO,
              [styles.flexEndRightElement]: index % TWO !== ZERO && index < countOfRightElements * TWO
            },
            modeClass[colorThemeMode]
          )}
        >
          {card}
        </div>
      ))}
    </Card>
  );
};
