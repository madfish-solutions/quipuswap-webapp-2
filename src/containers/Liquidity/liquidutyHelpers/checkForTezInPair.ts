import { TEZOS_TOKEN } from '@utils/defaults';

export const checkForTezInPair = (contractAddressA: string, contractAddressB: string) =>
  [contractAddressA, contractAddressB].includes(TEZOS_TOKEN.contractAddress);
