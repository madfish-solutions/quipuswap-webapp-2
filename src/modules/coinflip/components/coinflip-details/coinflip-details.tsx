import { FC, useContext } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Card, DashPlug, DetailsCardCell, StateCurrencyAmount, StateWrapper } from '@shared/components';
import { isExist } from '@shared/helpers';
import { useTranslation } from '@translation';

import styles from './coinflip-details.module.scss';
import { useCoinflipDetailsViewModel } from './coinflip-details.vm';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  className?: string;
}

export const CoinflipDetails: FC<Props> = observer(({ className }) => {
  const { t } = useTranslation();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const {
    bank,
    bidSize,
    preparedBidSize,
    bankInUsd,
    totalWins,
    gamesCount,
    lastGameId,
    rewardSize,
    gameResult,
    betCoinSide,
    tokenToPlay,
    bidSizeInUsd,
    totalWinsInUsd,
    shouldHideData,
    rewardSizeInUsd,
    payoutCoefficient,
    isGamersStatsLoading,
    isUserLastGameLoading
  } = useCoinflipDetailsViewModel();

  return (
    <Card
      className={cx(modeClass[colorThemeMode], className)}
      header={{ content: <>Details</> }}
      contentClassName={styles.content}
    >
      <div className={styles.gameInfo}>
        <h3 className={styles.h3}>Game Info</h3>

        <DetailsCardCell
          className={styles.cardCell}
          cellName={t('coinflip|payoutCoefficient')}
          tooltipContent={t('coinflip|payoutCoefficientTooltip')}
          data-test-id="valueLocked"
        >
          <StateCurrencyAmount
            className={styles.payoutCoefficient}
            isLoading={isGamersStatsLoading}
            loaderFallback={<DashPlug />}
            amount={payoutCoefficient}
            currency="X"
          />
        </DetailsCardCell>

        <DetailsCardCell
          className={styles.cardCell}
          cellName={t('coinflip|bank')}
          tooltipContent={t('coinflip|bankTooltip')}
          data-test-id="valueLocked"
        >
          <StateCurrencyAmount
            className={cx(styles.amount)}
            isLoading={isGamersStatsLoading}
            loaderFallback={<DashPlug />}
            amount={bank}
            currency={tokenToPlay}
            dollarEquivalent={bankInUsd}
          />
        </DetailsCardCell>

        <DetailsCardCell
          className={styles.cardCell}
          cellName={t('coinflip|totalWins')}
          tooltipContent={t('coinflip|totalWinsTooltip')}
          data-test-id="valueLocked"
        >
          <StateCurrencyAmount
            className={cx(styles.amount)}
            isLoading={isGamersStatsLoading}
            loaderFallback={<DashPlug />}
            amount={totalWins}
            currency={tokenToPlay}
            dollarEquivalent={totalWinsInUsd}
          />
        </DetailsCardCell>

        <DetailsCardCell
          className={styles.cardCell}
          cellName={t('coinflip|gamesCount')}
          tooltipContent={t('coinflip|gamesCountTooltip')}
          data-test-id="valueLocked"
        >
          <StateCurrencyAmount isLoading={isGamersStatsLoading} loaderFallback={<DashPlug />} amount={gamesCount} />
        </DetailsCardCell>

        <DetailsCardCell className={styles.cardCell} cellName={t('coinflip|maxBetAmount')} data-test-id="maxBetAmount">
          <StateCurrencyAmount
            className={cx(styles.amount)}
            isLoading={isGamersStatsLoading}
            loaderFallback={<DashPlug />}
            amount={preparedBidSize}
            currency={tokenToPlay}
          />
        </DetailsCardCell>
      </div>
      <div className={styles.lastGameResult}>
        <h3 className={styles.h3}>Your last game result</h3>

        <DetailsCardCell
          className={styles.cardCell}
          cellName={t('coinflip|gameId')}
          tooltipContent={t('coinflip|gameIdTooltip')}
          data-test-id="valueLocked"
        >
          <StateCurrencyAmount
            isError={shouldHideData || !isExist(lastGameId)}
            errorFallback={<DashPlug animation={false} />}
            isLoading={isUserLastGameLoading}
            loaderFallback={<DashPlug />}
            amount={lastGameId}
          />
        </DetailsCardCell>

        <DetailsCardCell
          className={styles.cardCell}
          cellName={t('coinflip|betSize')}
          tooltipContent={t('coinflip|betSizeTooltip')}
          data-test-id="valueLocked"
        >
          <StateCurrencyAmount
            className={cx({ [styles.amount]: isExist(bidSizeInUsd) })}
            isError={shouldHideData || !isExist(bidSizeInUsd)}
            errorFallback={<DashPlug animation={false} />}
            isLoading={isUserLastGameLoading}
            loaderFallback={<DashPlug />}
            amount={bidSize}
            currency={tokenToPlay}
            dollarEquivalent={bidSizeInUsd}
          />
        </DetailsCardCell>

        <DetailsCardCell
          className={styles.cardCell}
          cellName={t('coinflip|rewardSize')}
          tooltipContent={t('coinflip|rewardSizeTooltip')}
          data-test-id="valueLocked"
        >
          <StateCurrencyAmount
            className={cx({ [styles.amount]: isExist(rewardSizeInUsd) })}
            isError={shouldHideData || !isExist(rewardSizeInUsd)}
            errorFallback={<DashPlug animation={false} />}
            isLoading={isUserLastGameLoading}
            amount={rewardSize}
            currency={tokenToPlay}
            dollarEquivalent={rewardSizeInUsd}
          />
        </DetailsCardCell>

        <DetailsCardCell
          className={styles.cardCell}
          cellName={t('coinflip|result')}
          tooltipContent={t('coinflip|resultTooltip')}
          data-test-id="valueLocked"
        >
          <StateWrapper
            isError={shouldHideData || !isExist(betCoinSide) || !isExist(gameResult)}
            errorFallback={<DashPlug animation={false} />}
            isLoading={isUserLastGameLoading}
            loaderFallback={<DashPlug />}
          >
            <div className={styles.resultContainer}>
              <span className={styles.yourSide}>(Your side is: {betCoinSide})</span>
              <span className={styles.result}>{gameResult}</span>
            </div>
          </StateWrapper>
        </DetailsCardCell>
      </div>
    </Card>
  );
});
