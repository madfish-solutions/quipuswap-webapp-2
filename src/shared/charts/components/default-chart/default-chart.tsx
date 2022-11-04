import { DownOfDefaultChart, UpOfDefaultChart } from '@shared/svg';

import styles from './default-chart.module.scss';

const DEFAULT_TEXT = 'Oops... Imagine a beautiful chart with pool reserves while we handle the issue.';

export const DefaultChart = () => {
  return (
    <div className={styles.root}>
      <UpOfDefaultChart className={styles.upDefaultOfChart} />
      <span className={styles.text}>{DEFAULT_TEXT}</span>
      <DownOfDefaultChart className={styles.bottomDefaultOfChart} />
    </div>
  );
};
