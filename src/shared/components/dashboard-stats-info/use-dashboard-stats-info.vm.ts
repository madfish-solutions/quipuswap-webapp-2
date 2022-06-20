import cx from 'classnames';

import { isEven } from '@shared/helpers/is-even';
import { Undefined } from '@shared/types';

import styles from './dashboard-stats-info.module.scss';

const TWO = 2;

export const useDashboardStatsInfoViewModel = (
  header: Undefined<string>,
  cardsCount: number,
  countOfRightElements: number
) => {
  const isRightElement = (index: number, elementsCount: number): boolean => {
    return index < elementsCount;
  };

  const isFlexEndRightElement = (index: number, elementsCount: number): boolean => {
    return !isEven(index) && isRightElement(index, elementsCount);
  };

  const elementsFlexBasis50 = countOfRightElements * TWO;
  const computedClassName = (index: number) => {
    const rightCardValue = isRightElement(index, elementsFlexBasis50);
    const flexEndValue = isFlexEndRightElement(index, elementsFlexBasis50);

    if (cardsCount >= TWO) {
      return cx({
        [styles.leftCard]: rightCardValue && !flexEndValue,
        [styles.rightCard]: rightCardValue && flexEndValue,
        [styles.flexEndRightElement]: flexEndValue
      });
    }

    return styles.singleCard;
  };

  return {
    cardHeader: header ? { content: header } : undefined,
    rootContentClassName: countOfRightElements ? styles.rootWithRightColumn : styles.root,
    computedClassName
  };
};
