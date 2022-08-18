import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import commonContainerStyles from '@styles/CommonContainer.module.scss';

import styles from './dex-two-details.module.scss';

export const useDexTwoDetailsViewModel = () => {
  return {
    feesRate: new BigNumber('0.15'),
    tvlInUsd: new BigNumber('888999'),
    isLoading: false,
    totalLpSupply: new BigNumber('150'),
    poolContractUrl: '/',
    cardCellClassName: cx(commonContainerStyles.cellCenter, commonContainerStyles.cell, styles.vertical),
    pieChartData: [
      { value: 100, tokenSymbol: 'QUIPU' },
      { value: 150, tokenSymbol: 'XTZ' }
    ]
  };
};
