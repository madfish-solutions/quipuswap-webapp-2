import {
  getStorageInfo, getUserBalance, useAccountPkh, useNetwork, useTezos,
} from '@utils/dapp';
import { QSMainNet } from '@utils/types';
import { useCallback, useEffect, useState } from 'react';
import {
  FA12_TOKEN, FACTORIES, TEZOS_TOKEN, TOKEN_TO_TOKEN_DEX, TS_TOKEN,
} from '@utils/defaults';
import { findDex, FoundDex, Token } from '@quipuswap/sdk';
import { fromDecimals } from '@utils/helpers';
import {
  findNotTezTokenInPair,
  getValidMichelTemplate,
  sortTokensContracts,
} from '@containers/Liquidity/liquidutyHelpers';
import MichelCodec from '@taquito/michel-codec';

export const TabsContent = [
  {
    id: 'add',
    label: 'Add',
  },
  {
    id: 'remove',
    label: 'Remove',
  },
];

export const useViewModel = () => {
  const tezos = useTezos();
  const networkId = useNetwork().id as QSMainNet;
  const accountPkh = useAccountPkh();

  const [tabState, setTabState] = useState(TabsContent[0]);
  const [tokenA, setTokenA] = useState(FA12_TOKEN);
  const [tokenB, setTokenB] = useState(TS_TOKEN);
  const [tokenABalance, setTokenABalance] = useState<string>('0');
  const [tokenBBalance, setTokenBBalance] = useState<string>('0');
  const [lpTokenBalance, setLpTokenBalance] = useState<string>('0');
  const [dexInfo, setDexInfo] = useState<{
    dex: FoundDex | null,
    isTezosToTokenDex:boolean,
  }>({ dex: null, isTezosToTokenDex: false });

  // eslint-disable-next-line max-len
  const checkForTezInPair = (contractAddressA:string, contractAddressB:string) => contractAddressA === TEZOS_TOKEN.contractAddress
    || contractAddressB === TEZOS_TOKEN.contractAddress;

  const setActiveId = useCallback(
    (tabId:string) => {
      // TODO
      // router.replace(
      //   `/liquidity/${tabId}/${getWhitelistedTokenSymbol(tokensData.first.token.address)}
      //   -${getWhitelistedTokenSymbol(fallbackTokenPair.token2)}`,
      //   undefined,
      //   { shallow: true },
      // );
      const findActiveTab = TabsContent.find((tab) => tab.id === tabId);
      if (!findActiveTab) return;
      setTabState(findActiveTab);
    }, [],
  );

  useEffect(() => {
    let isMounted = true;
    let foundDex: FoundDex;
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
          const contractPromise = tezos.wallet.at(TOKEN_TO_TOKEN_DEX);
          const storagePromise = getStorageInfo(tezos, TOKEN_TO_TOKEN_DEX);
          const [contract, storage] = await Promise.all([contractPromise, storagePromise]);

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
        setTokenABalance(
          fromDecimals(userTokenABalanance, tokenA.metadata.decimals)
            .toFixed(tokenA.metadata.decimals),
        );
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
        setTokenBBalance(
          fromDecimals(userTokenBBalance, tokenB.metadata.decimals)
            .toFixed(tokenB.metadata.decimals),
        );
      } else if (!userTokenBBalance && isMounted) {
        setTokenBBalance('0');
      }
    };
    getTokenBBalance();

    return () => { isMounted = false; };
  }, [tezos, accountPkh, tokenB]);

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
    // Ignore tokenA & tokenB
  }, [tezos, accountPkh, dexInfo]);

  return {
    // eslint-disable-next-line max-len
    tabState, setActiveId, dexInfo, tokenA, tokenB, setTokenA, setTokenB, tokenABalance, tokenBBalance, lpTokenBalance,
  };
};
