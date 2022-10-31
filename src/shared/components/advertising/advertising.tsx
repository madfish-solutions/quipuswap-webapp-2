import { YUPANA_URL } from '@config/config';
import Yupana from '@images/yupana.png';
import { useAmplitudeService } from '@shared/hooks';
import { YupanaLogo } from '@shared/svg';

import styles from './advertising.module.scss';

export const Advertising = () => {
  const { log } = useAmplitudeService();

  return (
    <a
      href={YUPANA_URL}
      target="_blank"
      className={styles.container}
      style={{ background: `url(${Yupana})` }}
      rel="noreferrer"
      onClick={() => log('CLICK_YUPANA_BANNER')}
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
