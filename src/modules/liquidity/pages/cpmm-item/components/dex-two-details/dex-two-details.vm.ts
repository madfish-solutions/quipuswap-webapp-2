import cx from 'classnames';

import { DEFAULT_DECIMALS } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';
import { opportunityHelper } from '@modules/stableswap/stableswap-liquidity/pages/item/opportunity.helper';
import { getTokenSymbol, isGreaterThanZero, toReal } from '@shared/helpers';
import { useTokenExchangeRate } from '@shared/hooks';
import commonContainerStyles from '@styles/CommonContainer.module.scss';

import styles from './dex-two-details.module.scss';
import { useDexTwoPoolCurrentBaker } from './use-dex-two-pool-current-baker';
import { useLiquidityItemStore } from '../../../../hooks';

export const useDexTwoDetailsViewModel = () => {
  const { item, itemIsLoading } = useLiquidityItemStore();
  const { getTokenExchangeRate } = useTokenExchangeRate();
  // TODO: https://madfish.atlassian.net/browse/QUIPU-610
  const { currentBaker, canHaveBaker } = useDexTwoPoolCurrentBaker();

  const liquidityChartData = item?.tokensInfo.map(({ atomicTokenTvl, token }) => {
    const realTokenValue = toReal(atomicTokenTvl, token.metadata.decimals ?? DEFAULT_DECIMALS);

    return {
      value: getTokenExchangeRate(token)?.multipliedBy(realTokenValue).toNumber() ?? null,
      tokenValue: realTokenValue.toNumber(),
      tokenSymbol: getTokenSymbol(token)
    };
  });

  const dexTwoContractAddress = item?.contractAddress;
  const poolContractUrl = `${TZKT_EXPLORER_URL}/${dexTwoContractAddress}`;

  const opportunities = item?.opportunities?.map(opportunityHelper).filter(({ apr }) => isGreaterThanZero(apr));

  return {
    detailsViewProps: {
      apr: null,
      canHaveBaker,
      currentBaker,
      feesRate: null,
      isLoading: itemIsLoading,
      weeklyVolume: null,
      tvlInUsd: item?.tvlInUsd,
      totalLpSupply: item?.totalSupply && toReal(item?.totalSupply, DEFAULT_DECIMALS),
      atomicTotalLpSupply: item?.totalSupply,
      poolContractUrl,
      cardCellClassName: cx(commonContainerStyles.cellCenter, commonContainerStyles.cell, styles.vertical),
      liquidityChartData: liquidityChartData ?? []
    },
    opportunities: opportunities ?? []
  };
};
