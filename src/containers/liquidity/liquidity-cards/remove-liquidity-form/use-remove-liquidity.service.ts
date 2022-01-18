import { ChangeEvent, useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { DEFAULT_SLIPPAGE_PERCENTAGE, LP_TOKEN_DECIMALS, TEZOS_TOKEN, TOKEN_TO_TOKEN_DEX } from '@app.config';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { fromDecimals, toDecimals } from '@utils/helpers';
import { Nullable, Undefined, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

import { getOperationHash } from '../../hooks/get-operation-hash';
import { removeLiquidityTez, removeLiquidityTokenToToken } from '../blockchain';
import { getRemoveLiquidityMessage } from '../get-success-messages';
import { useLoadLpTokenBalance, useLoadTokenBalance, usePairInfo } from '../hooks';
import { validateOutputAmount, validateTransactionDuration, validations } from '../validators';
import { INVALID_INPUT } from '../validators/validate-user-input';

export const useRemoveLiquidityService = (
  dex: FoundDex,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  onChangeTokensPair: (tokensPair: WhitelistedTokenPair) => void,
  transactionDuration: BigNumber
) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const pairInfo = usePairInfo(dex, tokenA, tokenB);
  const tokenABalance = useLoadTokenBalance(tokenA);
  const tokenBBalance = useLoadTokenBalance(tokenB);
  const lpTokenBalance = useLoadLpTokenBalance(dex, tokenA, tokenB);
  const confirmOperation = useConfirmOperation();

  const [lpTokenInput, setLpTokenInput] = useState<string>('');
  const [tokenAOutput, setTokenAOutput] = useState<string>('');
  const [tokenBOutput, setTokenBOutput] = useState<string>('');
  const [validatedInputMessage, setValidatedInputMessage] = useState<Undefined<string>>();
  const [validatedOutputMessageA, setValidatedOutputMessageA] = useState<Undefined<string>>();
  const [validatedOutputMessageB, setValidatedOutputMessageB] = useState<Undefined<string>>();
  const [tokenPair, setTokenPair] = useState<Nullable<WhitelistedTokenPair>>(null);
  const [slippage, setSlippage] = useState<BigNumber>(new BigNumber(DEFAULT_SLIPPAGE_PERCENTAGE));

  useEffect(() => {
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

  const handleSetTokenPair = (tokensPair: WhitelistedTokenPair) => {
    onChangeTokensPair(tokensPair);
  };

  useEffect(() => {
    if (lpTokenInput === '') {
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
      lpTokenBalance,
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
    setTokenAOutput(fromDecimals(amountTokenA, decimalsA).toFixed());
    setTokenBOutput(fromDecimals(amountTokenB, decimalsB).toFixed());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairInfo, lpTokenInput, lpTokenBalance]);

  const handleBalance = (value: string) => {
    const fixedValue = new BigNumber(value).toFixed(LP_TOKEN_DECIMALS);
    setLpTokenInput(fixedValue);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setLpTokenInput(event.target.value);

  const handleRemoveLiquidity = async () => {
    if (!tezos || !accountPkh || !pairInfo) {
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
        transactionDuration,
        slippage
      );

      const removeLiquidityMessage = getRemoveLiquidityMessage(tokenA.metadata.name, tokenB.metadata.name);

      const hash = getOperationHash(removeLiquidityTokenToTokenOperation!);

      if (hash) {
        await confirmOperation(hash, {
          message: removeLiquidityMessage
        });
      }
    } else {
      const removeLiquidityTezOperation = await removeLiquidityTez(tezos, dex, lpTokenInput, slippage);

      const { name: tokenAName } = tokenA.metadata;
      const { name: tokenBName } = tokenB.metadata;

      const notTezosTokenName = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenBName : tokenAName;
      await confirmOperation(removeLiquidityTezOperation.opHash, {
        message: getRemoveLiquidityMessage(TEZOS_TOKEN.metadata.name, notTezosTokenName)
      });
    }
  };

  const validationMessageTransactionDuration = validateTransactionDuration(transactionDuration);

  return {
    validatedInputMessage,
    validatedOutputMessageA,
    validatedOutputMessageB,
    validationMessageTransactionDuration,
    tokenPair,
    accountPkh,
    lpTokenInput,
    tokenAOutput,
    tokenBOutput,
    tokenABalance,
    tokenBBalance,
    lpTokenBalance,
    slippage,
    setSlippage,
    handleChange,
    handleBalance,
    handleSetTokenPair,
    handleRemoveLiquidity
  };
};
