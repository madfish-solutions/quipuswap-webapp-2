import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Tabs,
  Card,
  Button,
} from '@quipuswap/ui-kit';
import {
  Token,
  findDex,
  FoundDex,
  // getLiquidityShare,
} from '@quipuswap/sdk';
import { FormSpy } from 'react-final-form';
import BigNumber from 'bignumber.js';
import router from 'next/router';

import {
  useTezos,
  useNetwork,
  useAccountPkh,
  getUserBalance,
  getContract,
  getStorageInfo,
} from '@utils/dapp';
import {
  QSMainNet,
  // TokenDataMap,
  WhitelistedTokenPair,
  SortTokensContractsType,
} from '@utils/types';
import {
  FACTORIES,
  TEZOS_TOKEN,
  QUIPU_TOKEN,
  REACT_TOKEN,
  ETHPL_TOKEN,
} from '@utils/defaults';
import { fromDecimals, getWhitelistedTokenSymbol, sortTokensContracts } from '@utils/helpers';
import { Transactions } from '@components/svg/Transactions';

import { BigMapAbstraction } from '@taquito/taquito';
import { LiquidityFormAdd } from './LiquidityFormAdd';
// import { LiquidityDetails } from '../LiquidityDetails';
import { LiquidityFormRemove } from './LiquidityFormRemove';
import s from '../Liquidity.module.sass';

const taquitoUtils = require('@taquito/utils');
const MichelCodec = require('@taquito/michel-codec');

const fallbackTokenPair = {
  token1: TEZOS_TOKEN,
  token2: QUIPU_TOKEN,
} as WhitelistedTokenPair;

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

// type LiquidityFormProps = {
//   tokensData: TokenDataMap;
// };

