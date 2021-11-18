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
  Slippage,
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

import { LiquidityDetails } from './LiquidityDetails';
import s from './Liquidity.module.sass';
import { addLiquidity, removeLiquidity } from './liquidutyHelpers';

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
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const accountPkh = useAccountPkh();
  const [tokenABalance, setTokenABalance] = useState('0');
  const [tokenBBalance, setTokenBBalance] = useState('0');
  const [tokenAInput, setTokenAInput] = useState<string>('');
  const [tokenBInput, setTokenBInput] = useState<string>('');

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
          onChange={async (event: ChangeEvent<HTMLInputElement>) => {
            setTokenAInput(event.target.value);
            if (tezos) {
              const dex = await findDex(tezos, FACTORIES[networkId], QUIPU_TOKEN);
              const shares = new BigNumber(event.target.value)
                .multipliedBy(1_000_000)
                .multipliedBy(dex.storage.storage.total_supply)
                .dividedBy(dex.storage.storage.tez_pool);
              const tokenInput = shares
                .multipliedBy(dex.storage.storage.token_pool)
                .dividedBy(dex.storage.storage.total_supply);
              setTokenBInput(tokenInput.dividedBy(1_000_000).toFixed(6));
            }
          }}
          blackListedTokens={[{}] as WhitelistedToken[]}
          handleBalance={() => {}}
        />
        <Plus />
        <TokenSelect
          label="Input"
          balance={tokenBBalance}
          token={STABLE_TOKEN}
          setToken={(token) => console.log(token)}
          value={tokenBInput}
          onChange={async (event: ChangeEvent<HTMLInputElement>) => {
            setTokenBInput(event.target.value);
            if (tezos) {
              const dex = await findDex(tezos, FACTORIES[networkId], QUIPU_TOKEN);
              const shares = new BigNumber(event.target.value)
                .multipliedBy(1_000_000)
                .multipliedBy(dex.storage.storage.total_supply)
                .dividedBy(dex.storage.storage.token_pool);
              const tezInput = shares
                .multipliedBy(dex.storage.storage.tez_pool)
                .dividedBy(dex.storage.storage.total_supply);
              setTokenAInput(tezInput.dividedBy(1_000_000).toFixed(6));
            }
          }}
          blackListedTokens={[{}] as WhitelistedToken[]}
          handleBalance={() => {}}
        />
        <Slippage handleChange={() => {}} />
        <div>
          <Switcher isActive onChange={() => {}} />
          <span>Rebalance Liq</span>
          <Tooltip content="Liquidity rebalace description" />
        </div>
        <Button
          onClick={async () => {
            if (!tezos || !accountPkh) return;

            const token: Token = {
              contract: 'KT1NfYbYTCRZsNPZ97VdLqSrwPdVupiqniFu',
              id: 0,
            };
            const tezValue = new BigNumber(tokenAInput).multipliedBy(1_000_000);

            switch (currentTab.id) {
              case TabsContent[0].id:
                await addLiquidity(tezos, networkId, token, tezValue);
                break;
              case TabsContent[1].id:
                await removeLiquidity(
                  tezos,
                  networkId,
                  accountPkh,
                  new BigNumber(0.1),
                  token,
                );
                break;
              default:
                break;
            }
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
