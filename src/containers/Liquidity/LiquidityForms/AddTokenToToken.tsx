import React, {
  useState,
  Dispatch,
  useEffect,
  ChangeEvent,
  SetStateAction,
} from 'react';
import {
  Button,
} from '@quipuswap/ui-kit';
import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {
  useTezos,
  useAccountPkh,
} from '@utils/dapp';
import { fromDecimals } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Plus } from '@components/svg/Plus';

import {
  sortTokensContracts,
  calculateTokenAmount,
  getValidMichelTemplate,
} from '../liquidutyHelpers';
import s from '../Liquidity.module.sass';
import { addLiquidityTokenToToken } from '../liquidutyHelpers/addLiquidityTokenToToken';

const MichelCodec = require('@taquito/michel-codec');

type AddTokenToTokenProps = {
  dex: FoundDex | null;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  setTokenA: Dispatch<SetStateAction<WhitelistedToken>>;
  setTokenB: Dispatch<SetStateAction<WhitelistedToken>>;
  tokenABalance: string;
  tokenBBalance: string;
};

export const AddTokenToToken:React.FC<AddTokenToTokenProps> = ({
  dex,
  tokenA,
  tokenB,
  setTokenA,
  setTokenB,
  tokenABalance,
  tokenBBalance,
}) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [tokenAInput, setTokenAInput] = useState<string>('');
  const [tokenBInput, setTokenBInput] = useState<string>('');
  const [validTokenA, setValidTokenA] = useState<WhitelistedToken | null>(null);
  const [validTokenB, setValidTokenB] = useState<WhitelistedToken | null>(null);
  const [pairId, setPairId] = useState<BigNumber>();
  const [pairData, setPairDataInfo] = useState<{
    totalSupply: BigNumber,
    tokenAPool: BigNumber,
    tokenBPool: BigNumber,
  } | null>(null);

  useEffect(() => {
    const sortedTokens = sortTokensContracts(tokenA, tokenB);
    if (!sortedTokens) return;
    setValidTokenA(sortedTokens.addressA === tokenA.contractAddress ? tokenA : tokenB);
    setValidTokenB(sortedTokens.addressB === tokenB.contractAddress ? tokenB : tokenA);
  }, [tokenA, tokenB]);

  useEffect(() => {
    let isMounted = true;
    const loadPairData = async () => {
      if (!dex) return;

      const addresses = sortTokensContracts(tokenA, tokenB);
      if (!addresses) return;

      const michelData = getValidMichelTemplate(addresses);
      const key = Buffer.from(MichelCodec.packData(michelData)).toString('hex');

      const id = await dex.storage.storage.token_to_id.get(key);

      if (id) {
        const data = await dex.storage.storage.pairs.get(id);
        if (isMounted) {
          setPairId(id);
          setPairDataInfo({
            totalSupply: data.total_supply,
            tokenAPool: data.token_a_pool,
            tokenBPool: data.token_b_pool,
          });
        }
      } else if (!id && isMounted) {
        setPairDataInfo(null);
      }
    };
    loadPairData();
    return () => { isMounted = false; };
  }, [dex]);

  const handleTokenAInput = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenAInput(event.target.value);

    if (event.target.value === '') {
      setTokenBInput('');
      return;
    }

    if (
      pairData
      && validTokenA
      && validTokenB
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const decimalsA = new BigNumber(10).pow(tokenA.metadata.decimals);
      const tokenAAmountWithDecimals = new BigNumber(event.target.value).multipliedBy(decimalsA);
      const tokenBAmount = tokenA.contractAddress === validTokenA.contractAddress
        ? calculateTokenAmount(
          tokenAAmountWithDecimals,
          pairData.totalSupply,
          pairData.tokenAPool,
          pairData.tokenBPool,
        )
        : calculateTokenAmount(
          tokenAAmountWithDecimals,
          pairData.totalSupply,
          pairData.tokenBPool,
          pairData.tokenAPool,
        );

      setTokenBInput(
        fromDecimals(tokenBAmount, tokenB.metadata.decimals)
          .toFixed(tokenB.metadata.decimals),
      );
    }
  };
  const handleTokenBInput = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenBInput(event.target.value);

    if (event.target.value === '') {
      setTokenAInput('');
      return;
    }

    if (
      pairData
      && validTokenA
      && validTokenB
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const decimalsB = new BigNumber(10).pow(tokenB.metadata.decimals);
      const tokenAAmount = tokenB.contractAddress === validTokenB.contractAddress
        ? calculateTokenAmount(
          new BigNumber(event.target.value).multipliedBy(decimalsB),
          pairData.totalSupply,
          pairData.tokenBPool,
          pairData.tokenAPool,
        )
        : calculateTokenAmount(
          new BigNumber(event.target.value).multipliedBy(decimalsB),
          pairData.totalSupply,
          pairData.tokenAPool,
          pairData.tokenBPool,
        );

      setTokenAInput(
        fromDecimals(tokenAAmount, tokenA.metadata.decimals)
          .toFixed(validTokenA.metadata.decimals),
      );
    }
  };

  const handleTokenABalance = (value:string) => {
    const tokenAAmount = new BigNumber(value);

    setTokenAInput(tokenAAmount.toFixed(tokenA.metadata.decimals));

    if (
      pairData
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
      && validTokenB
    ) {
      const decimalsA = new BigNumber(10).pow(tokenA.metadata.decimals);
      const tokenAAmountWithDecimals = tokenAAmount.multipliedBy(decimalsA);
      const tokenBAmount = tokenB.contractAddress === validTokenB.contractAddress
        ? calculateTokenAmount(
          tokenAAmountWithDecimals,
          pairData.totalSupply,
          pairData.tokenAPool,
          pairData.tokenBPool,
        )
        : calculateTokenAmount(
          tokenAAmountWithDecimals,
          pairData.totalSupply,
          pairData.tokenBPool,
          pairData.tokenAPool,
        );

      setTokenBInput(
        fromDecimals(tokenBAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals),
      );
    }
  };
  const handleTokenBBalance = (value:string) => {
    const tokenBAmount = new BigNumber(value);

    setTokenBInput(tokenBAmount.toFixed(tokenB.metadata.decimals));

    if (
      pairData
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
      && validTokenA
    ) {
      const decimalsB = new BigNumber(10).pow(tokenB.metadata.decimals);
      const tokenBAmountWithDecimals = tokenBAmount.multipliedBy(decimalsB);
      const tokenAAmount = tokenA.contractAddress === validTokenA.contractAddress
        ? calculateTokenAmount(
          tokenBAmountWithDecimals,
          pairData.totalSupply,
          pairData.tokenBPool,
          pairData.tokenAPool,
        )
        : calculateTokenAmount(
          tokenBAmountWithDecimals,
          pairData.totalSupply,
          pairData.tokenAPool,
          pairData.tokenBPool,
        );

      setTokenAInput(
        fromDecimals(tokenAAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals),
      );
    }
  };

  const handleAddLiquidity = async () => {
    if (!tezos || !accountPkh || !dex || !validTokenA || !validTokenB) return;
    const ten = new BigNumber(10);

    if (
      pairId
      && pairData
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const shares = new BigNumber(tokenAInput)
        .multipliedBy(ten.pow(validTokenA.metadata.decimals))
        .multipliedBy(pairData.totalSupply)
        .idiv(pairData.tokenAPool);

      const tokenAAmount = new BigNumber(tokenAInput)
        .multipliedBy(ten.pow(validTokenA.metadata.decimals));

      const tokenBAmount = shares
        .multipliedBy(pairData.tokenBPool)
        .div(pairData.totalSupply)
        .integerValue(BigNumber.ROUND_CEIL);

      const finalCurrentTime = (await tezos.rpc.getBlockHeader()).timestamp;
      const timestamp = new Date(finalCurrentTime).getTime() / 1000 + 900;

      await dex.contract.methods.invest(
        pairId,
        shares,
        tokenAAmount,
        tokenBAmount,
        timestamp.toString(),
      ).send();
    } else if (validTokenA.contractAddress === tokenA.contractAddress) {
      addLiquidityTokenToToken(
        tezos,
        dex,
        accountPkh,
        tokenA,
        tokenB,
        tokenAInput,
        tokenBInput,
      );
    } else {
      addLiquidityTokenToToken(
        tezos,
        dex,
        accountPkh,
        tokenB,
        tokenA,
        tokenAInput,
        tokenBInput,
      );
    }
  };

  return (
    <>
      <TokenSelect
        label="Input"
        balance={tokenABalance}
        token={tokenA}
        setToken={setTokenA}
        value={tokenAInput}
        onInput={handleTokenAInput}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={handleTokenABalance}
        noBalanceButtons={!accountPkh}
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Input"
        balance={tokenBBalance}
        token={tokenB}
        setToken={setTokenB}
        value={tokenBInput}
        onInput={handleTokenBInput}
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={handleTokenBBalance}
        noBalanceButtons={!accountPkh}
      />
      <Button
        className={s.button}
        onClick={handleAddLiquidity}
      >
        Add
      </Button>
    </>
  );
};
