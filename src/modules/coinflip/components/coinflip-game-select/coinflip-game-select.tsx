import { FC } from 'react';

import Lottie from 'react-lottie';

import { Button } from '@shared/components';

import styles from './coinflip-game-select.module.scss';
import { CoinflipGameSelectProps } from './coinflip-game-select.props';
import { useCoinflipGameSelectViewModel } from './use-coinflip-game-select.vm';

export const CoinflipGameSelect: FC<CoinflipGameSelectProps> = props => {
  const { error, isLoading, handleSelectSideA, handleSelectSideB, FaceIcon, BackIcon, animationData } =
    useCoinflipGameSelectViewModel(props);

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        {isLoading ? (
          <div className={styles.animation}>
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData
              }}
              height={160}
              width={160}
              isClickToPauseDisabled
            />
          </div>
        ) : (
          <>
            <Button
              data-test-id="coinflipHeadButton"
              onClick={handleSelectSideA}
              theme="clean"
              className={styles.button}
            >
              <FaceIcon />
            </Button>

            <Button
              data-test-id="coinflipTailButton"
              onClick={handleSelectSideB}
              theme="clean"
              className={styles.button}
            >
              <BackIcon />
            </Button>
          </>
        )}
      </div>
      {error ? (
        <div className={styles.error} data-test-id="coinflipGameSelectError">
          {error}
        </div>
      ) : null}
    </div>
  );
};
