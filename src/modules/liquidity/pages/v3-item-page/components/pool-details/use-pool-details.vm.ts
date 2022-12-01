import { IS_NETWORK_MAINNET } from '@config/config';
import { EMPTY_STRING, FEE_BPS_PRECISION, SLASH, TESTNET_EXCHANGE_RATE_BN } from '@config/constants';
import { TZKT_EXPLORER_URL } from '@config/environment';
import { isExist } from '@shared/helpers';
import { fractionToPercentage } from '@shared/helpers/percentage';
import { useTokenExchangeRate } from '@shared/hooks';

import { calculateV3ItemTvl, getCurrentPrice, getSymbolsStringByActiveToken } from '../../../../../liquidity/helpers';
import { useLiquidityV3ItemStore, useLiquidityV3ItemTokens } from '../../../../../liquidity/hooks';

export const usePoolDetailsViewModel = () => {
  const store = useLiquidityV3ItemStore();
  const { contractAddress, contractBalance, feeBps, sqrtPrice } = useLiquidityV3ItemStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const { getTokenExchangeRate } = useTokenExchangeRate();

  const { tokenXBalance, tokenYBalance } = contractBalance;

  const tokenXExchangeRate =
    IS_NETWORK_MAINNET && isExist(tokenX) ? getTokenExchangeRate(tokenX) : TESTNET_EXCHANGE_RATE_BN;
  const tokenYExchangeRate =
    IS_NETWORK_MAINNET && isExist(tokenY) ? getTokenExchangeRate(tokenY) : TESTNET_EXCHANGE_RATE_BN;

  const poolTvl = calculateV3ItemTvl(tokenXBalance, tokenYBalance, tokenXExchangeRate, tokenYExchangeRate);

  const feeBpsPercentage = isExist(feeBps) ? fractionToPercentage(feeBps.dividedBy(FEE_BPS_PRECISION)) : null;
  const currentPrice = isExist(sqrtPrice) ? getCurrentPrice(sqrtPrice, store.activeTokenId) : null;

  const symbolsString = getSymbolsStringByActiveToken([tokenX, tokenY], store.activeTokenId);

  const tokenXReservesInfo = {
    tokenSymbol: tokenX?.metadata.symbol ?? EMPTY_STRING,
    tokenAmount: tokenXBalance
  };
  const tokenYReservesInfo = {
    tokenSymbol: tokenY?.metadata.symbol ?? EMPTY_STRING,
    tokenAmount: tokenYBalance
  };

  return {
    poolContractUrl: `${TZKT_EXPLORER_URL}${SLASH}${contractAddress}`,
    tvl: poolTvl,
    feeBps: feeBpsPercentage,
    currentPrice,
    symbolsString,
    tokenXReservesInfo,
    tokenYReservesInfo
  };
};
