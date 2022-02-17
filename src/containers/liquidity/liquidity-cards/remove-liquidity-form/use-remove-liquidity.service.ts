import { ChangeEvent, useEffect, useState } from 'react';

import { batchify, FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { LP_TOKEN_DECIMALS, TOKEN_TO_TOKEN_DEX } from '@app.config';
import { Nullable, Optional, Undefined, RawToken, TokenPair } from '@interfaces/types';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { useDeadline, useSlippage } from '@utils/dapp/slippage-deadline';
import { fromDecimals, toDecimals, getRemoveLiquidityMessage, getTokenSymbol, isUndefined } from '@utils/helpers';

import { getOperationHash, useLoadLiquidityShare } from '../../hooks';
import { removeLiquidityTez, removeLiquidityTokenToToken } from '../blockchain';
import { removeExtraZeros, checkIsPoolNotExists } from '../helpers';
import { useLoadTokenBalance, usePairInfo } from '../hooks';
import { INVALID_INPUT, validateDeadline, validateOutputAmount, validations, validateSlippage } from '../validators';

export const useRemoveLiquidityService = (
  dex: Optional<FoundDex>,
  tokenA: Nullable<RawToken>,
  tokenB: Nullable<RawToken>,
  onChangeTokensPair: (tokensPair: TokenPair) => void
) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { deadline } = useDeadline();
  const { slippage } = useSlippage();
  const { pairInfo, updatePairInfo } = usePairInfo(dex, tokenA, tokenB);
  const { tokenBalance: tokenABalance, updateTokenBalance: updateTokenABalance } = useLoadTokenBalance(tokenA);
  const { tokenBalance: tokenBBalance, updateTokenBalance: updateTokenBBalance } = useLoadTokenBalance(tokenB);
  const confirmOperation = useConfirmOperation();
  const { share, updateLiquidityShares, clearShares } = useLoadLiquidityShare(dex, tokenA, tokenB);

  const [lpTokenInput, setLpTokenInput] = useState<string>('');
  const [tokenAOutput, setTokenAOutput] = useState<string>('');
  const [tokenBOutput, setTokenBOutput] = useState<string>('');
  const [validatedInputMessage, setValidatedInputMessage] = useState<Undefined<string>>();
  const [validatedOutputMessageA, setValidatedOutputMessageA] = useState<Undefined<string>>();
  const [validatedOutputMessageB, setValidatedOutputMessageB] = useState<Undefined<string>>();
  const [tokenPair, setTokenPair] = useState<Nullable<TokenPair>>(null);

  const isPoolNotExist = !isUndefined(pairInfo) && checkIsPoolNotExists(pairInfo);

  useEffect(() => {
    if (!tokenA || !tokenB) {
      setTokenAOutput('');
      setTokenBOutput('');
      setValidatedInputMessage(undefined);

      return;
    }

    setTokenPair({
      token1: tokenA,
      token2: tokenB,
      dex
    });
    setTokenAOutput('');
    setTokenBOutput('');
    setValidatedInputMessage(undefined);
    setValidatedOutputMessageA(undefined);
    setValidatedOutputMessageB(undefined);
  }, [dex, tokenA, tokenB]);

  const handleSetTokenPair = (tokensPair: TokenPair) => {
    onChangeTokensPair(tokensPair);
    clearShares();
  };

  useEffect(() => {
    if (!dex || !tokenA || !tokenB || lpTokenInput === '') {
      setTokenAOutput('');
      setTokenBOutput('');
      setValidatedInputMessage(undefined);

      return;
    }
    const lpTokenInputBN = new BigNumber(lpTokenInput);
    const lpTokenAmount = toDecimals(lpTokenInputBN, LP_TOKEN_DECIMALS).integerValue(BigNumber.ROUND_UP);

    const lpTokenSymbol = `${tokenA.metadata.symbol}/${tokenB.metadata.symbol} LP`;
    const validatedInput = validations(
      accountPkh,
      lpTokenInputBN,
      share?.unfrozen ?? null,
      lpTokenInput,
      LP_TOKEN_DECIMALS,
      lpTokenSymbol
    );
    setValidatedInputMessage(validatedInput);

    if (validatedInput === INVALID_INPUT) {
      setTokenAOutput('');
      setTokenBOutput('');

      return;
    }

    if (!pairInfo) {
      return;
    }

    const { decimals: decimalsA } = tokenA.metadata;
    const { decimals: decimalsB } = tokenB.metadata;
    const { tokenAPool, tokenBPool, totalSupply, tokenA: pairTokenA } = pairInfo;

    const isTokensOrderValid = pairTokenA.contractAddress === tokenA.contractAddress;
    const validTokenAPool = isTokensOrderValid ? tokenAPool : tokenBPool;
    const validTokenBPool = isTokensOrderValid ? tokenBPool : tokenAPool;

    const tokenAPerOneLp = validTokenAPool.dividedBy(totalSupply);
    const tokenBPerOneLp = validTokenBPool.dividedBy(totalSupply);
    const amountTokenA = tokenAPerOneLp.multipliedBy(lpTokenAmount).integerValue(BigNumber.ROUND_DOWN);
    const amountTokenB = tokenBPerOneLp.multipliedBy(lpTokenAmount).integerValue(BigNumber.ROUND_DOWN);

    const validatedOutputA = validateOutputAmount(amountTokenA);
    const validatedOutputB = validateOutputAmount(amountTokenB);

    setValidatedOutputMessageA(validatedOutputA);
    setValidatedOutputMessageB(validatedOutputB);

    if (!isNaN(amountTokenA.toNumber())) {
      setTokenAOutput(fromDecimals(amountTokenA, decimalsA).toFixed());
    }

    if (!isNaN(amountTokenB.toNumber())) {
      setTokenBOutput(fromDecimals(amountTokenB, decimalsB).toFixed());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairInfo, lpTokenInput, share]);

  const handleBalance = (value: string) => {
    const fixedValue = removeExtraZeros(value, LP_TOKEN_DECIMALS);
    setLpTokenInput(fixedValue);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setLpTokenInput(event.target.value);

  const handleRemoveLiquidity = async () => {
    if (!tezos || !accountPkh || !pairInfo || !dex || !tokenA || !tokenB) {
      return;
    }

    const { id } = pairInfo;

    if (dex.contract.address === TOKEN_TO_TOKEN_DEX && id) {
      const removeLiquidityTokenToTokenOperation = await removeLiquidityTokenToToken(
        tezos,
        dex,
        id,
        lpTokenInput,
        tokenAOutput,
        tokenBOutput,
        tokenA,
        tokenB,
        deadline,
        slippage
      );

      const hash = getOperationHash(removeLiquidityTokenToTokenOperation);

      if (hash) {
        const tokenASymbol = getTokenSymbol(tokenA);
        const tokenBSymbol = getTokenSymbol(tokenB);

        const removeLiquidityMessage = getRemoveLiquidityMessage(tokenASymbol, tokenBSymbol);

        await confirmOperation(hash, {
          message: removeLiquidityMessage
        });
      }
    } else {
      const removeLiquidityTezOperation = await removeLiquidityTez(tezos, dex, lpTokenInput, slippage);

      const sentTransaction = await batchify(tezos.wallet.batch([]), removeLiquidityTezOperation).send();

      const tokenASymbol = getTokenSymbol(tokenA);
      const tokenBSymbol = getTokenSymbol(tokenB);

      const removeLiquidityMessage = getRemoveLiquidityMessage(tokenASymbol, tokenBSymbol);

      await confirmOperation(sentTransaction.opHash, {
        message: removeLiquidityMessage
      });
    }
    setLpTokenInput('');
    await Promise.all([
      updateTokenABalance(tokenA),
      updateTokenBBalance(tokenB),
      updateLiquidityShares(dex, tokenA, tokenB),
      updatePairInfo(dex, tokenA, tokenB)
    ]);
  };

  const validationMessageDeadline = validateDeadline(deadline);
  const validationMessageSlippage = validateSlippage(slippage);

  return {
    validatedInputMessage,
    validatedOutputMessageA,
    validatedOutputMessageB,
    validationMessageDeadline,
    validationMessageSlippage,
    tokenPair,
    accountPkh,
    lpTokenInput,
    tokenAOutput,
    tokenBOutput,
    tokenABalance,
    tokenBBalance,
    share,
    isPoolNotExist,
    handleChange,
    handleBalance,
    handleSetTokenPair,
    handleRemoveLiquidity
  };
};
