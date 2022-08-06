import { FC } from 'react';

import { Button } from '@shared/components';

import styles from './coinflip-game-select.module.scss';
import { CoinflipGameSelectProps } from './coinflip-game-select.props';
import { useCoinflipGameSelectViewModel } from './use-coinflip-game-select.vm';

export const CoinflipGameSelect: FC<CoinflipGameSelectProps> = props => {
  const { error, handleSelectSideA, handleSelectSideB, FaceIcon, BackIcon } = useCoinflipGameSelectViewModel(props);

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        <Button onClick={handleSelectSideA} theme="clean" className={styles.button}>
          <FaceIcon />
        </Button>

        <Button onClick={handleSelectSideB} theme="clean" className={styles.button}>
          <BackIcon />
        </Button>
      </div>
      {error ? <div className={styles.error}>{error}</div> : null}
    </div>
  );
};
