import { ChangeEvent, useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { validateUserInput } from '@containers/Liquidity/LiquidityForms/validators/validate-user-input';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { DEFAULT_SLIPPAGE, LP_TOKEN_DECIMALS, TOKEN_TO_TOKEN_DEX } from '@utils/defaults';
import { fromDecimals, toDecimals } from '@utils/helpers';
import { Nullable, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

import { removeLiquidityTokenToToken, removeLiquidityTez } from '../helpers';
import { usePairInfo, useLoadLpTokenBalance, useLoadTokenBalance } from '../hooks';
import { validateUserInputAmount } from '../validators';

export const useRemoveLiquidityService = (
  dex: FoundDex,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  onChangeTokensPair: (tokensPair: WhitelistedTokenPair) => void
) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const pairInfo = usePairInfo(dex, tokenA, tokenB);
  const tokenABalance = useLoadTokenBalance(tokenA);
  const tokenBBalance = useLoadTokenBalance(tokenB);
  const lpTokenBalance = useLoadLpTokenBalance(dex, tokenA, tokenB);

  const [lpTokenInput, setLpTokenInput] = useState<string>('');
  const [tokenAOutput, setTokenAOutput] = useState<string>('');
  const [tokenBOutput, setTokenBOutput] = useState<string>('');
  const [validationError, setValidationError] = useState<string | undefined>();
  const [slippage] = useState<BigNumber>(new BigNumber(DEFAULT_SLIPPAGE));
  const [tokenPair, setTokenPair] = useState<Nullable<WhitelistedTokenPair>>(null);

  useEffect(() => {
    setTokenPair({
      token1: tokenA,
      token2: tokenB,
      dex
    });
    setTokenAOutput('');
    setTokenBOutput('');
  }, [dex, tokenA, tokenB]);

  const handleSetTokenPair = (tokensPair: WhitelistedTokenPair) => {
    onChangeTokensPair(tokensPair);
  };

  useEffect(() => {
    if (!pairInfo) {
      return;
    }

    if (lpTokenInput === '') {
      setTokenAOutput('');
      setTokenBOutput('');

      return;
    }

    const validatedInput = validateUserInput(lpTokenInput);
    const validatedInputAmount = validateUserInputAmount(
      toDecimals(new BigNumber(lpTokenInput), LP_TOKEN_DECIMALS),
      lpTokenBalance
    );

    if (validatedInput) {
      setValidationError(validatedInput);
      setTokenAOutput('');
      setTokenBOutput('');

      return;
    } else if (validatedInputAmount) {
      setValidationError(validatedInputAmount);

      return;
    }

    const { tokenAPool, tokenBPool, totalSupply, tokenA: pairTokenA } = pairInfo;
    const { decimals: decimalsA } = tokenA.metadata;
    const { decimals: decimalsB } = tokenB.metadata;

    const lpTokenBN = new BigNumber(lpTokenInput);
    const lpTokenAmount = toDecimals(lpTokenBN, LP_TOKEN_DECIMALS).integerValue(BigNumber.ROUND_UP);

    const tokenAPerOneLp = tokenAPool.dividedBy(totalSupply);
    const tokenBPerOneLp = tokenBPool.dividedBy(totalSupply);

    const amountTokenA = tokenAPerOneLp.multipliedBy(lpTokenAmount).integerValue(BigNumber.ROUND_DOWN);
    const amountTokenB = tokenBPerOneLp.multipliedBy(lpTokenAmount).integerValue(BigNumber.ROUND_DOWN);

    if (tokenA.contractAddress === pairTokenA.contractAddress) {
      setTokenAOutput(fromDecimals(amountTokenA, decimalsA).toFixed());
      setTokenBOutput(fromDecimals(amountTokenB, decimalsB).toFixed());
    } else {
      setTokenAOutput(fromDecimals(amountTokenB, decimalsB).toFixed());
      setTokenBOutput(fromDecimals(amountTokenA, decimalsA).toFixed());
    }

    setValidationError(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lpTokenInput, pairInfo]);

  const handleBalance = (value: string) => setLpTokenInput(value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setLpTokenInput(event.target.value);

  const handleRemoveLiquidity = async () => {
    if (!tezos || !accountPkh || !pairInfo) {
      return;
    }

    const { id } = pairInfo;

    if (dex.contract.address === TOKEN_TO_TOKEN_DEX && id) {
      await removeLiquidityTokenToToken(tezos, dex, id, lpTokenInput, tokenAOutput, tokenBOutput, tokenA, tokenB);
    } else {
      await removeLiquidityTez(tezos, dex, lpTokenInput, slippage);
    }
  };

  return {
    validationError,
    tokenPair,
    accountPkh,
    lpTokenInput,
    tokenAOutput,
    tokenBOutput,
    tokenABalance,
    tokenBBalance,
    lpTokenBalance,
    handleChange,
    handleBalance,
    handleSetTokenPair,
    handleRemoveLiquidity
  };
};
