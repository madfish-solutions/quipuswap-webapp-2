import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { STABLESWAP_STRATEGY_FACTORY_ADDRESS } from '@config/environment';
import { getContract, getStorageInfo } from '@shared/dapp';
import { defined, fillIndexArray } from '@shared/helpers';

import { StrategyFactoryContractStorage, StrategyContractStorage } from '../../../../types';

interface YupanaRebalanceProps {
  tezos: TezosToolkit;
  stableswapContractAddress: string;
  stableswapPoolId: number;
  tokensInPool: number;
}

const getErrorMessage = (stableswapContractAddress: string, stableswapPoolId: number) => {
  return `Strategy contract address is not defined for stableswap ${stableswapContractAddress} with pool id ${stableswapPoolId}`;
};

const prepareStrategyInfo = async ({
  tezos,
  stableswapContractAddress,
  stableswapPoolId
}: Omit<YupanaRebalanceProps, 'tokensInPool'>) => {
  const strategyFactoryContractStorage = await getStorageInfo<StrategyFactoryContractStorage.Root>(
    tezos,
    STABLESWAP_STRATEGY_FACTORY_ADDRESS
  );

  const strategyContractAddress = await strategyFactoryContractStorage.deployed_strategies.get({
    pool_contract: stableswapContractAddress,
    pool_id: new BigNumber(stableswapPoolId)
  });

  const fixedStrategyContractAddress = defined(
    strategyContractAddress,
    getErrorMessage(stableswapContractAddress, stableswapPoolId)
  );

  const strategyContractStorage = await getStorageInfo<StrategyContractStorage.Root>(
    tezos,
    fixedStrategyContractAddress
  );

  const yupanaAddress = strategyFactoryContractStorage.lending_contract;
  const tokenMap = strategyContractStorage.token_map;

  return {
    yupanaAddress,
    tokenMap
  };
};

export const getYupanaRebalanceParams = async ({
  tezos,
  stableswapContractAddress,
  stableswapPoolId,
  tokensInPool
}: YupanaRebalanceProps) => {
  const { tokenMap, yupanaAddress } = await prepareStrategyInfo({
    tezos,
    stableswapContractAddress,
    stableswapPoolId
  });

  const yupanaContract = await getContract(tezos, yupanaAddress);

  const updateInterestParams = fillIndexArray(tokensInPool).map(id => {
    const tokenInvestmentInfo = tokenMap.get(id);

    const lid = tokenInvestmentInfo?.lending_market_id;
    if (lid) {
      return yupanaContract.methods.updateInterest(lid).toTransferParams();
    }

    return null;
  });

  return updateInterestParams.filter(Boolean);
};
