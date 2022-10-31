import { YUPANA_URL } from '@config/config';
import Yupana from '@images/yupana.png';
import { YupanaLogo } from '@shared/svg';

import styles from './advertising.module.scss';
import { useAdvertisingViewModel } from './use-advertising.vm';

export const Advertising = () => {
  const { handleLogEvent } = useAdvertisingViewModel();

  return (
    <a
      href={YUPANA_URL}
      target="_blank"
      className={styles.container}
      style={{ background: `url(${Yupana})` }}
      rel="noreferrer"
      onClick={handleLogEvent}
    >
      <div className={styles.yupanaLogoContainer}>
        <YupanaLogo className={styles.yupanaLogo} />
      </div>
      <div className={styles.text}>
        <div className={styles.launched}>Already launched!</div>
        <div className={styles.income}>Borrow, Lend, Earn now!</div>
      </div>
    </a>
  );
};
