import { FC } from 'react';

import Lottie from 'react-lottie';

import { Button } from '@shared/components';

import styles from './coinflip-game-select.module.scss';
import { CoinflipGameSelectProps } from './coinflip-game-select.props';
import { useCoinflipGameSelectViewModel } from './use-coinflip-game-select.vm';

export const CoinflipGameSelect: FC<CoinflipGameSelectProps> = props => {
  const {
    error,
    isLoading,
    handleSelectHead,
    handleSelectTail,
    FaceIcon,
    BackIcon,
    animationData,
    isHeadSelected,
    isTailSelected
  } = useCoinflipGameSelectViewModel(props);

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
              onClick={handleSelectHead}
              theme="clean"
              className={styles.button}
            >
              <FaceIcon />
              <div className={styles.buttonLabel}>{isHeadSelected ? 'Head' : <br />}</div>
            </Button>

            <Button
              data-test-id="coinflipTailButton"
              onClick={handleSelectTail}
              theme="clean"
              className={styles.button}
            >
              <BackIcon />
              <div className={styles.buttonLabel}>{isTailSelected ? 'Tail' : <br />}</div>
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
