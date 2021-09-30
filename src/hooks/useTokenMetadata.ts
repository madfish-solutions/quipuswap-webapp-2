import { useEffect, useState } from 'react';
import {
  getStorageInfo,
  useNetwork, useSearchCustomTokens,
  useTezos, useTokens,
} from '@utils/dapp';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import { ContractAbstraction, ContractProvider } from '@taquito/taquito';
import { QSMainNet, WhitelistedToken } from '@utils/types';
import {
  findDex, FoundDex, Token,
} from '@quipuswap/sdk';
import { useFarms } from '@hooks/useFarms';
import { localSearchToken } from '@utils/helpers';
import BigNumber from 'bignumber.js';

export const useTokenMetadata = () => {
  const network = useNetwork();
  const tezos = useTezos();
  const allFarms = useFarms();
  const { data: tokens } = useTokens();
  const searchCustomToken = useSearchCustomTokens();
  const networkId:QSMainNet = useNetwork().id as QSMainNet;
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
      const dexs = allFarms.map((farm) => {
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

        return findDex(tezos, FACTORIES[networkId], asset);
      });
      const dexbufsArr = await Promise.all<ContractAbstraction<ContractProvider> | FoundDex>(dexs);
      const tokenMetadata = dexbufsArr.map((dexbuf) => (
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
  }, [allFarms, tezos, networkId]);

  return tokensMetadata;
};
