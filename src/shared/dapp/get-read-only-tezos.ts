import { TezosToolkit } from '@taquito/taquito';
import memoizee from 'memoizee';

import { READ_ONLY_SIGNER_PK, READ_ONLY_SIGNER_PK_HASH } from '@config/config';

import { ReadOnlySigner } from '../helpers/readonly-signer';

const readOnlySigner = new ReadOnlySigner(READ_ONLY_SIGNER_PK, READ_ONLY_SIGNER_PK_HASH);

export const createReadOnlyTezos = (origin: TezosToolkit) => {
  const roTezos = new TezosToolkit(origin.rpc);
  roTezos.setSignerProvider(readOnlySigner);

  return roTezos;
};

export const getReadOnlyTezos = memoizee(createReadOnlyTezos, {
  normalizer: ([tezos]) => tezos.rpc.getRpcUrl()
});
