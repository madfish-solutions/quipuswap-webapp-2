import { useContext, useMemo } from 'react';

import cx from 'classnames';

import { usePoolCreationPrice } from '@modules/stableswap/hooks';
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
  const { creationPrice } = usePoolCreationPrice();
  const { t } = useTranslation();
  const { price, halfPrice } = useMemo(
    () => ({ price: creationPrice?.toFixed() ?? '', halfPrice: creationPrice?.dividedBy('2').toFixed() ?? '' }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [creationPrice?.toFixed()]
  );

  return (
    <Card
      header={{
        content: t('stableswap|creationRules')
      }}
      className={modeClass[colorThemeMode]}
      contentClassName={styles.content}
      data-test-id="stableswapDetails"
    >
      <div>{t('stableswap|youMayCreatePool')}</div>

      <h4 className={styles.rules}>{t('stableswap|rules')}</h4>

      <ol className={styles.orderedList}>
        <li>
          <span className={styles.liTitle}>
            <span className={styles.accent}>1)</span> {t('stableswap|chooseTokens')}
          </span>
        </li>

        <li>
          <span className={styles.liTitle}>
            <span className={styles.accent}>2)</span> {t('stableswap|followingFees')}
          </span>
        </li>

        <ul className={styles.sublist}>
          <li>{t('stableswap|standardFee')}</li>
          <li>{t('stableswap|ourFee', { price, halfPrice })}</li>
        </ul>

        <li>
          <span className={styles.liTitle}>
            <span className={styles.accent}>3)</span>
            {t('stableswap|setupLiquidityProvidersFee')}
          </span>
        </li>
        <p className={styles.paragraph}>{t('stableswap|maxLiquidityProviderFeeDecriptions')}</p>

        <li>
          <span className={styles.liTitle}>
            <span className={styles.accent}>4)</span>
            {t('stableswap|chooseAmplification')}
          </span>
        </li>
        <p className={styles.paragraph}>{t('stableswap|amplificationDecriptions')}</p>

        <li>
          <span className={styles.liTitle}>
            <span className={styles.accent}>5)</span>
            <span>
              {t('stableswap|rememberInbuiltFee')}{' '}
              <span className={styles.normal}>{t('stableswap|forEachOperation')}</span>
            </span>
          </span>
          <ul className={styles.sublist}>
            <li>
              {t('stableswap|liquidityProvidersFeeDecriptions')}{' '}
              <span className={cx(styles.accent, styles.leftSpace)}>Custom</span>
            </li>
            <li>
              {t('stableswap|interfaceFeeDecriptions')}{' '}
              <span className={cx(styles.accent, styles.leftSpace)}>0.005%</span>
            </li>
            <li>
              {t('stableswap|stakersFeeDecriptions')} <span className={cx(styles.accent, styles.leftSpace)}>0.03%</span>
            </li>
            <li>
              {t('stableswap|devFeeDecriptions')} <span className={cx(styles.accent, styles.leftSpace)}>0.045%</span>
            </li>
          </ul>
        </li>

        <li>
          <span className={styles.liTitle}>
            <span className={styles.accent}>6)</span> {t('stableswap|clickThe')}{' '}
            <span className={styles.accent}>{t('stableswap|create')}</span> {t('stableswap|button')}
          </span>
        </li>
      </ol>
    </Card>
  );
};
