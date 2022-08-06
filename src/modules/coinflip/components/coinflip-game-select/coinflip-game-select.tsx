import { FC } from 'react';

import Lottie from 'react-lottie';

import { Button } from '@shared/components';

import animationData from '../../animations/amination-coin-flip.json';
import styles from './coinflip-game-select.module.scss';
import { CoinflipGameSelectProps } from './coinflip-game-select.props';
import { useCoinflipGameSelectViewModel } from './use-coinflip-game-select.vm';

const animation = {
  animationData,
  realWidth: 1056,
  realHeight: 600,
  width: 600,
  getHeight: () => Math.round((animation.width * animation.realHeight) / animation.realWidth)
};

export const CoinflipGameSelect: FC<CoinflipGameSelectProps> = props => {
  const { error, isLoading, handleSelectSideA, handleSelectSideB, FaceIcon, BackIcon } =
    useCoinflipGameSelectViewModel(props);

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        {isLoading ? (
          <div className={styles.button}>
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: animation.animationData
              }}
              height={animation.getHeight()}
              width={animation.width}
            />
          </div>
        ) : (
          <>
            <Button onClick={handleSelectSideA} theme="clean" className={styles.button}>
              <FaceIcon />
            </Button>

            <Button onClick={handleSelectSideB} theme="clean" className={styles.button}>
              <BackIcon />
            </Button>
          </>
        )}
      </div>
      {error ? <div className={styles.error}>{error}</div> : null}
    </div>
  );
};
