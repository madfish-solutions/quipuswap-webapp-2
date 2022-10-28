import cx from 'classnames';

import { DEFAULT_DECIMALS } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';
import { getTokenSymbol, toReal } from '@shared/helpers';
import commonContainerStyles from '@styles/CommonContainer.module.scss';

import { useLiquidityItemStore } from '../../../../hooks';
import styles from './dex-two-details.module.scss';

export const useDexTwoDetailsViewModel = () => {
  const liquidityItemStore = useLiquidityItemStore();

  const pieChartData = liquidityItemStore?.item?.tokensInfo.map(({ atomicTokenTvl, token }) => ({
    value: toReal(atomicTokenTvl, token.metadata.decimals ?? DEFAULT_DECIMALS).toNumber(),
    tokenSymbol: getTokenSymbol(token)
  }));

  const dexTwoContractAddress = liquidityItemStore.item?.contractAddress;
  const poolContractUrl = `${TZKT_EXPLORER_URL}/${dexTwoContractAddress}`;

  return {
    apr: null,
    feesRate: null,
    weeklyVolume: null,
    tvlInUsd: liquidityItemStore?.item?.tvlInUsd,
    totalLpSupply:
      liquidityItemStore?.item?.totalSupply && toReal(liquidityItemStore?.item?.totalSupply, DEFAULT_DECIMALS),
    atomicTotalLpSupply: liquidityItemStore?.item?.totalSupply,
    poolContractUrl,
    cardCellClassName: cx(commonContainerStyles.cellCenter, commonContainerStyles.cell, styles.vertical),
    pieChartData: pieChartData ?? []
  };
};
