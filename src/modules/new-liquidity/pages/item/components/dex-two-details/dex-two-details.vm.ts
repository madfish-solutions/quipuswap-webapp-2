import cx from 'classnames';

import { DEFAULT_DECIMALS } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';
import { getTokenSymbol, toReal } from '@shared/helpers';
import commonContainerStyles from '@styles/CommonContainer.module.scss';

import { useNewLiquidityItemStore } from '../../../../hooks';
import styles from './dex-two-details.module.scss';

const DEX_TWO_PAIR_CONTRACT = 'KT1GPJDTf8GZspCcanaG2KhMvGu3NJRqurat';

export const useDexTwoDetailsViewModel = () => {
  const item = useNewLiquidityItemStore();

  const pieChartData = item?.item?.tokensInfo.map(({ atomicTokenTvl, token }) => ({
    value: toReal(atomicTokenTvl, token.metadata.decimals ?? DEFAULT_DECIMALS).toNumber(),
    tokenSymbol: getTokenSymbol(token)
  }));

  const poolContractUrl = `${TZKT_EXPLORER_URL}/${DEX_TWO_PAIR_CONTRACT}`;

  return {
    apr: null,
    feesRate: null,
    weeklyVolume: null,
    tvlInUsd: item?.item?.tvlInUsd,
    totalLpSupply: item?.item?.totalSupply && toReal(item?.item?.totalSupply, DEFAULT_DECIMALS),
    poolContractUrl,
    cardCellClassName: cx(commonContainerStyles.cellCenter, commonContainerStyles.cell, styles.vertical),
    pieChartData: pieChartData ?? []
  };
};
