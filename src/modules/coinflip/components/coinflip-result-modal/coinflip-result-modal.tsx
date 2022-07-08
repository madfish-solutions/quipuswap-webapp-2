import { FC } from 'react';

import cx from 'classnames';

import CoinflipLostImage from '@images/coinflip-lost-modal-image.png';
import { Button, Card } from '@shared/components';

import styles from './coinflip-result-modal.module.scss';

interface Props {
  className?: string;
}

export const CoinflipResultModal: FC<Props> = ({ className }) => {
  return (
    <Card header={{ content: <>You lost.</>, className: styles.cardHeader }} className={cx(className, styles.root)}>
      <img className={styles.img} src={CoinflipLostImage} alt="Coinflip lost result" />
      <div className={styles.bottomContent}>
        <span>You lost.</span>
        <h4>Try your luck one more time!</h4>
        <Button className={styles.button}>Ok</Button>
      </div>
    </Card>
  );
};
