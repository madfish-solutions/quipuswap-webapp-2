import React, {
  useState,
  useEffect,
  ChangeEvent,
} from 'react';
import {
  Token,
  findDex,
  FoundDex,
  TransferParams,
} from '@quipuswap/sdk';
import {
  Tabs,
  Card,
  Button,
  Tooltip,
  Switcher,
} from '@quipuswap/ui-kit';
// import { useTranslation } from 'next-i18next';
import { FormSpy } from 'react-final-form';
import BigNumber from 'bignumber.js';
import router from 'next/router';

import {
  useTezos,
  useNetwork,
  useAccountPkh,
  getUserBalance,
} from '@utils/dapp';
import {
  TokenDataMap,
  WhitelistedToken,
  LiquidityFormValues,
  WhitelistedTokenPair,
} from '@utils/types';
import { FACTORIES, STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Transactions } from '@components/svg/Transactions';
import { Plus } from '@components/svg/Plus';

import { addLiquidity, calculateTokenAmount } from './liquidutyHelpers';
import { LiquidityDetails } from './LiquidityDetails';
import s from './Liquidity.module.sass';

const TabsContent = [
  {
    id: 'add',
    label: 'Add',
  },
  {
    id: 'remove',
    label: 'Remove',
  },
];

const QUIPU_TOKEN:Token = { contract: 'KT1NfYbYTCRZsNPZ97VdLqSrwPdVupiqniFu', id: 0 };

type LiquidityFormProps = {
  handleSubmit: () => void,
  setAddLiquidityParams: (params:TransferParams[]) => void,
  setRemoveLiquidityParams: (params:TransferParams[]) => void,
  addLiquidityParams:TransferParams[],
  removeLiquidityParams:TransferParams[],
  debounce:number,
  save:any,
  values:LiquidityFormValues,
  form:any,
  tabsState:any,
  dex: FoundDex,
  token1: WhitelistedToken,
  token2: WhitelistedToken,
  setTokens: (tokens:WhitelistedToken[]) => void,
  tokenPair: WhitelistedTokenPair,
  setTokenPair: (pair:WhitelistedTokenPair) => void,
  tokensData:TokenDataMap,
  handleTokenChange:(token: WhitelistedToken, tokenNumber: 'first' | 'second') => void,
  currentTab:any,
  setTabsState:(val:any) => void
};

type QSMainNet = 'mainnet' | 'florencenet' | 'granadanet';

