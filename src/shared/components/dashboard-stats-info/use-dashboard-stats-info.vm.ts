import cx from 'classnames';

import { isEven } from '@shared/helpers/is-even';

import styles from './dashboard-stats-info.module.scss';

export const useDashboardStatsInfoViewModel = () => {
  const isRightElement = (index: number, elementsCount: number): boolean => {
    return index < elementsCount;
  };

  const isFlexEndRightElement = (index: number, elementsCount: number): boolean => {
    return !isEven(index) && isRightElement(index, elementsCount);
  };

  const computedClassName = (rightCardValue: boolean, flexEndValue: boolean) => {
    return cx({ [styles.rightCard]: rightCardValue, [styles.flexEndRightElement]: flexEndValue });
  };

  return { isRightElement, isFlexEndRightElement, computedClassName };
};
