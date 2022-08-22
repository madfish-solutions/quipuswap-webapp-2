import cx from 'classnames';

import { DEFAULT_DECIMALS } from '@config/constants';
import { getTokenSymbol, toReal } from '@shared/helpers';
import commonContainerStyles from '@styles/CommonContainer.module.scss';

import { useNewLiquidityItemStore } from '../../../../hooks';
import styles from './dex-two-details.module.scss';

export const useDexTwoDetailsViewModel = () => {
  const item = useNewLiquidityItemStore();

  const pieChartData = item?.item?.tokensInfo.map(({ atomicTokenTvl, token }) => ({
    value: toReal(atomicTokenTvl, token.metadata.decimals ?? DEFAULT_DECIMALS).toNumber(),
    tokenSymbol: getTokenSymbol(token)
  }));

  return {
    apr: null,
    feesRate: null,
    weeklyVolume: null,
    tvlInUsd: item?.item?.tvlInUsd,
    totalLpSupply: item?.item?.totalSupply && toReal(item?.item?.totalSupply, DEFAULT_DECIMALS),
    poolContractUrl: '/',
    cardCellClassName: cx(commonContainerStyles.cellCenter, commonContainerStyles.cell, styles.vertical),
    pieChartData: pieChartData ?? []
  };
};
