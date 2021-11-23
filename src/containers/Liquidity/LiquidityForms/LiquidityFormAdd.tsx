import React, {
  useState,
  Dispatch,
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
import { fromDecimals } from '@utils/helpers';
import { TEZOS_TOKEN } from '@utils/defaults';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Plus } from '@components/svg/Plus';

import s from '../Liquidity.module.sass';
import {
  addLiquidity,
  calculateTokenAmount,
} from '../liquidutyHelpers';
import { initializeLiquidity } from '../liquidutyHelpers/initializeLiquidity';

type LiquidityFormProps = {
  dex: FoundDex | null;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
  setTokenA: Dispatch<SetStateAction<WhitelistedToken>>;
  setTokenB: Dispatch<SetStateAction<WhitelistedToken>>;
  tokenABalance: string;
  tokenBBalance: string;
};

export const LiquidityFormAdd:React.FC<LiquidityFormProps> = ({
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

  const handleTokenAChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenAInput(event.target.value);

    if (event.target.value === '') {
      setTokenBInput('');
      return;
    }

    const tokenAmount = dex && calculateTokenAmount(
      new BigNumber(event.target.value),
      dex.storage.storage.total_supply,
      dex.storage.storage.tez_pool,
      dex.storage.storage.token_pool,
    );

    if (tokenAmount) {
      setTokenBInput(
        fromDecimals(tokenAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals),
      );
    }
  };

  const handleTokenBChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenBInput(event.target.value);

    if (event.target.value === '') {
      setTokenAInput('');
      return;
    }

    const tezAmount = dex && calculateTokenAmount(
      new BigNumber(event.target.value),
      dex.storage.storage.total_supply,
      dex.storage.storage.token_pool,
      dex.storage.storage.tez_pool,
    );

    if (tezAmount) {
      setTokenAInput(
        fromDecimals(tezAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals),
      );
    }
  };

  const handleTokenABalance = (value:string) => {
    if (!dex) return;

    const fixedValue = new BigNumber(value);
    setTokenAInput(fixedValue.toFixed(tokenA.metadata.decimals));
    const tokenAmount = calculateTokenAmount(
      fixedValue,
      dex.storage.storage.total_supply,
      dex.storage.storage.tez_pool,
      dex.storage.storage.token_pool,
    );
    setTokenBInput(
      fromDecimals(tokenAmount, tokenB.metadata.decimals).toFixed(tokenB.metadata.decimals),
    );
  };

  const handleTokenBBalance = (value:string) => {
    if (!dex) return;

    const fixedValue = new BigNumber(value);
    setTokenBInput(fixedValue.toFixed(tokenB.metadata.decimals));
    const tezAmount = calculateTokenAmount(
      fixedValue,
      dex.storage.storage.total_supply,
      dex.storage.storage.token_pool,
      dex.storage.storage.tez_pool,
    );
    setTokenAInput(
      fromDecimals(tezAmount, tokenA.metadata.decimals).toFixed(tokenA.metadata.decimals),
    );
  };

  const handleAddLiquidity = () => {
    if (!tezos || !accountPkh) return;

    const tezDecimals = new BigNumber(10).pow(TEZOS_TOKEN.metadata.decimals);
    const tezValue = new BigNumber(tokenAInput)
      .multipliedBy(tezDecimals);

    if (dex) {
      addLiquidity(tezos, dex, tezValue);
    } else {
      const token:Token = {
        contract: tokenB.contractAddress,
        id: tokenB.fa2TokenId,
      };
      const tokenBDecimals = new BigNumber(10).pow(tokenB.metadata.decimals);
      const tokenBValue = new BigNumber(tokenBInput).multipliedBy(tokenBDecimals);
      initializeLiquidity(tezos, token, tokenBValue, tezValue);
    }

    setTokenAInput('');
    setTokenBInput('');
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
