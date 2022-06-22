import { ChangeEvent, useEffect, useState } from 'react';

import { batchify, FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import { noop } from 'rxjs';

import { LP_TOKEN_DECIMALS } from '@config/constants';
import { TOKEN_TO_TOKEN_DEX } from '@config/enviroment';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import {
  fromDecimals,
  toDecimals,
  getRemoveLiquidityMessage,
  getTokenSymbol,
  isUndefined,
  getTokenSlug
} from '@shared/helpers';
import { useLoadingDecorator } from '@shared/hooks';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { amplitudeService } from '@shared/services';
import { Nullable, Optional, Undefined, Token, TokenPair } from '@shared/types';
import { useConfirmOperation } from '@shared/utils';

import { getOperationHash, useLoadLiquidityShare } from '../../hooks';
import { getPairId } from '../add-liquidity-form/use-add-liqudity.service';
import { removeLiquidityTez, removeLiquidityTokenToToken } from '../blockchain/send-transaction';
import { removeExtraZeros, checkIsPoolNotExists } from '../helpers';
import { useLoadTokenBalance, usePairInfo } from '../hooks';
import { INVALID_INPUT, validateOutputAmount, validations } from '../validators';

export const useRemoveLiquidityService = (
  dex: Optional<FoundDex>,
  tokenA: Nullable<Token>,
  tokenB: Nullable<Token>,
  onChangeTokensPair: (tokensPair: TokenPair) => void
) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const {
    settings: { transactionDeadline, liquiditySlippage }
  } = useSettingsStore();

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
  const [isTokenChanging, setIsTokenChanging] = useState(true);

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

    return noop;
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

    const isTokensOrderValid =
      tokenA.contractAddress === pairTokenA.contractAddress && tokenA.fa2TokenId === pairTokenA.fa2TokenId;
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

    return noop;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairInfo, lpTokenInput, share]);

  const handleBalance = (value: string) => {
    const fixedValue = removeExtraZeros(value, LP_TOKEN_DECIMALS);
    setLpTokenInput(fixedValue);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setLpTokenInput(event.target.value);

  const [isLoading, handleRemoveLiquidity] = useLoadingDecorator(async () => {
    if (!tezos || !accountPkh || !pairInfo || !dex || !tokenA || !tokenB) {
      return;
    }

    const { id } = pairInfo;

    if (dex.contract.address === TOKEN_TO_TOKEN_DEX && id) {
      // TOKEN_TO_TOKEN_DEX
      const logData = {
        liquidity: {
          type: 'TOKEN_TO_TOKEN',
          contract: dex.contract.address,
          contractPairId: getPairId(dex, tokenA, tokenB, pairInfo, false),
          tokenASlug: getTokenSlug(tokenA),
          tokenBSlug: getTokenSlug(tokenB),
          tokenASymbol: getTokenSymbol(tokenA),
          tokenBSymbol: getTokenSymbol(tokenB),
          pairInputA: Number(tokenAOutput),
          pairInputB: Number(tokenBOutput),
          totalSupply: Number(pairInfo.totalSupply.toFixed()),
          tokenAPool: Number(pairInfo.tokenAPool.toFixed()),
          tokenBPool: Number(pairInfo.tokenBPool.toFixed()),
          transactionDeadline: Number(transactionDeadline.toFixed()),
          liquiditySlippage: Number(liquiditySlippage.toFixed())
        }
      };

      try {
        amplitudeService.logEvent('LIQUIDITY_REMOVE', logData);
        const removeLiquidityTokenToTokenOperation = await removeLiquidityTokenToToken(
          tezos,
          dex,
          id,
          lpTokenInput,
          tokenAOutput,
          tokenBOutput,
          tokenA,
          tokenB,
          transactionDeadline,
          liquiditySlippage
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

        amplitudeService.logEvent('LIQUIDITY_REMOVE_SUCCESS', logData);
      } catch (error) {
        amplitudeService.logEvent('LIQUIDITY_REMOVE_FAILED', { ...logData, error });
      }
    } else {
      // TEZ_TO_TOKEN_DEX
      const logData = {
        liquidity: {
          type: 'TEZ_TO_TOKEN',
          contract: dex.contract.address,
          contractPairId: getPairId(dex, tokenA, tokenB, pairInfo, false),
          tokenASlug: getTokenSlug(tokenA),
          tokenBSlug: getTokenSlug(tokenB),
          tokenASymbol: getTokenSymbol(tokenA),
          tokenBSymbol: getTokenSymbol(tokenB),
          pairInputA: Number(tokenAOutput),
          pairInputB: Number(tokenBOutput),
          totalSupply: Number(pairInfo.totalSupply.toFixed()),
          tokenAPool: Number(pairInfo.tokenAPool.toFixed()),
          tokenBPool: Number(pairInfo.tokenBPool.toFixed()),
          transactionDeadline: Number(transactionDeadline.toFixed()),
          liquiditySlippage: Number(liquiditySlippage.toFixed())
        }
      };

      try {
        amplitudeService.logEvent('LIQUIDITY_REMOVE', logData);

        const removeLiquidityTezOperation = await removeLiquidityTez(tezos, dex, lpTokenInput, liquiditySlippage);

        const sentTransaction = await batchify(tezos.wallet.batch([]), removeLiquidityTezOperation).send();

        const tokenASymbol = getTokenSymbol(tokenA);
        const tokenBSymbol = getTokenSymbol(tokenB);

        const removeLiquidityMessage = getRemoveLiquidityMessage(tokenASymbol, tokenBSymbol);

        await confirmOperation(sentTransaction.opHash, {
          message: removeLiquidityMessage
        });

        amplitudeService.logEvent('LIQUIDITY_REMOVE_SUCCESS', logData);
      } catch (error) {
        amplitudeService.logEvent('LIQUIDITY_REMOVE_FAILED', { ...logData, error });
      }
    }
    setLpTokenInput('');
    await Promise.all([
      updateTokenABalance(tokenA),
      updateTokenBBalance(tokenB),
      updateLiquidityShares(dex, tokenA, tokenB),
      updatePairInfo(dex, tokenA, tokenB)
    ]);
  });

  return {
    validatedInputMessage,
    validatedOutputMessageA,
    validatedOutputMessageB,
    tokenPair,
    accountPkh,
    lpTokenInput,
    tokenAOutput,
    tokenBOutput,
    tokenABalance,
    tokenBBalance,
    share,
    isPoolNotExist,
    isTokenChanging,
    isSubmiting: isLoading,
    setIsTokenChanging,
    handleChange,
    handleBalance,
    handleSetTokenPair,
    handleRemoveLiquidity
  };
};
