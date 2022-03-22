import { FC } from 'react';

import cx from 'classnames';

import { ActiveStatus } from '@interfaces/active-statuts-enum';
import { Undefined } from '@utils/types';

import styles from './farming-alert.module.scss';

const variants = {
  [ActiveStatus.PENDING]: styles.pending,
  [ActiveStatus.DISABLED]: styles.disabled
};
interface Props {
  variant: ActiveStatus;
  errorMessage: Undefined<string>;
  className?: string;
}
export const StakingAlert: FC<Props> = ({ variant, errorMessage, className }) => {
  if (!errorMessage || variant === ActiveStatus.ACTIVE) {
    return null;
  }

  return <div className={cx(styles.root, className, variants[variant])}>{errorMessage}</div>;
};
