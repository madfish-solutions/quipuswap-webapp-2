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
import { FoundDex, Token } from '@quipuswap/sdk';
// import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';

import {
  useTezos,
  useAccountPkh,
} from '@utils/dapp';
import {
  WhitelistedToken,
} from '@utils/types';
import {
  fromDecimals,
  sortTokensContracts,
  findNotTezTokenInPair,
  getValidMichelTemplate,
} from '@utils/helpers';
import { TEZOS_TOKEN } from '@utils/defaults';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Plus } from '@components/svg/Plus';

import {
  addLiquidity,
  calculateTokenAmount,
} from '../liquidutyHelpers';
import { initializeLiquidity } from '../liquidutyHelpers/initializeLiquidity';
import s from '../Liquidity.module.sass';

const MichelCodec = require('@taquito/michel-codec');

type LiquidityFormProps = {
  dexInfo: { dex:FoundDex | null, isTezosToTokenDex:boolean };
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  setTokenA: Dispatch<SetStateAction<WhitelistedToken>>;
  setTokenB: Dispatch<SetStateAction<WhitelistedToken>>;
  tokenABalance: string;
  tokenBBalance: string;
};

export const LiquidityFormAdd:React.FC<LiquidityFormProps> = ({
  dexInfo,
  tokenA,
  tokenB,
  setTokenA,
  setTokenB,
  tokenABalance,
  tokenBBalance,
}) => {
  const { dex, isTezosToTokenDex } = dexInfo;
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
  }>({
    totalSupply: new BigNumber(0),
    tokenAPool: new BigNumber(0),
    tokenBPool: new BigNumber(0),
  });

  useEffect(() => {
    let isMounted = true;
    const loadPairData = async () => {
      if (isTezosToTokenDex) {
        if (!dex) return;

        setPairDataInfo({
          totalSupply: dex.storage.storage.total_supply,
          tokenAPool: dex.storage.storage.tez_pool,
          tokenBPool: dex.storage.storage.token_pool,
        });
      } else if (!isTezosToTokenDex) {
        if (!dex) return;
        const addresses = sortTokensContracts(tokenA, tokenB);

        if (!addresses) return;

        const michelData = getValidMichelTemplate(addresses);
        const key = Buffer.from(MichelCodec.packData(michelData)).toString('hex');

        const pairIdTemp = await dex.storage.storage.token_to_id.get(key);
        const pairDataTemp = await dex.storage.storage.pairs.get(pairIdTemp);

        if (isMounted) {
          setPairId(pairIdTemp);
          setPairDataInfo({
            totalSupply: pairDataTemp.total_supply,
            tokenAPool: pairDataTemp.token_a_pool,
            tokenBPool: pairDataTemp.token_b_pool,
          });
        }
      }
    };
    loadPairData();
    return () => { isMounted = false; };
  }, [dex, isTezosToTokenDex]);

  const handleTokenAChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenAInput(event.target.value);

    if (event.target.value === '') {
      setTokenBInput('');
      return;
    }

    const tokenAmount = calculateTokenAmount(
      new BigNumber(event.target.value),
      pairData.totalSupply,
      pairData.tokenAPool,
      pairData.tokenBPool,
    );

    setTokenBInput(
      fromDecimals(tokenAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals),
    );
  };

  const handleTokenBChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenBInput(event.target.value);

    if (event.target.value === '') {
      setTokenAInput('');
      return;
    }

    const tezAmount = calculateTokenAmount(
      new BigNumber(event.target.value),
      pairData.totalSupply,
      pairData.tokenBPool,
      pairData.tokenAPool,
    );

    setTokenAInput(
      fromDecimals(tezAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals),
    );
  };

  const handleTokenABalance = (value:string) => {
    const fixedValue = new BigNumber(value);
    const tokenAmount = calculateTokenAmount(
      fixedValue,
      pairData.totalSupply,
      pairData.tokenAPool,
      pairData.tokenBPool,
    );

    setTokenAInput(fixedValue.toFixed(tokenA.metadata.decimals));
    setTokenBInput(
      fromDecimals(tokenAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals),
    );
  };

  const handleTokenBBalance = (value:string) => {
    const fixedValue = new BigNumber(value);
    const tezAmount = calculateTokenAmount(
      fixedValue,
      pairData.totalSupply,
      pairData.tokenBPool,
      pairData.tokenAPool,
    );

    setTokenBInput(fixedValue.toFixed(tokenB.metadata.decimals));
    setTokenAInput(
      fromDecimals(tezAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals),
    );
  };

  const handleAddLiquidity = async () => {
    if (!tezos || !accountPkh) return;

    if (isTezosToTokenDex) {
      const notTezToken = findNotTezTokenInPair(tokenA, tokenB);

      const tezInput = tokenA.contractAddress === TEZOS_TOKEN.contractAddress
        ? tokenAInput
        : tokenBInput;
      const tokenInput = tokenA.contractAddress !== TEZOS_TOKEN.contractAddress
        ? tokenAInput
        : tokenBInput;

      const tezDecimals = new BigNumber(10).pow(TEZOS_TOKEN.metadata.decimals);
      const tezValue = new BigNumber(tezInput)
        .multipliedBy(tezDecimals);

      if (dex) {
        await addLiquidity(tezos, dex, tezValue);
      } else {
        const token:Token = {
          contract: notTezToken.contractAddress,
          id: notTezToken.fa2TokenId,
        };
        const tokenBDecimals = new BigNumber(10).pow(notTezToken.metadata.decimals);
        const tokenBValue = new BigNumber(tokenInput).multipliedBy(tokenBDecimals);
        await initializeLiquidity(tezos, token, tokenBValue, tezValue);
      }
    } else if (!isTezosToTokenDex) {
      if (!dex) return;

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
        onChange={handleTokenAChange}
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
        onChange={handleTokenBChange}
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
