import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Card, DetailsCardCell, StateCurrencyAmount } from '@shared/components';
import { useTranslation } from '@translation';

import styles from './coinflip-details.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  className?: string;
}

export const CoinflipDetails: FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const { colorThemeMode } = useContext(ColorThemeContext);

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
          <StateCurrencyAmount currency="X" amount="1.99" className={styles.payoutCoefficient} />
        </DetailsCardCell>

        <DetailsCardCell className={styles.cardCell} cellName={t('coinflip|bank')} data-test-id="valueLocked">
          <StateCurrencyAmount dollarEquivalent="888888" currency="QUIPU" amount="888888" />
        </DetailsCardCell>

        <DetailsCardCell className={styles.cardCell} cellName={t('coinflip|totalWins')} data-test-id="valueLocked">
          <StateCurrencyAmount dollarEquivalent="888888" currency="QUIPU" amount="888888" />
        </DetailsCardCell>

        <DetailsCardCell className={styles.cardCell} cellName={t('coinflip|gamesCount')} data-test-id="valueLocked">
          <StateCurrencyAmount amount="888888" />
        </DetailsCardCell>
      </div>
      <div className={styles.lastGameResult}>
        <h3 className={styles.h3}>Your last game result</h3>

        <DetailsCardCell className={styles.cardCell} cellName={t('coinflip|gameId')} data-test-id="valueLocked">
          <StateCurrencyAmount amount="888888" />
        </DetailsCardCell>

        <DetailsCardCell className={styles.cardCell} cellName={t('coinflip|betSize')} data-test-id="valueLocked">
          <StateCurrencyAmount dollarEquivalent="888888" currency="QUIPU" amount="888888" />
        </DetailsCardCell>

        <DetailsCardCell className={styles.cardCell} cellName={t('coinflip|rewardSize')} data-test-id="valueLocked">
          <StateCurrencyAmount dollarEquivalent="888888" currency="QUIPU" amount="888888" />
        </DetailsCardCell>

        <DetailsCardCell className={styles.cardCell} cellName={t('coinflip|result')} data-test-id="valueLocked">
          <StateCurrencyAmount dollarEquivalent="888888" currency="QUIPU" amount="888888" />
        </DetailsCardCell>
      </div>
    </Card>
  );
};
