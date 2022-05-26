import { Contract, TezosToolkit, WalletContract } from '@taquito/taquito';
import retry from 'async-retry';

import { TokenStandardEnum } from '../enum/token-standard.enum';

const isEntrypointsMatched = (entrypoints: Record<string, any>, schema: string[][]) => {
  try {
    for (const [name, prim, ...args] of schema) {
      const entry = entrypoints[name];
      if (
        !entry ||
        entry.prim !== prim ||
        entry.args.length !== args.length ||
        args.some((arg, i) => arg !== entry.args[i]?.prim)
      ) {
        return false;
      }
    }

    return true;
  } catch (err) {
    console.error(err);

    return false;
  }
};

const RETRY_PARAMS = { retries: 3, minTimeout: 0, maxTimeout: 0 };

const FA2_ENTRYPOINTS_SCHEMA = [
  ['balance_of', 'pair', 'list', 'contract'],
  ['transfer', 'list', 'pair'],
  ['update_operators', 'list', 'or']
];

const FA1_2_ENTRYPOINTS_SCHEMA = [
  ['approve', 'pair', 'address', 'nat'],
  ['transfer', 'pair', 'address', 'address', 'nat'],
  ['getAllowance', 'pair', 'pair', 'contract'],
  ['getBalance', 'pair', 'address', 'contract'],
  ['getTotalSupply', 'pair', 'unit', 'contract']
];

export const detectTokenStandard = async (
  tezos: TezosToolkit,
  contract: string | Contract | WalletContract
): Promise<TokenStandardEnum | null> => {
  const { entrypoints } =
    typeof contract === 'string'
      ? await retry(async () => tezos.rpc.getEntrypoints(contract), RETRY_PARAMS)
      : contract.entrypoints;

  switch (true) {
    case isEntrypointsMatched(entrypoints, FA2_ENTRYPOINTS_SCHEMA):
      return TokenStandardEnum.FA2;

    case isEntrypointsMatched(entrypoints, FA1_2_ENTRYPOINTS_SCHEMA):
      return TokenStandardEnum.FA1_2;

    default:
      return null;
  }
};
