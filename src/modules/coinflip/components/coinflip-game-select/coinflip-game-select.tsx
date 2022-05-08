import { FC } from 'react';

import { Button } from '@shared/components';
import { CoinSelectedIcon, CoinSideAQuipuIcon, CoinSideBIcon } from '@shared/svg';
import { CoinSideATezosIcon } from '@shared/svg/coin/coin-side-a-tezos';

import styles from './coinflip-game-select.module.scss';

const COIN_SIZE = 88;

export const CoinflipGameSelect: FC = () => {
  const isTez = true;

  const handleSelectSizeA = () => {
    // eslint-disable-next-line no-console
    console.log('a');
  };

  const handleSelectSizeB = () => {
    // eslint-disable-next-line no-console
    console.log('b');
  };

  return (
    <div className={styles.root}>
      <Button onClick={handleSelectSizeA} theme="clean" className={styles.button}>
        {isTez ? (
          <CoinSideATezosIcon size={COIN_SIZE} className={styles.icon} />
        ) : (
          <CoinSideAQuipuIcon size={COIN_SIZE} className={styles.icon} />
        )}
      </Button>

      <Button onClick={handleSelectSizeB} theme="clean" className={styles.button}>
        <CoinSelectedIcon size={COIN_SIZE} className={styles.selected} />
        <CoinSideBIcon size={COIN_SIZE} className={styles.icon} />
      </Button>
    </div>
  );
};
