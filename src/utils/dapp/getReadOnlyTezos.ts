import { TezosToolkit } from '@taquito/taquito';
import { ReadOnlySigner } from '@quipuswap/sdk';
import memoizee from 'memoizee';

import { READ_ONLY_SIGNER_PK, READ_ONLY_SIGNER_PK_HASH } from '../defaults';

const readOnlySigner = new ReadOnlySigner(
  READ_ONLY_SIGNER_PK_HASH,
  READ_ONLY_SIGNER_PK,
);

export const createReadOnlyTezos = (origin: TezosToolkit) => {
  const roTezos = new TezosToolkit(origin.rpc);
  roTezos.setSignerProvider(readOnlySigner);
  return roTezos;
};

export const getReadOnlyTezos = memoizee(createReadOnlyTezos, {
  normalizer: ([tezos]) => tezos.rpc.getRpcUrl(),
});
