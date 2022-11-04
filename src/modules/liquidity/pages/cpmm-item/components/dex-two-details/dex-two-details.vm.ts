import cx from 'classnames';

import { DEFAULT_DECIMALS } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';
import { opportunityHelper } from '@modules/stableswap/stableswap-liquidity/pages/item/opportunity.helper';
import { getTokenSymbol, toReal } from '@shared/helpers';
import { useTokenExchangeRate } from '@shared/hooks/use-token-exchange-rate';
import commonContainerStyles from '@styles/CommonContainer.module.scss';

import { useLiquidityItemStore } from '../../../../hooks';
import styles from './dex-two-details.module.scss';

export const useDexTwoDetailsViewModel = () => {
  const liquidityItemStore = useLiquidityItemStore();
  const { getTokenExchangeRate } = useTokenExchangeRate();

  const pieChartData = liquidityItemStore?.item?.tokensInfo.map(({ atomicTokenTvl, token }) => {
    const realTokenValue = toReal(atomicTokenTvl, token.metadata.decimals ?? DEFAULT_DECIMALS);

    return {
      value: getTokenExchangeRate(token)?.multipliedBy(realTokenValue).toNumber() ?? null,
      tokenValue: realTokenValue.toNumber(),
      tokenSymbol: getTokenSymbol(token)
    };
  });

  const dexTwoContractAddress = liquidityItemStore.item?.contractAddress;
  const poolContractUrl = `${TZKT_EXPLORER_URL}/${dexTwoContractAddress}`;

  const opportunities = liquidityItemStore?.item?.opportunities?.map(opportunityHelper);

  return {
    detailsViewProps: {
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
    },
    opportunities: opportunities ?? []
  };
};
