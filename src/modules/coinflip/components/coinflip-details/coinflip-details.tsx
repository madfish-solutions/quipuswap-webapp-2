import { FC, useContext } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Card, DetailsCardCell, StateCurrencyAmount } from '@shared/components';
import { useTranslation } from '@translation';

import { useCoinflipDashboardStatsViewModel } from '../dashboard-general-stats-info/use-coinflip-dashboard-stats.vm';
import styles from './coinflip-details.module.scss';

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
  const { bank, bankInUsd, totalWins, gamesCount, payoutCoefficient, tokenToPlay } =
    useCoinflipDashboardStatsViewModel();

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
          data-test-id="valueLocked"
        >
          <StateCurrencyAmount currency="X" amount={payoutCoefficient} className={styles.payoutCoefficient} />
        </DetailsCardCell>

        <DetailsCardCell className={styles.cardCell} cellName={t('coinflip|bank')} data-test-id="valueLocked">
          <StateCurrencyAmount dollarEquivalent={bankInUsd} currency={tokenToPlay} amount={bank} />
        </DetailsCardCell>

        <DetailsCardCell className={styles.cardCell} cellName={t('coinflip|totalWins')} data-test-id="valueLocked">
          <StateCurrencyAmount dollarEquivalent="888888" currency={tokenToPlay} amount={totalWins} />
        </DetailsCardCell>

        <DetailsCardCell className={styles.cardCell} cellName={t('coinflip|gamesCount')} data-test-id="valueLocked">
          <StateCurrencyAmount amount={gamesCount} />
        </DetailsCardCell>
      </div>
      <div className={styles.lastGameResult}>
        <h3 className={styles.h3}>Your last game result</h3>

        <DetailsCardCell className={styles.cardCell} cellName={t('coinflip|gameId')} data-test-id="valueLocked">
          <StateCurrencyAmount amount="888888" />
        </DetailsCardCell>

        <DetailsCardCell className={styles.cardCell} cellName={t('coinflip|betSize')} data-test-id="valueLocked">
          <StateCurrencyAmount dollarEquivalent="888888" currency={tokenToPlay} amount="888888" />
        </DetailsCardCell>

        <DetailsCardCell className={styles.cardCell} cellName={t('coinflip|rewardSize')} data-test-id="valueLocked">
          <StateCurrencyAmount dollarEquivalent="888888" currency={tokenToPlay} amount="888888" />
        </DetailsCardCell>

        <DetailsCardCell className={styles.cardCell} cellName={t('coinflip|result')} data-test-id="valueLocked">
          <StateCurrencyAmount dollarEquivalent="888888" currency={tokenToPlay} amount="888888" />
        </DetailsCardCell>
      </div>
    </Card>
  );
});
