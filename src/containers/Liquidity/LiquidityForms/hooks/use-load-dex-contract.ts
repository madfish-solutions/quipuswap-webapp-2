import { useEffect, useState } from 'react';

import { findDex, FoundDex, Token } from '@quipuswap/sdk';

import { isTezInPair, findNotTezTokenInPair } from '@containers/Liquidity/liquidutyHelpers';
import { getStorageInfo, useNetwork, useTezos } from '@utils/dapp';
import { FACTORIES, TOKEN_TO_TOKEN_DEX } from '@utils/defaults';
import { Nullable, WhitelistedToken } from '@utils/types';

interface DexInfoInterface {
  dex: Nullable<FoundDex>;
  isTezosToTokenDex: boolean;
}

export const useLoadDexContract = (tokenA: Nullable<WhitelistedToken>, tokenB: Nullable<WhitelistedToken>) => {
  const tezos = useTezos();
  const networkId = useNetwork().id;

  const [dexInfo, setDexInfo] = useState<DexInfoInterface>({ dex: null, isTezosToTokenDex: false });

  useEffect(() => {
    let isMounted = true;
    let foundDex: FoundDex;

    const loadDex = async () => {
      if (!tezos || !tokenA || !tokenB) {
        return;
      }
      const isTezosInPair = isTezInPair(tokenA.contractAddress, tokenB.contractAddress);

      try {
        if (isTezosInPair) {
          const notTezToken = findNotTezTokenInPair(tokenA, tokenB);
          const token: Token = {
            contract: notTezToken.contractAddress,
            id: notTezToken.fa2TokenId
          };

          foundDex = await findDex(tezos, FACTORIES[networkId], token);
        } else {
          const contractPromise = tezos.wallet.at(TOKEN_TO_TOKEN_DEX);
          const storagePromise = getStorageInfo(tezos, TOKEN_TO_TOKEN_DEX);
          const [contract, storage] = await Promise.all([contractPromise, storagePromise]);

          foundDex = new FoundDex(contract, storage);
        }

        if (isMounted) {
          setDexInfo({ dex: foundDex, isTezosToTokenDex: isTezosInPair });
        }
      } catch (error) {
        if (isMounted) {
          setDexInfo({ dex: null, isTezosToTokenDex: isTezosInPair });
        }
      }
    };
    void loadDex();

    return () => {
      isMounted = false;
    };
  }, [tezos, networkId, tokenA, tokenB]);

  return dexInfo;
};
