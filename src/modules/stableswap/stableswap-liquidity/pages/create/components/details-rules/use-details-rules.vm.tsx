import { useMemo } from 'react';

import cx from 'classnames';

import { usePoolCreationPrice, usePoolToCreateVersion } from '@modules/stableswap/hooks';
import { isExist, isGreaterThanZero } from '@shared/helpers';
import { useTranslation } from '@translation';

import styles from './details-rules.module.scss';

const ORDERED_LIST_START_INDEX = 1;

export const useDetailsRulesViewModel = () => {
  const version = usePoolToCreateVersion();
  const { creationPrice } = usePoolCreationPrice(version);
  const { t } = useTranslation();
  const { price, halfPrice } = useMemo(
    () => ({ price: creationPrice?.toFixed() ?? '', halfPrice: creationPrice?.dividedBy('2').toFixed() ?? '' }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [creationPrice?.toFixed()]
  );

  const itemsProps = useMemo(
    () =>
      [
        {
          title: t('stableswap|chooseTokens'),
          children: null
        },
        isGreaterThanZero(price)
          ? {
              title: t('stableswap|followingFees'),
              children: (
                <ul className={styles.sublist}>
                  <li>{t('stableswap|standardFee')}</li>
                  <li>{t('stableswap|ourFee', { price, halfPrice })}</li>
                </ul>
              )
            }
          : {
              title: t('stableswap|onlyStandardFee'),
              children: null
            },
        {
          title: t('stableswap|setupLiquidityProvidersFee'),
          children: <p className={styles.paragraph}>{t('stableswap|maxLiquidityProviderFeeDecriptions')}</p>
        },
        {
          title: t('stableswap|chooseAmplification'),
          children: <p className={styles.paragraph}>{t('stableswap|amplificationDecriptions')}</p>
        },
        {
          title: (
            <span>
              {t('stableswap|rememberInbuiltFee')}{' '}
              <span className={styles.normal}>{t('stableswap|forEachOperation')}</span>
            </span>
          ),
          internalChildren: (
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
                {t('stableswap|stakersFeeDecriptions')}{' '}
                <span className={cx(styles.accent, styles.leftSpace)}>0.03%</span>
              </li>
              <li>
                {t('stableswap|devFeeDecriptions')} <span className={cx(styles.accent, styles.leftSpace)}>0.045%</span>
              </li>
            </ul>
          )
        },
        {
          title: (
            <>
              {t('stableswap|clickThe')} <span className={styles.accent}>{t('stableswap|create')}</span>{' '}
              {t('stableswap|button')}
            </>
          )
        }
      ]
        .filter(isExist)
        .map((item, index) => ({ ...item, index: index + ORDERED_LIST_START_INDEX })),
    [halfPrice, price, t]
  );

  return { itemsProps };
};
