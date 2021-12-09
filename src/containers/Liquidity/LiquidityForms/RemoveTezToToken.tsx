import React, {
  useState,
  Dispatch,
  useEffect,
  ChangeEvent,
  SetStateAction,
} from 'react';
import {
  Plus,
  Button,
  Slippage,
  ArrowDown,
} from '@quipuswap/ui-kit';
import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {
  useTezos,
  useAccountPkh,
} from '@utils/dapp';
import { WhitelistedToken } from '@utils/types';
import { noOpFunc, slippageToBignum } from '@utils/helpers';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';

import { TEZOS_TOKEN } from '@utils/defaults';
import { getBlackListedTokens } from '@components/ui/ComplexInput/utils';
import { removeLiquidity } from '../liquidutyHelpers';
import s from '../Liquidity.module.sass';

type RemoveTezToTokenProps = {
  dex: FoundDex | null;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  setTokenA: Dispatch<SetStateAction<WhitelistedToken>>;
  setTokenB: Dispatch<SetStateAction<WhitelistedToken>>;
  tokenABalance: string;
  tokenBBalance: string;
  lpTokenBalance: string;
};

export const RemoveTezToToken: React.FC<RemoveTezToTokenProps> = ({
  dex,
  tokenA,
  tokenB,
  setTokenA,
  setTokenB,
  tokenABalance,
  tokenBBalance,
  lpTokenBalance,
}) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [lpTokenInput, setLpTokenInput] = useState<string>('');
  const [tokenAOutput, setTokenAOutput] = useState<string>('');
  const [tokenBOutput, setTokenBOutput] = useState<string>('');
  const [slippage, setSlippage] = useState<BigNumber>(new BigNumber(0.005));

  useEffect(() => {
    if (!dex) return;
    if (lpTokenInput === '') {
      setTokenAOutput('');
      setTokenBOutput('');
      return;
    }

    const tezPerOneLp = dex.storage.storage.tez_pool
      .dividedBy(dex.storage.storage.total_supply);

    const quipuPerOneLp = dex.storage.storage.token_pool
      .dividedBy(dex.storage.storage.total_supply);

    const isTokenATez = tokenA.contractAddress === TEZOS_TOKEN.contractAddress;

    if (isTokenATez) {
      setTokenAOutput(tezPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenA.metadata.decimals));
      setTokenBOutput(quipuPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenB.metadata.decimals));
    } else {
      setTokenAOutput(quipuPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenA.metadata.decimals));
      setTokenBOutput(tezPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenB.metadata.decimals));
    }
  }, [lpTokenInput, dex, tokenA, tokenB]);

  const handleSlippageChange = (value: string) => {
    const fixedValue = slippageToBignum(value);
    if (fixedValue.gte(100)) {
      return setSlippage(new BigNumber(100));
    }

    return setSlippage(fixedValue);
  };

  const handleRemoveLiquidity = async () => {
    if (!tezos || !accountPkh || !dex) return;

    await removeLiquidity(
      tezos,
      dex,
      new BigNumber(lpTokenInput),
      slippage,
    );
    setLpTokenInput('');
  };

  return (
    <>
      <TokenSelect
        label="Select LP"
        balance={lpTokenBalance}
        token={tokenA}
        token2={tokenB}
        setToken={setTokenB}
        value={lpTokenInput}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setLpTokenInput(event.target.value)}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={(value) => {
          const fixedValue = new BigNumber(value);
          setLpTokenInput(fixedValue.toFixed());
        }}
      />
      <ArrowDown className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance={tokenABalance}
        token={tokenA}
        setToken={setTokenA}
        value={tokenAOutput}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={noOpFunc}
        noBalanceButtons
        disabled
      />
      <Plus className={s.iconButton} />
      <TokenSelect
        label="Output"
        balance={tokenBBalance}
        token={tokenB}
        setToken={setTokenB}
        value={tokenBOutput}
        blackListedTokens={getBlackListedTokens(tokenA, tokenB)}
        handleBalance={noOpFunc}
        noBalanceButtons
        disabled
      />
      <Slippage handleChange={handleSlippageChange} />
      <Button
        className={s.button}
        onClick={handleRemoveLiquidity}
      >
        Remove
      </Button>
    </>
  );
};
