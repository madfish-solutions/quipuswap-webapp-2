import { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';

import {
  useAllFarms,
  useNetwork, useSearchCustomTokens,
  useTezos, useTokens,
} from '@utils/dapp';
import { TEZOS_TOKEN } from '@utils/defaults';
import { WhitelistedToken } from '@utils/types';
import { localSearchToken } from '@utils/helpers';
import { useDexufs } from './useDexbufs';

export const useTokenMetadata = () => {
  const network = useNetwork();
  const tezos = useTezos();
  const allFarms = useAllFarms();
  const dexbufs = useDexufs();
  const { data: tokens } = useTokens();
  const searchCustomToken = useSearchCustomTokens();
  const [tokensMetadata, setTokensMetadata] = useState<WhitelistedToken[]>();

  const searchPart = useCallback(async (address:string, id:BigNumber):Promise<WhitelistedToken> => {
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
  }, [network, tokens]);

  useEffect(() => {
    const loadTokenMetadata = async () => {
      if (!tezos) return;
      if (!network) return;
      if (!allFarms) return;
      if (!dexbufs) return;

      const tokenMetadata = dexbufs.map((dexbuf) => (
        searchPart(dexbuf.storage.token_address, dexbuf.storage.token_id)
      ));
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
  }, [allFarms, tezos, network, dexbufs]);

  return tokensMetadata;
};
