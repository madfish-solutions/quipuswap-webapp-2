import React, {
  useState,
  Dispatch,
  useEffect,
  ChangeEvent,
  SetStateAction,
} from 'react';
import {
  Button,
  Tooltip,
  Switcher,
} from '@quipuswap/ui-kit';
import { FoundDex } from '@quipuswap/sdk';
// import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';

import {
  useTezos,
  useAccountPkh,
} from '@utils/dapp';
import {
  fromDecimals,
  sortTokensContracts,
  getValidMichelTemplate,
} from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Plus } from '@components/svg/Plus';

import { calculateTokenAmount } from '../liquidutyHelpers';
import s from '../Liquidity.module.sass';

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
  // const { t } = useTranslation(['common', 'liquidity']);
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [tokenAInput, setTokenAInput] = useState<string>('');
  const [tokenBInput, setTokenBInput] = useState<string>('');
  const [pairId, setPairId] = useState<BigNumber>();
  const [pairData, setPairDataInfo] = useState<{
    totalSupply: BigNumber,
    tokenAPool: BigNumber,
    tokenBPool: BigNumber,
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadPairData = async () => {
      if (!dex) return;

      const addresses = sortTokensContracts(tokenA, tokenB);
      if (!addresses) return;

      const michelData = getValidMichelTemplate(addresses);
      const key = Buffer.from(MichelCodec.packData(michelData)).toString('hex');

      const pairIdTemp = await dex.storage.storage.token_to_id.get(key);

      if (pairIdTemp) {
        const pairDataTemp = await dex.storage.storage.pairs.get(pairIdTemp);
        if (isMounted) {
          setPairId(pairIdTemp);
          setPairDataInfo({
            totalSupply: pairDataTemp.total_supply,
            tokenAPool: pairDataTemp.token_a_pool,
            tokenBPool: pairDataTemp.token_b_pool,
          });
        }
      } else if (!pairIdTemp && isMounted) {
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
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const tokenAmount = calculateTokenAmount(
        new BigNumber(event.target.value),
        pairData.totalSupply,
        pairData.tokenAPool,
        pairData.tokenBPool,
      );

      setTokenBInput(
        fromDecimals(tokenAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals),
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
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const tezAmount = calculateTokenAmount(
        new BigNumber(event.target.value),
        pairData.totalSupply,
        pairData.tokenBPool,
        pairData.tokenAPool,
      );

      setTokenAInput(
        fromDecimals(tezAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals),
      );
    }
  };

  const handleTokenABalance = (value:string) => {
    const fixedValue = new BigNumber(value);

    setTokenAInput(fixedValue.toFixed(tokenA.metadata.decimals));

    if (
      pairData
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const tokenAmount = calculateTokenAmount(
        fixedValue,
        pairData.totalSupply,
        pairData.tokenAPool,
        pairData.tokenBPool,
      );

      setTokenBInput(
        fromDecimals(tokenAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals),
      );
    }
  };

  const handleTokenBBalance = (value:string) => {
    const fixedValue = new BigNumber(value);

    setTokenBInput(fixedValue.toFixed(tokenB.metadata.decimals));

    if (
      pairData
      && pairData.tokenAPool.gt(0)
      && pairData.tokenBPool.gt(0)
      && pairData.totalSupply.gt(0)
    ) {
      const tezAmount = calculateTokenAmount(
        fixedValue,
        pairData.totalSupply,
        pairData.tokenBPool,
        pairData.tokenAPool,
      );

      setTokenAInput(
        fromDecimals(tezAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals),
      );
    }
  };

  const handleAddLiquidity = async () => {
    if (!tezos || !accountPkh || !dex) return;

    if (pairId && pairData) {
      const shares = new BigNumber(tokenAInput)
        .multipliedBy(1_000_000)
        .multipliedBy(pairData.totalSupply)
        .idiv(pairData.tokenAPool);

      const tokenBIn = shares
        .multipliedBy(pairData.tokenBPool)
        .idiv(pairData.totalSupply);

      await dex.contract.methods.invest(
        pairId,
        shares,
        new BigNumber(tokenAInput).multipliedBy(1_000_000),
        tokenBIn,
      ).send();
    } else {
      const addresses = sortTokensContracts(tokenA, tokenB);
      if (!addresses) return;

      const tokenAContract = await tezos.wallet.at(addresses.addressA);
      const tokenBContract = await tezos.wallet.at(addresses.addressB);

      const validTokenA = addresses.addressA === tokenA.contractAddress
        ? tokenA
        : tokenB;
      const validTokenB = addresses.addressB === tokenB.contractAddress
        ? tokenB
        : tokenA;

      const batch = await tezos.wallet.batch()
        .withContractCall(tokenAContract.methods.update_operators([{
          add_operator: {
            operator: dex.contract.address,
            owner: accountPkh,
            token_id: tokenA.fa2TokenId,
          },
        }]))
        .withContractCall(tokenBContract.methods.update_operators([{
          add_operator: {
            operator: dex.contract.address,
            owner: accountPkh,
            token_id: tokenB.fa2TokenId,
          },
        }]))
        .withContractCall(dex.contract.methods.addPair(
          validTokenA.type,
          validTokenA.contractAddress,
          validTokenA.fa2TokenId,
          validTokenB.type,
          validTokenB.contractAddress,
          validTokenB.fa2TokenId,
          new BigNumber(tokenAInput).multipliedBy(1_000_000),
          new BigNumber(tokenBInput).multipliedBy(1_000_000),
        ));

      await batch.send();
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
      <div className={s.switcher}>
        <Switcher isActive={false} onChange={() => {}} />
        <span className={s.rebalance}>Rebalance Liq</span>
        <Tooltip content="Liquidity rebalace description" />
      </div>
      <Button
        className={s.button}
        onClick={handleAddLiquidity}
      >
        Add
      </Button>
    </>
  );
};
