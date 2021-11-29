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
import router from 'next/router';

import {
  useTezos,
  useNetwork,
  useAccountPkh,
  getStorageInfo,
  getUserBalance,
} from '@utils/dapp';
import {
  QSMainNet,
  // TokenDataMap,
  WhitelistedTokenPair,
} from '@utils/types';
import {
  FACTORIES,
  TEZOS_TOKEN,
  QUIPU_TOKEN,
} from '@utils/defaults';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { Transactions } from '@components/svg/Transactions';

// import { LiquidityDetails } from '../LiquidityDetails';
import { AddTezToToken } from './AddTezToToken';
import { AddTokenToToken } from './AddTokenToToken';
import { RemoveTezToToken } from './RemoveTezToToken';
import { RemoveTokenToToken } from './RemoveTokenToToken';
import {
  sortTokensContracts,
  findNotTezTokenInPair,
  getValidMichelTemplate,
} from '../liquidutyHelpers';
import s from '../Liquidity.module.sass';

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
  const [tabState, setTabState] = useState(TabsContent[0]);
  const [tokenA, setTokenA] = useState(TEZOS_TOKEN);
  const [tokenB, setTokenB] = useState(QUIPU_TOKEN);
  const [tokenABalance, setTokenABalance] = useState<string>('0');
  const [tokenBBalance, setTokenBBalance] = useState<string>('0');
  const [lpTokenBalance, setLpTokenBalance] = useState<string>('0');
  const [dexInfo, setDexInfo] = useState<{
    dex: FoundDex | null,
    isTezosToTokenDex:boolean,
  }>({ dex: null, isTezosToTokenDex: false });

  const checkForTezInPair = (contractAddressA:string, contractAddressB:string) => {
    if (
      contractAddressA === TEZOS_TOKEN.contractAddress
      || contractAddressB === TEZOS_TOKEN.contractAddress
    ) return true;

    return false;
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
  // Loading a valid dex contract
  useEffect(() => {
    let isMounted = true;
    let foundDex:FoundDex;
    const loadDex = async () => {
      if (!tezos) return;
      const isTezosInPair = checkForTezInPair(tokenA.contractAddress, tokenB.contractAddress);

      try {
        if (isTezosInPair) {
          const notTezToken = findNotTezTokenInPair(tokenA, tokenB);
          const token: Token = {
            contract: notTezToken.contractAddress,
            id: notTezToken.fa2TokenId,
          };

          foundDex = await findDex(tezos, FACTORIES[networkId], token);
        } else {
          const contract = await tezos.wallet.at('KT1SumF3C6ZRKHpDsctzbeqw9rMHQk1ATR4H');
          const storage = await getStorageInfo(tezos, 'KT1SumF3C6ZRKHpDsctzbeqw9rMHQk1ATR4H');

          foundDex = new FoundDex(contract, storage);
        }

        if (isMounted) setDexInfo({ dex: foundDex, isTezosToTokenDex: isTezosInPair });
      } catch (error) {
        if (isMounted) setDexInfo({ dex: null, isTezosToTokenDex: isTezosInPair });
      }
    };
    loadDex();

    return () => { isMounted = false; };
  }, [tezos, networkId, tokenA, tokenB]);
  // Loading a tokenA balance
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
        setTokenABalance(userTokenABalanance.dividedBy(1_000_000).toFixed());
      } else if (!userTokenABalanance && isMounted) {
        setTokenABalance('0');
      }
    };
    getTokenABalance();

    return () => { isMounted = false; };
  }, [tezos, accountPkh, tokenA]);
  // Loading a tokenB balance
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
        setTokenBBalance(userTokenBBalance.dividedBy(1_000_000).toFixed());
      } else if (!userTokenBBalance && isMounted) {
        setTokenBBalance('0');
      }
    };
    getTokenBBalance();

    return () => { isMounted = false; };
  }, [tezos, accountPkh, tokenB]);
  // Loading a lpToken balance
  useEffect(() => {
    let isMounted = true;
    const getLpTokenBalance = async () => {
      const { dex, isTezosToTokenDex } = dexInfo;

      if (!tezos || !accountPkh || !dex) return;

      if (isTezosToTokenDex) {
        const notTezToken = findNotTezTokenInPair(tokenA, tokenB);
        const userLpTokenBalance = await getUserBalance(
          tezos,
          accountPkh,
          dex.contract.address,
          notTezToken.type,
          notTezToken.fa2TokenId,
        );

        if (userLpTokenBalance && isMounted) {
          setLpTokenBalance(userLpTokenBalance.dividedBy(1_000_000).toFixed());
        } else if (!userLpTokenBalance && isMounted) {
          setLpTokenBalance('0');
        }
      } else if (!isTezosToTokenDex) {
        const addresses = sortTokensContracts(tokenA, tokenB);
        if (!addresses) return;

        const michelData = getValidMichelTemplate(addresses);
        const key = Buffer.from(MichelCodec.packData(michelData)).toString('hex');
        const pairId = await dex.storage.storage.token_to_id.get(key);
        if (pairId) {
          const userLpTokenBalance = await dex.storage.storage.ledger.get([
            accountPkh,
            pairId,
          ]);

          if (userLpTokenBalance && isMounted) {
            setLpTokenBalance(userLpTokenBalance.balance.dividedBy(1_000_000).toFixed());
          } else if (!userLpTokenBalance && isMounted) {
            setLpTokenBalance('0');
          }
        } else if (!pairId && isMounted) {
          setLpTokenBalance('0');
        }
      }
    };
    getLpTokenBalance();

    return () => { isMounted = false; };
  }, [tezos, accountPkh, dexInfo]);

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
        {tabState.id === 'add' && dexInfo.isTezosToTokenDex && (
          <AddTezToToken
            dex={dexInfo.dex}
            tokenA={tokenA}
            tokenB={tokenB}
            setTokenA={setTokenA}
            setTokenB={setTokenB}
            tokenABalance={tokenABalance}
            tokenBBalance={tokenBBalance}
          />
        )}
        {tabState.id === 'remove' && dexInfo.isTezosToTokenDex && (
          <RemoveTezToToken
            dex={dexInfo.dex}
            tokenA={tokenA}
            tokenB={tokenB}
            setTokenA={setTokenA}
            setTokenB={setTokenB}
            tokenABalance={tokenABalance}
            tokenBBalance={tokenBBalance}
            lpTokenBalance={lpTokenBalance}
          />
        )}
        {tabState.id === 'add' && !dexInfo.isTezosToTokenDex && (
          <AddTokenToToken
            dex={dexInfo.dex}
            tokenA={tokenA}
            tokenB={tokenB}
            setTokenA={setTokenA}
            setTokenB={setTokenB}
            tokenABalance={tokenABalance}
            tokenBBalance={tokenBBalance}
          />
        )}
        {tabState.id === 'remove' && !dexInfo.isTezosToTokenDex && (
          <RemoveTokenToToken
            dex={dexInfo.dex}
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
