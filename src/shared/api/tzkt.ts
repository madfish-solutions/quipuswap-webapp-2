import { TZKT_API_CONTRACTS_URL } from '@config/config';

export namespace Tzkt {
  export const getContractBigmapKeys = async <T>(contractAddress: string, bigmap: string): Promise<Array<T>> => {
    return fetch(`${TZKT_API_CONTRACTS_URL}/${contractAddress}/bigmaps/${bigmap}/keys`).then(async res => res.json());
  };
}
