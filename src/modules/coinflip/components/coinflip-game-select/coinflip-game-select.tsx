import { FC } from 'react';

import { Button } from '@shared/components';
import { CoinSelectedIcon } from '@shared/svg';

import styles from './coinflip-game-select.module.scss';
import { CoinflipGameSelectProps } from './coinflip-game-select.props';
import { useCoinflipGameSelectViewModel } from './use-coinflip-game-select.vm';

const COIN_SIZE = 88;

export const CoinflipGameSelect: FC<CoinflipGameSelectProps> = props => {
  const { error, iSelectedSideA, iSelectedSideB, handleSelectSideA, handleSelectSideB, CoinSideAIcon, CoinSideBIcon } =
    useCoinflipGameSelectViewModel(props);

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        <Button onClick={handleSelectSideA} theme="clean" className={styles.button}>
          {iSelectedSideA && <CoinSelectedIcon size={COIN_SIZE} className={styles.selected} />}
          <CoinSideAIcon size={COIN_SIZE} className={styles.icon} />
        </Button>

        <Button onClick={handleSelectSideB} theme="clean" className={styles.button}>
          {iSelectedSideB && <CoinSelectedIcon size={COIN_SIZE} className={styles.selected} />}
          <CoinSideBIcon size={COIN_SIZE} className={styles.icon} />
        </Button>
      </div>
      {error ? <div className={styles.error}>{error}</div> : null}
    </div>
  );
};
