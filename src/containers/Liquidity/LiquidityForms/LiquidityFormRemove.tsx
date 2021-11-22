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
import { FoundDex, Token } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {
  useTezos,
  useNetwork,
  useAccountPkh,
} from '@utils/dapp';
import { QSMainNet, WhitelistedToken } from '@utils/types';
import { noOpFunc } from '@utils/helpers';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';

import { removeLiquidity } from '../liquidutyHelpers';
import s from '../Liquidity.module.sass';

type LiquidityFormRemoveProps = {
  dex: FoundDex;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  setTokenA: Dispatch<SetStateAction<WhitelistedToken>>;
  setTokenB: Dispatch<SetStateAction<WhitelistedToken>>;
  tokenABalance: string;
  tokenBBalance: string;
  lpTokenBalance: string;
};

export const LiquidityFormRemove: React.FC<LiquidityFormRemoveProps> = ({
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
  const networkId = useNetwork().id as QSMainNet;

  const [lpTokenInput, setLpTokenInput] = useState('');
  const [tokenAOutput, setTokenAOutput] = useState('777');
  const [tokenBOutput, setTokenBOutput] = useState('777');

  useEffect(() => {
    if (lpTokenInput === '') {
      setTokenAOutput('');
      setTokenBOutput('');
      return;
    }

    const tezPerOneLp = dex.storage.storage.tez_pool
      .dividedBy(dex.storage.storage.total_supply);

    const quipuPerOneLp = dex.storage.storage.token_pool
      .dividedBy(dex.storage.storage.total_supply);

    setTokenAOutput(tezPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenA.metadata.decimals));
    setTokenBOutput(quipuPerOneLp.multipliedBy(lpTokenInput).toFixed(tokenB.metadata.decimals));
  }, [lpTokenInput, dex]);

  return (
    <>
      <TokenSelect
        label="Select LP"
        balance={lpTokenBalance}
        token={tokenA}
        setToken={(token) => token}
        value={lpTokenInput}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setLpTokenInput(event.target.value)}
        blackListedTokens={[{}] as WhitelistedToken[]}
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
        blackListedTokens={[{}] as WhitelistedToken[]}
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
        blackListedTokens={[{}] as WhitelistedToken[]}
        handleBalance={noOpFunc}
        noBalanceButtons
        disabled
      />
      <Slippage handleChange={noOpFunc} />
      <Button
        className={s.button}
        onClick={() => {
          if (!tezos || !accountPkh) return;
          const token:Token = {
            contract: tokenB.contractAddress,
            id: tokenB.fa2TokenId,
          };

          removeLiquidity(
            tezos,
            networkId,
            token,
            new BigNumber(lpTokenInput),
            new BigNumber(0.1),
          );
          setLpTokenInput('');
        }}
      >
        Remove
      </Button>
    </>
  );
};
