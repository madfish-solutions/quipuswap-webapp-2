import { ChangeEvent, useEffect, useState } from 'react';

import { batchify, FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { DEFAULT_SLIPPAGE_PERCENTAGE, LP_TOKEN_DECIMALS, TEZOS_TOKEN, TOKEN_TO_TOKEN_DEX } from '@app.config';
import { useAccountPkh, useTezos } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { fromDecimals, toDecimals } from '@utils/helpers';
import { Nullable, Undefined, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

import { getOperationHash, useLoadLiquidityShare } from '../../hooks';
import { removeLiquidityTez, removeLiquidityTokenToToken } from '../blockchain';
import { getRemoveLiquidityMessage } from '../get-success-messages';
import { getVotingParams } from '../helpers';
import { useLoadTokenBalance, usePairInfo } from '../hooks';
import { INVALID_INPUT, validateOutputAmount, validateTransactionDuration, validations } from '../validators';

export const useRemoveLiquidityService = (
  dex: Nullable<FoundDex>,
  tokenA: Nullable<WhitelistedToken>,
  tokenB: Nullable<WhitelistedToken>,
  transactionDuration: BigNumber,
  onChangeTokensPair: (tokensPair: WhitelistedTokenPair) => void
) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const pairInfo = usePairInfo(dex, tokenA, tokenB);
  const { tokenBalance: tokenABalance, updateTokenBalance: updateTokenABalance } = useLoadTokenBalance(tokenA);
  const { tokenBalance: tokenBBalance, updateTokenBalance: updateTokenBBalance } = useLoadTokenBalance(tokenB);
  const confirmOperation = useConfirmOperation();
  const { share, updateLiquidityShares } = useLoadLiquidityShare(dex, tokenA, tokenB);

  const [lpTokenInput, setLpTokenInput] = useState<string>('');
  const [tokenAOutput, setTokenAOutput] = useState<string>('');
  const [tokenBOutput, setTokenBOutput] = useState<string>('');
  const [validatedInputMessage, setValidatedInputMessage] = useState<Undefined<string>>();
  const [validatedOutputMessageA, setValidatedOutputMessageA] = useState<Undefined<string>>();
  const [validatedOutputMessageB, setValidatedOutputMessageB] = useState<Undefined<string>>();
  const [tokenPair, setTokenPair] = useState<Nullable<WhitelistedTokenPair>>(null);
  const [slippage, setSlippage] = useState<BigNumber>(new BigNumber(DEFAULT_SLIPPAGE_PERCENTAGE));

  useEffect(() => {
    if (!dex || !tokenA || !tokenB) {
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

  const handleSetTokenPair = (tokensPair: WhitelistedTokenPair) => {
    onChangeTokensPair(tokensPair);
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
      share?.total ?? null,
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
  }, [pairInfo, lpTokenInput, share]);

  const handleBalance = (value: string) => {
    const fixedValue = new BigNumber(value).toFixed(LP_TOKEN_DECIMALS);
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
        transactionDuration,
        slippage
      );

      const removeLiquidityMessage = getRemoveLiquidityMessage(tokenA.metadata.name, tokenB.metadata.name);

      const hash = getOperationHash(removeLiquidityTokenToTokenOperation);

      if (hash) {
        await confirmOperation(hash, {
          message: removeLiquidityMessage
        });
      }
    } else {
      const lpTokenInputBN = new BigNumber(lpTokenInput);

      const voteParams = await getVotingParams(tezos, dex, accountPkh, lpTokenInputBN, share);
      const removeLiquidityTezOperation = await removeLiquidityTez(tezos, dex, lpTokenInput, slippage);

      const sentTransaction = await batchify(tezos.wallet.batch([]), [
        ...voteParams,
        ...removeLiquidityTezOperation
      ]).send();

      const { name: tokenAName } = tokenA.metadata;
      const { name: tokenBName } = tokenB.metadata;

      const notTezosTokenName = tokenA.contractAddress === TEZOS_TOKEN.contractAddress ? tokenBName : tokenAName;
      await confirmOperation(sentTransaction.opHash, {
        message: getRemoveLiquidityMessage(TEZOS_TOKEN.metadata.name, notTezosTokenName)
      });
    }
    setLpTokenInput('');
    await Promise.all([
      updateTokenABalance(tokenA),
      updateTokenBBalance(tokenB),
      updateLiquidityShares(dex, tokenA, tokenB)
    ]);
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
    slippage,
    share,
    setSlippage,
    handleChange,
    handleBalance,
    handleSetTokenPair,
    handleRemoveLiquidity
  };
};
