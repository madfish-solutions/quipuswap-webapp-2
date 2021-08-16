import React, {
  useEffect, useMemo, useState,
} from 'react';
import BigNumber from 'bignumber.js';
import { withTypes, FormSpy } from 'react-final-form';
import {
  batchify,
  findDex,
  FoundDex,
  getLiquidityShare,
  TransferParams,
} from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import {
  getUserBalance,
  useAccountPkh, useNetwork, useTezos,
} from '@utils/dapp';
import { useExchangeRates } from '@hooks/useExchangeRate';
import {
  TokenDataMap, TokenDataType,
  WhitelistedToken, WhitelistedTokenPair,
} from '@utils/types';

import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import { StickyBlock } from '@components/common/StickyBlock';

import { LiquidityForm, LiquidityFormValues } from './LiquidityForm';

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

type LiquidityProps = {
  className?: string
};

const fallbackTokensData : TokenDataType = {
  token: {
    address: 'tez',
    type: 'fa1.2',
    decimals: 6,
    id: null,
  },
  balance: '0',
};

type QSMainNet = 'mainnet' | 'florencenet';

const hanldeTokenPairSelect = (
  pair:WhitelistedTokenPair,
  setTokenPair: (pair:WhitelistedTokenPair) => void,
  handleTokenChange: (token:WhitelistedToken, tokenNum:'first' | 'second') => void,
  tezos:TezosToolkit | null,
  accountPkh:string | null,
  networkId?:QSMainNet,
) => {
  const asyncFunc = async () => {
    handleTokenChange(pair.token1, 'first');
    handleTokenChange(pair.token2, 'second');
    if (!tezos || !accountPkh || !networkId) {
      setTokenPair(pair);
      return;
    }
    try {
      const secondAsset = {
        contract: pair.token2.contractAddress,
        id: pair.token2.fa2TokenId,
      };
      const foundDex = await findDex(tezos, FACTORIES[networkId], secondAsset);
      const share = await getLiquidityShare(tezos, foundDex, accountPkh!!);

      // const lpTokenValue = share.total;
      const frozenBalance = share.frozen.div(
        new BigNumber(10)
          .pow(
            // new BigNumber(pair.token2.metadata.decimals),
            // NOT WORKING - CURRENT XTZ DECIMALS EQUALS 6!
            // CURRENT METHOD ONLY WORKS FOR XTZ -> TOKEN, so decimals = 6
            new BigNumber(6),
          ),
      ).toString();
      const totalBalance = share.total.div(
        new BigNumber(10)
          .pow(
            // new BigNumber(pair.token2.metadata.decimals),
            new BigNumber(6),
          ),
      ).toString();
      const res = {
        ...pair, frozenBalance, balance: totalBalance, dex: foundDex,
      };
      setTokenPair(res);
    } catch (err) {
      console.error(err);
    }
  };
  asyncFunc();
};

const AutoSave = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={LiquidityForm} />
);

const fallbackTokenPair = {
  token1: TEZOS_TOKEN,
  token2: TEZOS_TOKEN,
} as WhitelistedTokenPair;

