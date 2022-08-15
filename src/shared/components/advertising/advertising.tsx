import Yupana from '@images/yupana.png';
import { YupanaLogo } from '@shared/svg';

import styles from './advertising.module.scss';

// eslint-disable-next-line no-console
console.log(Yupana);
export const Advertising = () => {
  return (
    <div className={styles.container} style={{ background: `url(${Yupana})` }}>
      <div className={styles.yupanaLogoContainer}>
        <YupanaLogo className={styles.yupanaLogo} />
      </div>
      <div className={styles.text}>
        <div className={styles.launched}>Already launched!</div>
        <div className={styles.income}>Get passive income now!</div>
      </div>
    </div>
  );
};
