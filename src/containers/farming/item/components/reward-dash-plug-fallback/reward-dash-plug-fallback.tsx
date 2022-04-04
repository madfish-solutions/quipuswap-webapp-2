import { FC } from 'react';

import cx from 'classnames';

import { DashPlugFallback, DashPlugFallbackProps } from '../dash-plug-fallback';
import styles from './reward-dash-plug-fallback.module.sass';

export const RewardDashPlugFallback: FC<DashPlugFallbackProps> = ({ className, ...restProps }) => (
  <DashPlugFallback className={cx(className, styles.dash)} {...restProps} />
);
