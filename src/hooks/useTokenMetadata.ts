import { useEffect, useState } from 'react';
import {
  findDex, FoundDex, Token,
} from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {
  getStorageInfo,
  useAllFarms,
  useNetwork, useSearchCustomTokens,
  useTezos, useTokens,
} from '@utils/dapp';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import { QSMainNet, WhitelistedToken } from '@utils/types';
import { localSearchToken } from '@utils/helpers';

export const useTokenMetadata = () => {
  const network = useNetwork();
  const tezos = useTezos();
  const allFarms = useAllFarms();
  const { data: tokens } = useTokens();
  const searchCustomToken = useSearchCustomTokens();
  const [tokensMetadata, setTokensMetadata] = useState<WhitelistedToken[]>();

  const searchPart = async (address:string, id:BigNumber):Promise<WhitelistedToken> => {
    const isTokens = tokens
      .filter(
        (token:any) => localSearchToken(
          token,
          network,
          address,
          +id.toString(),
        ),
      );
    if (isTokens.length === 0) {
      return await searchCustomToken(address, +id.toString(), true).then((x) => {
        if (x) {
          return x;
        }
        return TEZOS_TOKEN;
      });
    }
    return isTokens[0];
  };

  useEffect(() => {
    const loadTokenMetadata = async () => {
      if (!tezos) return;
      if (!network) return;
      if (!allFarms) return;

      console.log({ allFarms });

      const dexs:Promise<FoundDex>[] = allFarms.map((farm) => {
        let asset:Token = { contract: '' };

        if (farm.stakedToken.fA2) {
          asset = {
            contract: farm.stakedToken.fA2.token,
            id: farm.stakedToken.fA2.id,
          };
        }

        if (farm.stakedToken.fA12) {
          asset = { contract: farm.stakedToken.fA12 };
        }

        if (farm.isLpTokenStaked) {
          return getStorageInfo(tezos, <string>asset.contract);
        }

        return findDex(tezos, FACTORIES[network.id as QSMainNet], asset);
      });
      const dexbufsArr = await Promise.all<FoundDex>(dexs);
      const tokenMetadata = dexbufsArr.map((dexbuf) => {
        if (dexbuf?.storage?.token_address && dexbuf?.storage?.token_id) {
          return searchPart(dexbuf.storage.token_address, dexbuf.storage.token_id);
        }

        return TEZOS_TOKEN;
      });
      const tokenMetadataResolved = await Promise.all(tokenMetadata);

      for (let i = 0; i < tokenMetadataResolved.length; i++) {
        if (tokenMetadataResolved[i].metadata.name === 'Quipuswap Governance Token') {
          tokenMetadataResolved[i].metadata.thumbnailUri = 'https://quipuswap.com/tokens/quipu.png';
        } else {
          tokenMetadataResolved[i].metadata.thumbnailUri = `https://ipfs.io/ipfs/${
            tokenMetadataResolved[i].metadata.thumbnailUri.slice(7)
          }`;
        }
      }

      setTokensMetadata(tokenMetadataResolved);
    };

    loadTokenMetadata();
  }, [allFarms, tezos, network]);

  return tokensMetadata;
};