// const RealForm:React.FC<LiquidityFormProps> = ({ tokensData }) => {
const RealForm:React.FC = () => {
  const tezos = useTezos();
  const networkId = useNetwork().id as QSMainNet;
  const accountPkh = useAccountPkh();

  // const [poolShare, setPoolShare] = useState<PoolShare>();
  const [dex, setDex] = useState<FoundDex | null>(null);
  const [tabState, setTabState] = useState(TabsContent[0]);
  const [tokenA, setTokenA] = useState(ETHPL_TOKEN);
  const [tokenB, setTokenB] = useState(REACT_TOKEN);
  const [tokenABalance, setTokenABalance] = useState<string>('0');
  const [tokenBBalance, setTokenBBalance] = useState<string>('0');
  const [lpTokenBalance, setLpTokenBalance] = useState<string>('0');

  const checkForTezInPair = (contractAddressA:string, contractAddressB:string) => {
    if (
      contractAddressA === TEZOS_TOKEN.contractAddress
      || contractAddressB === TEZOS_TOKEN.contractAddress
    ) return true;

    return false;
  };
  const getValidMichelTemplate = ({
    addressA,
    addressB,
    type,
  }: SortTokensContractsType) => {
    const tokenAAddressBytes = taquitoUtils.b58decode(addressA);
    const tokenBAddressBytes = taquitoUtils.b58decode(addressB);

    switch (type) {
      case 'Left-Left':
        return {
          prim: 'Pair',
          args: [
            {
              prim: 'Left',
              args: [{ bytes: tokenAAddressBytes }],
            },
            {
              prim: 'Left',
              args: [{ bytes: tokenBAddressBytes }],
            },
          ],
        };
      case 'Left-Right':
        return {
          prim: 'Pair',
          args: [
            {
              prim: 'Left',
              args: [{ bytes: tokenAAddressBytes }],
            },
            {
              prim: 'Right',
              args: [
                { bytes: tokenBAddressBytes },
                { int: 0 },
              ],
            },
          ],
        };
      case 'Right-Right':
        return {
          prim: 'Pair',
          args: [
            {
              prim: 'Right',
              args: [
                {
                  prim: 'Pair',
                  args: [
                    { bytes: tokenAAddressBytes },
                    { int: 0 },
                  ],
                },
              ],
            },
            {
              prim: 'Right',
              args: [
                {
                  prim: 'Pair',
                  args: [
                    { bytes: tokenBAddressBytes },
                    { int: 0 },
                  ],
                },
              ],
            },
          ],
        };

      default:
        return null;
    }
  };
  const setActiveId = useCallback(
    (val:string) => {
      router.replace(
        `/liquidity/${val}/${getWhitelistedTokenSymbol(fallbackTokenPair.token1)}-${getWhitelistedTokenSymbol(fallbackTokenPair.token2)}`,
        undefined,
        { shallow: true },
      );
      const findActiveTab = TabsContent.find((tab) => tab.id === val);
      if (!findActiveTab) return;
      setTabState(findActiveTab);
    }, [],
  );

  useEffect(() => {
    let isMounted = true;
    const loadDex = async () => {
      if (!tezos) return;

      const token: Token = {
        contract: tokenB.contractAddress,
        id: tokenB.fa2TokenId,
      };
      try {
        const isTezInPair = checkForTezInPair(tokenA.contractAddress, tokenB.contractAddress);

        let foundDex: FoundDex;
        if (isTezInPair) {
          foundDex = await findDex(tezos, FACTORIES[networkId], token);
        } else {
          const contract = await getContract(tezos, 'KT1SumF3C6ZRKHpDsctzbeqw9rMHQk1ATR4H');
          const storage = await getStorageInfo(tezos, 'KT1SumF3C6ZRKHpDsctzbeqw9rMHQk1ATR4H');
          foundDex = new FoundDex(contract, storage);
        }

        if (isMounted) setDex(foundDex);
      } catch (error) {
        setDex(null);
      }
    };
    loadDex();

    return () => { isMounted = false; };
  }, [tezos, networkId, tokenB, tokenA]);

  useEffect(() => {
    let isMounted = true;
    const getTokenABalance = async () => {
      if (!tezos || !accountPkh) return;

      const userTokenABalanance = await getUserBalance(
        tezos,
        accountPkh,
        tokenA.contractAddress,
        tokenA.type,
        tokenA.fa2TokenId,
      );

      if (userTokenABalanance && isMounted) {
        setTokenABalance(fromDecimals(userTokenABalanance, tokenA.metadata.decimals).toFixed());
      } else if (!userTokenABalanance && isMounted) {
        setTokenABalance('0');
      }
    };
    getTokenABalance();

    return () => { isMounted = false; };
  }, [tezos, accountPkh, tokenA]);

  useEffect(() => {
    let isMounted = true;
    const getTokenBBalance = async () => {
      if (!tezos || !accountPkh) return;

      const userTokenBBalance = await getUserBalance(
        tezos,
        accountPkh,
        tokenB.contractAddress,
        tokenB.type,
        tokenB.fa2TokenId,
      );

      if (userTokenBBalance && isMounted) {
        setTokenBBalance(fromDecimals(userTokenBBalance, tokenB.metadata.decimals).toFixed());
      } else if (!userTokenBBalance && isMounted) {
        setTokenBBalance('0');
      }
    };
    getTokenBBalance();

    return () => { isMounted = false; };
  }, [tezos, accountPkh, tokenB]);

  useEffect(() => {
    const tmp = async () => {
      if (!dex || !dex.storage.storage.token_to_id) return;

      const addresses = sortTokensContracts(tokenA, tokenB);

      if (!addresses) return;

      const michelData = getValidMichelTemplate(addresses);

      const key = Buffer.from(MichelCodec.packData(michelData)).toString('hex');

      const lpTokenId = await dex.storage.storage.token_to_id.get(key);
      console.log(lpTokenId && lpTokenId.toFixed());
    };
    tmp();
  }, [dex, tokenA, tokenB]);

  useEffect(() => {
    let isMounted = true;
    const getLpTokenBalance = async () => {
      if (!tezos || !accountPkh) return;

      let userLpTokenBalance:BigMapAbstraction | null = null;
      if (dex && dex.storage.storage.tez_pool) {
        userLpTokenBalance = await getUserBalance(
          tezos,
          accountPkh,
          dex.contract.address,
          tokenB.type,
          tokenB.fa2TokenId,
        );
      } else if (dex && dex.storage.storage.ledger) {
        console.log({ dex });

        userLpTokenBalance = await dex.storage.storage.ledger.get([accountPkh, 3]);
        console.log(userLpTokenBalance && userLpTokenBalance.toString());
      }

      if (userLpTokenBalance && isMounted) {
        setLpTokenBalance(fromDecimals(userLpTokenBalance, 6).toFixed());
      } else if (!userLpTokenBalance && isMounted) {
        setLpTokenBalance('0');
      }
    };
    getLpTokenBalance();

    return () => { isMounted = false; };
  }, [tezos, accountPkh, tokenB, dex]);

  // useEffect(() => {
  //   let isLoadShares = true;
  //   const loadShares = async () => {
  //     if (!accountPkh || !tezos || !dex) return;

  //     const share = await getLiquidityShare(tezos, dex, accountPkh);

  //     if (isLoadShares) setPoolShare(share);
  //   };
  //   loadShares();

  //   return () => { isLoadShares = false; };
  // }, [tezos, accountPkh, dex]);

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs
              values={TabsContent}
              activeId={tabState.id}
              setActiveId={setActiveId}
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
        {tabState.id === 'add' && (
          <LiquidityFormAdd
            dex={dex}
            tokenA={tokenA}
            tokenB={tokenB}
            setTokenA={setTokenA}
            setTokenB={setTokenB}
            tokenABalance={tokenABalance}
            tokenBBalance={tokenBBalance}
          />
        )}
        {tabState.id === 'remove' && (
          <LiquidityFormRemove
            dex={dex}
            tokenA={tokenA}
            tokenB={tokenB}
            setTokenA={setTokenA}
            setTokenB={setTokenB}
            tokenABalance={tokenABalance}
            tokenBBalance={tokenBBalance}
            lpTokenBalance={lpTokenBalance}
          />
        )}
      </Card>
      {/* <LiquidityDetails
        currentTab={tabState.label}
        token1={fallbackTokenPair.token1}
        token2={fallbackTokenPair.token2}
        tokensData={tokensData}
        poolShare={poolShare}
        balanceTotalA="1"
        balanceTotalB="2"
      /> */}
    </>
  );
};

export const LiquidityForm = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
