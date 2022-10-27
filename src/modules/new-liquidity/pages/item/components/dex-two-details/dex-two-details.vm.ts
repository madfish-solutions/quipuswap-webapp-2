import cx from 'classnames';

import { DEFAULT_DECIMALS } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';
import { getTokenSymbol, toReal } from '@shared/helpers';
import commonContainerStyles from '@styles/CommonContainer.module.scss';

import { useNewLiquidityItemStore } from '../../../../hooks';
import styles from './dex-two-details.module.scss';

export const useDexTwoDetailsViewModel = () => {
  const newLiquidityItemStore = useNewLiquidityItemStore();

  const pieChartData = newLiquidityItemStore?.item?.tokensInfo.map(({ atomicTokenTvl, token }) => ({
    value: toReal(atomicTokenTvl, token.metadata.decimals ?? DEFAULT_DECIMALS).toNumber(),
    tokenSymbol: getTokenSymbol(token)
  }));

  const dexTwoContractAddress = newLiquidityItemStore.item?.contractAddress;
  const poolContractUrl = `${TZKT_EXPLORER_URL}/${dexTwoContractAddress}`;

  return {
    apr: null,
    feesRate: null,
    weeklyVolume: null,
    tvlInUsd: newLiquidityItemStore?.item?.tvlInUsd,
    totalLpSupply:
      newLiquidityItemStore?.item?.totalSupply && toReal(newLiquidityItemStore?.item?.totalSupply, DEFAULT_DECIMALS),
    poolContractUrl,
    cardCellClassName: cx(commonContainerStyles.cellCenter, commonContainerStyles.cell, styles.vertical),
    pieChartData: pieChartData ?? []
  };
};
