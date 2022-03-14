import { FC } from 'react';

import cx from 'classnames';

import { StakingStatus } from '@interfaces/staking.interfaces';

import styles from './staking-alert.module.scss';
import { useStakingAlertViewModel } from './staking-alert.vm';

const variants = {
  [StakingStatus.PENDING]: styles.pending,
  [StakingStatus.DISABLED]: styles.disabled
};
interface Props {
  variant: StakingStatus;
  className?: string;
}
export const StakingAlert: FC<Props> = ({ variant, className }) => {
  const { stakeStatusTranslation } = useStakingAlertViewModel();

  if (variant === StakingStatus.ACTIVE) {
    return null;
  }

  return <div className={cx(styles.root, className, variants[variant])}>{stakeStatusTranslation[variant]}</div>;
};