const RealForm:React.FC<LiquidityFormProps> = ({
  values,
  tabsState,
  token1,
  token2,
  setTabsState,
  tokensData,
  currentTab,
  // addLiquidityParams,
}) => {
  // const { t } = useTranslation(['common', 'liquidity']);
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;

  const [tokenABalance, setTokenABalance] = useState('0');
  const [tokenBBalance, setTokenBBalance] = useState('0');
  const [tokenAInput, setTokenAInput] = useState<string>('');
  const [tokenBInput, setTokenBInput] = useState<string>('');
  const [dex, setDex] = useState<FoundDex>();

  useEffect(() => {
    const getBothTokensBalances = async () => {
      if (!tezos || !accountPkh) return;

      const tokenA = await getUserBalance(tezos, accountPkh, TEZOS_TOKEN.contractAddress);
      const tokenB = await getUserBalance(tezos, accountPkh, 'KT1NfYbYTCRZsNPZ97VdLqSrwPdVupiqniFu', 'fa2');

      if (tokenA) setTokenABalance(tokenA.dividedBy(1_000_000).toFixed());
      if (tokenB) setTokenBBalance(tokenB.dividedBy(1_000_000).toFixed());
    };
    getBothTokensBalances();
  }, [tezos]);
  useEffect(() => {
    const loadDex = async () => {
      if (!tezos) return;
      const foundDex = await findDex(tezos, FACTORIES[networkId], QUIPU_TOKEN);
      setDex(foundDex);
    };

    loadDex();
  }, [tezos, networkId, QUIPU_TOKEN]);

  const handleTokenAChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setTokenAInput(event.target.value);

    if (!tezos || !dex) return;
    if (event.target.value === '') {
      setTokenBInput('');
      return;
    }

    const tokenAmount = calculateTokenAmount(
      new BigNumber(event.target.value),
      dex.storage.storage.total_supply,
      dex.storage.storage.tez_pool,
      dex.storage.storage.token_pool,
    );

    setTokenBInput(tokenAmount.dividedBy(1_000_000).toFixed(6));
  };

  const handleTokenBChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setTokenBInput(event.target.value);

    if (!tezos || !dex) return;
    if (event.target.value === '') {
      setTokenAInput('');
      return;
    }

    const tezAmount = calculateTokenAmount(
      new BigNumber(event.target.value),
      dex.storage.storage.total_supply,
      dex.storage.storage.token_pool,
      dex.storage.storage.tez_pool,
    );

    setTokenAInput(tezAmount.dividedBy(1_000_000).toFixed(6));
  };

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs
              values={TabsContent}
              activeId={tabsState}
              setActiveId={(val) => {
                router.replace(
                  `/liquidity/${val}/${getWhitelistedTokenSymbol(token1)}-${getWhitelistedTokenSymbol(token2)}`,
                  undefined,
                  { shallow: true },
                );
                setTabsState(val);
              }}
              className={s.tabs}
            />
          ),
          button: (
            <Button
              theme="quaternary"
            >
              <Transactions />
            </Button>
          ),
          className: s.header,
        }}
        contentClassName={s.content}
      >
        <TokenSelect
          label="Input"
          balance={tokenABalance}
          token={TEZOS_TOKEN}
          setToken={(token) => console.log(token)}
          value={tokenAInput}
          onChange={handleTokenAChange}
          blackListedTokens={[{}] as WhitelistedToken[]}
          handleBalance={(value) => {
            if (!dex) return;
            const fixedValue = parseFloat(value).toFixed(6);
            setTokenAInput(fixedValue);
            const tokenAmount = calculateTokenAmount(
              new BigNumber(fixedValue),
              dex.storage.storage.total_supply,
              dex.storage.storage.tez_pool,
              dex.storage.storage.token_pool,
            );
            setTokenBInput(tokenAmount.dividedBy(1_000_000).toFixed(6));
          }}
          noBalanceButtons={!accountPkh}
        />
        <Plus className={s.iconButton} />
        <TokenSelect
          label="Input"
          balance={tokenBBalance}
          token={STABLE_TOKEN}
          setToken={(token) => console.log(token)}
          value={tokenBInput}
          onChange={handleTokenBChange}
          blackListedTokens={[{}] as WhitelistedToken[]}
          handleBalance={(value) => {
            if (!dex) return;
            const fixedValue = parseFloat(value).toFixed(6);
            setTokenBInput(fixedValue);
            const tezAmount = calculateTezAmount(
              new BigNumber(fixedValue),
              dex.storage.storage.total_supply,
              dex.storage.storage.token_pool,
              dex.storage.storage.tez_pool,
            );
            setTokenAInput(tezAmount.dividedBy(1_000_000).toFixed(6));
          }}
          noBalanceButtons={!accountPkh}
        />
        <div className={s.switcher}>
          <Switcher isActive={false} onChange={() => {}} />
          <span className={s.rebalance}>Rebalance Liq</span>
          <Tooltip content="Liquidity rebalace description" />
        </div>
        <Button
          className={s.button}
          onClick={() => {
            if (!tezos) return;

            const tezValue = new BigNumber(tokenAInput).multipliedBy(1_000_000);
            addLiquidity(tezos, networkId, QUIPU_TOKEN, tezValue);
            setTokenAInput('');
            setTokenBInput('');
          }}
        >
          {currentTab.label}
        </Button>
      </Card>
      <LiquidityDetails
        currentTab={currentTab.label}
        token1={token1}
        token2={token2}
        tokensData={tokensData}
        balanceTotalA={(values.balanceTotalA ?? 0).toString()}
        balanceTotalB={(values.balanceTotalB ?? 0).toString()}
      />
    </>
  );
};

export const LiquidityForm = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
