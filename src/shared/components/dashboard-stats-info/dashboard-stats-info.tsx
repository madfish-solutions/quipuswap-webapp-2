import { FC, ReactElement, useContext } from 'react';

import cx from 'classnames';

import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';

import { Card } from '../card';
import styles from './dashboard-stats-info.module.scss';
import { UseDashboardStatsInfoViewModel } from './use-dashboard-stats-info.vm';

const ZERO = 0;
const TWO = 2;

interface Props {
  header?: string;
  cards: ReactElement[];
  countOfRightElements?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const DashboardStatsInfo: FC<Props> = ({ cards, countOfRightElements = ZERO, header }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { isRightElement, isFlexEndRightElement, computedClassName } = UseDashboardStatsInfoViewModel();

  const contentClassName = countOfRightElements ? styles.rootWithRightColumn : styles.root;
  const cardClassName = cx(styles.card, modeClass[colorThemeMode]);

  const elementsFlexBasis50 = Number(countOfRightElements) * TWO;

  return (
    <Card
      header={{
        content: header
      }}
      contentClassName={contentClassName}
      className={styles.rootCard}
    >
      {cards.map((card: ReactElement, index: number) => (
        <div
          className={cx(
            cardClassName,
            computedClassName(
              isRightElement(index, elementsFlexBasis50),
              isFlexEndRightElement(index, elementsFlexBasis50)
            )
          )}
        >
          {card}
        </div>
      ))}
    </Card>
  );
};
