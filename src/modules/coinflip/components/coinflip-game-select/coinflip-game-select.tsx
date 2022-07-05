import { FC } from 'react';

import { Button } from '@shared/components';

import { CoinSelectedIcon } from '../coin-selected-icon';
import styles from './coinflip-game-select.module.scss';
import { CoinflipGameSelectProps } from './coinflip-game-select.props';
import { useCoinflipGameSelectViewModel } from './use-coinflip-game-select.vm';

export const CoinflipGameSelect: FC<CoinflipGameSelectProps> = props => {
  const { error, iSelectedSideA, iSelectedSideB, handleSelectSideA, handleSelectSideB, CoinSideAIcon, CoinSideBIcon } =
    useCoinflipGameSelectViewModel(props);

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        <Button onClick={handleSelectSideA} theme="clean" className={styles.button}>
          {iSelectedSideA && <CoinSelectedIcon className={styles.selected} />}
          <CoinSideAIcon className={styles.icon} />
        </Button>

        <Button onClick={handleSelectSideB} theme="clean" className={styles.button}>
          {iSelectedSideB && <CoinSelectedIcon className={styles.selected} />}
          <CoinSideBIcon className={styles.icon} />
        </Button>
      </div>
      {error ? <div className={styles.error}>{error}</div> : null}
    </div>
  );
};
