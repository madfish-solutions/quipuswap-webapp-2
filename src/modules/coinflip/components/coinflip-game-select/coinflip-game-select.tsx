import { FC } from 'react';

import { Button } from '@shared/components';
import { CoinSelectedIcon, CoinSideAQuipuIcon, CoinSideBIcon } from '@shared/svg';
import { CoinSideATezosIcon } from '@shared/svg/coin/coin-side-a-tezos';
import { Optional } from '@shared/types';

import { CoinSide, TokenToPlay } from '../../stores';
import styles from './coinflip-game-select.module.scss';

const COIN_SIZE = 88;

interface Props {
  tokenToPlay: TokenToPlay;
  coinSide: Nullable<CoinSide>;
  error: Optional<string>;
  handleSelectCoinSide: (coinSide: CoinSide) => void;
}

export const CoinflipGameSelect: FC<Props> = ({ tokenToPlay, coinSide, error, handleSelectCoinSide }) => {
  const iSelectedSideA = coinSide === CoinSide.A;
  const iSelectedSideB = coinSide === CoinSide.B;

  const handleSelectSideA = () => handleSelectCoinSide(CoinSide.A);
  const handleSelectSideB = () => handleSelectCoinSide(CoinSide.B);

  const isTez = tokenToPlay === TokenToPlay.Tezos;
  const CoinSideA = isTez ? CoinSideATezosIcon : CoinSideAQuipuIcon;

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        <Button onClick={handleSelectSideA} theme="clean" className={styles.button}>
          {iSelectedSideA && <CoinSelectedIcon size={COIN_SIZE} className={styles.selected} />}
          <CoinSideA size={COIN_SIZE} className={styles.icon} />
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
