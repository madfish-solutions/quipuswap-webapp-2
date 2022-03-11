import { FC } from 'react';

import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { StakingStatus } from '@interfaces/staking.interfaces';

import styles from './staking-alert.module.scss';

interface Props {
  variant: StakingStatus;
  className?: string;
}

export const StakingAlert: FC<Props> = ({ variant, className }) => {
  const { t } = useTranslation(['stake']);

  return (
    <div
      className={cx(styles.root, className, {
        [styles.pending]: variant === StakingStatus.PENDING,
        [styles.disabled]: variant === StakingStatus.DISABLED
      })}
    >
      {variant === StakingStatus.DISABLED && t('stake|stakeDisabled')}
      {variant === StakingStatus.PENDING && t('stake|stakePending')}
    </div>
  );
};
