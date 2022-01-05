import { TEZOS_TOKEN } from '@app.config';

export const isTezInPair = (contractAddressA: string, contractAddressB: string) =>
  [contractAddressA, contractAddressB].includes(TEZOS_TOKEN.contractAddress);
