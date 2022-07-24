import { useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Card } from '@shared/components';
import { useTranslation } from '@translation';

import styles from './details-rules.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const DetailsRules = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation();

  return (
    <Card
      header={{
        content: t('common|Pool Details')
      }}
      className={modeClass[colorThemeMode]}
      contentClassName={styles.content}
      data-test-id="stableswapDetails"
    >
      <div>Stable DEX liquidity pool creation rules</div>
      <div>With the aid of this tool, you may create token pools with equal value.</div>
      <div>Rules:</div>

      <ol className={styles.orderedList}>
        <li>
          1) Choose <span className={styles.accent}>two</span> to <span className={styles.accent}>four</span>{' '}
          equal-value Tezos-based tokens and put the starting values in the input field.
        </li>

        <li>2) By creating a pool, you will pay the following fees:</li>

        <ul className={styles.sublist}>
          <li>Standard tezos blockchain fee for interaction with the smart-contract</li>
          <li>
            <span>
              <span className={styles.accent}>400</span> QUIPU, where <span className={styles.accent}>200</span> QUIPU
              are immediately burned, and <span className={styles.accent}>200</span> QUIPU will move to the QuipuSwap
              dev fund.
            </span>
          </li>
        </ul>

        <li>3) Set up a fee that will be paid to the liquidity providers of your pool.</li>
        <ul className={styles.sublist}>
          <li>
            The maximum fee is 1%, but we advise you to set the fee around 0.07% to balance out the provider's incentive
            and low transaction fees.
          </li>
        </ul>

        <li>4) Choose the Amplification parameters (A)</li>
        <ul className={styles.sublist}>
          <li>
            The application parameter determines a pool's tolerance for the imbalance between its assets. A higher value
            means that trades will incur slippage sooner as the assets within the pool become imbalanced.
          </li>
        </ul>

        <li>
          5) Remember that QuipuSwap will charge the following fees{' '}
          <span className={styles.normal}>for each trading operation in your pool:</span>
          <ul className={styles.sublist}>
            <li>
              Liquidity providers fee: <span className={cx(styles.accent, styles.leftSpace)}>custom</span>
            </li>
            <li>
              Interface Fee: <span className={cx(styles.accent, styles.leftSpace)}>0.005%</span>
            </li>
            <li>
              QUIPU Stakers Fee: <span className={cx(styles.accent, styles.leftSpace)}>0.03%</span>
            </li>
            <li>
              Dev Fee: <span className={cx(styles.accent, styles.leftSpace)}>0.045%</span>
            </li>
          </ul>
        </li>

        <li>
          6) Click the <span className={styles.accent}>Create</span> button!
        </li>
      </ol>
    </Card>
  );
};
