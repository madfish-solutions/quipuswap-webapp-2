import { FC } from 'react';

import cx from 'classnames';

import { StakingStatus } from '@interfaces/staking.interfaces';
import { Undefined } from '@utils/types';

import styles from './staking-alert.module.scss';

const variants = {
  [StakingStatus.PENDING]: styles.pending,
  [StakingStatus.DISABLED]: styles.disabled
};
interface Props {
  variant: StakingStatus;
  errorMessage: Undefined<string>;
  className?: string;
}
export const StakingAlert: FC<Props> = ({ variant, errorMessage, className }) => {
  if (!errorMessage || variant === StakingStatus.ACTIVE) {
    return null;
  }

  return <div className={cx(styles.root, className, variants[variant])}>{errorMessage}</div>;
};
