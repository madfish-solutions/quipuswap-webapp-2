import { FC } from 'react';

import cx from 'classnames';

import styles from './reward-dash-plug-fallback.module.scss';
import { DashPlugFallback, DashPlugFallbackProps } from '../dash-plug-fallback';

export const RewardDashPlugFallback: FC<DashPlugFallbackProps> = ({ className, ...restProps }) => (
  <DashPlugFallback className={cx(className, styles.dash)} {...restProps} />
);