export const Liquidity: React.FC<LiquidityProps> = ({
  className,
}) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();
  const networkId = useNetwork().id as QSMainNet;
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes
  const [tokensData, setTokensData] = useState<TokenDataMap>(
    {
      first: fallbackTokensData,
      second: fallbackTokensData,
    },
  );

  const [removeLiquidityParams, setRemoveLiquidityParams] = useState<TransferParams[]>([]);
  const [addLiquidityParams, setAddLiquidityParams] = useState<TransferParams[]>([]);
  const { Form } = withTypes<LiquidityFormValues>();
  const [dex, setDex] = useState<FoundDex>();
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([]);
  const [
    tokenPair,
    setTokenPair,
  ] = useState<WhitelistedTokenPair>(fallbackTokenPair);

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  const handleTokenChange = async (token: WhitelistedToken, tokenNumber: 'first' | 'second') => {
    if (!exchangeRates || !exchangeRates.find) return;
    let finalBalance = '0';
    if (tezos && accountPkh) {
      const balance = await getUserBalance(
        tezos,
        accountPkh,
        token.contractAddress,
        token.type,
        token.fa2TokenId,
      );
      if (balance) {
        finalBalance = balance.div(
          new BigNumber(10)
            .pow(
              new BigNumber(token.metadata.decimals),
            ),
        ).toString();
      }
    }

    const tokenExchangeRate = exchangeRates.find((el: {
      tokenAddress: string,
      tokenId?: number,
      exchangeRate: string
    }) => (
      token.contractAddress === TEZOS_TOKEN.contractAddress && el.tokenAddress === undefined ? el
        : el.tokenAddress === token.contractAddress
      && (token.fa2TokenId ? el.tokenId === token.fa2TokenId : true)
    ));

    const newTokensData = {
      ...tokensData,
      [tokenNumber]: {
        token: {
          address: token.contractAddress,
          type: token.type,
          id: token.fa2TokenId,
          decimals: token.metadata.decimals,
        },
        balance: finalBalance,
        exchangeRate: tokenExchangeRate?.exchangeRate ?? null,
      },
    };

    setTokensData(newTokensData);
  };

  useEffect(() => {
    if (exchangeRates && tezos && accountPkh && !initialLoad) {
      setInitialLoad(true);
      if (!tokensData.first.exchangeRate) {
        handleTokenChange(
          {
            contractAddress: tokensData.first.token.address,
            type: tokensData.first.token.type,
            metadata:
            {
              decimals: tokensData.first.token.decimals,
            },
          } as WhitelistedToken, 'first',
        );
      }
      if (!tokensData.second.exchangeRate) {
        handleTokenChange(
          {
            contractAddress: tokensData.second.token.address,
            type: tokensData.second.token.type,
            metadata:
          {
            decimals: tokensData.second.token.decimals,
          },
          } as WhitelistedToken, 'second',
        );
      }
    }
  }, [exchangeRates, tezos, accountPkh]);

  return (
    <StickyBlock className={className}>
      <Form
        onSubmit={() => {
          if (!tezos) return;
          const asyncFunc = async () => {
            if (currentTab.id === 'remove') {
              try {
                const op = await batchify(
                  tezos.wallet.batch([]),
                  removeLiquidityParams,
                ).send();
                await op.confirmation();
              } catch (e) {
                console.error(e);
              }
            } else {
              try {
                const op = await batchify(
                  tezos.wallet.batch([]),
                  addLiquidityParams,
                ).send();
                await op.confirmation();
              } catch (e) {
                console.error(e);
              }
            }
          };
          asyncFunc();
        }}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({ handleSubmit, form }) => (
          <AutoSave
            form={form}
            handleSubmit={handleSubmit}
            debounce={1000}
            save={() => {}}
            setTabsState={setTabsState}
            tabsState={tabsState}
            dex={dex}
            setDex={setDex}
            token1={token1}
            token2={token2}
            tokenPair={tokenPair}
            setTokens={setTokens}
            setToken1={(token:WhitelistedToken) => {
              setTokens([token, (token2 || undefined)]);
              if (token2) {
                hanldeTokenPairSelect(
                  { token1: token, token2 } as WhitelistedTokenPair,
                  setTokenPair,
                  handleTokenChange,
                  tezos,
                  accountPkh,
                  networkId,
                );
              }
            }}
            setToken2={(token:WhitelistedToken) => {
              setTokens([(token1 || undefined), token]);
              if (token1) {
                hanldeTokenPairSelect(
                  { token1, token2: token } as WhitelistedTokenPair,
                  setTokenPair,
                  handleTokenChange,
                  tezos,
                  accountPkh,
                  networkId,
                );
              }
            }}
            setTokenPair={setTokenPair}
            tokensData={tokensData}
            handleTokenChange={handleTokenChange}
            currentTab={currentTab}
            setRemoveLiquidityParams={setRemoveLiquidityParams}
            removeLiquidityParams={removeLiquidityParams}
            setAddLiquidityParams={setAddLiquidityParams}
            addLiquidityParams={addLiquidityParams}
          />
        )}
      />
    </StickyBlock>

  );
};
