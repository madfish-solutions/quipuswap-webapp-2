import { FC, ReactElement, useContext } from 'react';

import cx from 'classnames';

import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';

import styles from './dashboard-stats-info.module.scss';
import { useDashboardStatsInfoViewModel } from './use-dashboard-stats-info.vm';
import { Card } from '../card';

const ZERO = 0;

interface Props {
  header?: string;
  cards: ReactElement[];
  countOfRightElements?: number;
  contentClassName?: string;
  DTI?: string;
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
  DTI,
  className
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { cardHeader, rootContentClassName, computedClassName } = useDashboardStatsInfoViewModel(
    header,
    cards.length,
    countOfRightElements
  );

  const cardClassName = cx(styles.card, modeClass[colorThemeMode]);

  return (
    <Card
      header={cardHeader}
      contentClassName={cx(rootContentClassName, contentClassName)}
      className={cx(styles.rootCard, className)}
      data-test-id={DTI}
    >
      {cards.map((card, index) => (
        <div className={cx(cardClassName, computedClassName(index))} key={index}>
          {card}
        </div>
      ))}
    </Card>
  );
};
