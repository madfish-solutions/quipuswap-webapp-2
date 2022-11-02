import cx from 'classnames';

import { DEFAULT_DECIMALS } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';
import { opportunityHelper } from '@modules/stableswap/stableswap-liquidity/pages/item/opportunity.helper';
import { getTokenSymbol, isExist, toReal } from '@shared/helpers';
import commonContainerStyles from '@styles/CommonContainer.module.scss';

import { useLiquidityItemStore } from '../../../../hooks';
import styles from './dex-two-details.module.scss';
import { useDexTwoPoolBaker } from './use-dex-two-pool-baker';

export const useDexTwoDetailsViewModel = () => {
  const liquidityItemStore = useLiquidityItemStore();
  const item = liquidityItemStore?.item;
  const { baker: currentBaker, bakerIsLoading } = useDexTwoPoolBaker();

  const pieChartData = item?.tokensInfo.map(({ atomicTokenTvl, token }) => ({
    value: toReal(atomicTokenTvl, token.metadata.decimals ?? DEFAULT_DECIMALS).toNumber(),
    tokenSymbol: getTokenSymbol(token)
  }));

  const dexTwoContractAddress = liquidityItemStore.item?.contractAddress;
  const poolContractUrl = `${TZKT_EXPLORER_URL}/${dexTwoContractAddress}`;

  const opportunities = item?.opportunities?.map(opportunityHelper);

  const isLoading = !isExist(liquidityItemStore) || liquidityItemStore.itemIsLoading || bakerIsLoading;

  return {
    detailsViewProps: {
      apr: null,
      currentBaker,
      feesRate: null,
      isLoading,
      weeklyVolume: null,
      tvlInUsd: item?.tvlInUsd,
      totalLpSupply: item?.totalSupply && toReal(item?.totalSupply, DEFAULT_DECIMALS),
      atomicTotalLpSupply: item?.totalSupply,
      poolContractUrl,
      cardCellClassName: cx(commonContainerStyles.cellCenter, commonContainerStyles.cell, styles.vertical),
      pieChartData: pieChartData ?? []
    },
    opportunities: opportunities ?? []
  };
};
