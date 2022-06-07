import { FC, ReactElement, useContext } from 'react';

import cx from 'classnames';

import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';

import { Card } from '../card';
import styles from './dashboard-stats-info.module.scss';
import { useDashboardStatsInfoViewModel } from './use-dashboard-stats-info.vm';

const ZERO = 0;
const TWO = 2;

interface Props {
  header?: string;
  cards: ReactElement[];
  countOfRightElements?: number;
  contentClassName?: string;
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const DashboardStatsInfo: FC<Props> = ({
  cards,
  countOfRightElements = ZERO,
  header,
  contentClassName,
  className
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { isRightElement, isFlexEndRightElement, computedClassName } = useDashboardStatsInfoViewModel();

  const rootContentClassName = countOfRightElements ? styles.rootWithRightColumn : styles.root;
  const cardClassName = cx(styles.card, modeClass[colorThemeMode]);

  const elementsFlexBasis50 = countOfRightElements * TWO;

  return (
    <Card
      header={
        header
          ? {
              content: header
            }
          : undefined
      }
      contentClassName={cx(rootContentClassName, contentClassName)}
      className={cx(styles.rootCard, className)}
    >
      {cards.map((card: ReactElement, index: number) => (
        <div
          key={index}
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
