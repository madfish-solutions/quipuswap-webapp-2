import cx from 'classnames';

import { isEqual } from '@shared/helpers';

import styles from './buttons-selector.module.scss';

export const useButtonsSelectorViewModel = () => {
  const computedClassName = (id: number | string, idActive: number | string) => {
    return cx({ [styles.activeButton]: isEqual(id, idActive), [styles.notActiveButton]: !isEqual(id, idActive) });
  };

  return { computedClassName };
};
