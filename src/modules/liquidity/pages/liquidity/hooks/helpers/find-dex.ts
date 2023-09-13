import {
  chooseDex,
  ContractOrAddress,
  DexNotFoundError,
  Factories,
  FoundDex,
  isFA2Token,
  Token as QuipuswapSdkToken,
  toContract,
  toContractAddress
} from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import { resolveOrNull } from '@shared/helpers';

export async function findDex(
  tezos: TezosToolkit,
  { fa1_2Factory, fa2Factory }: Factories,
  token: QuipuswapSdkToken
): Promise<FoundDex> {
  let factories = isFA2Token(token) ? fa2Factory : fa1_2Factory;
  if (!Array.isArray(factories)) {
    factories = [factories];
  }

  const tokenAddress = toContractAddress(token.contract);
  const t2dexQuery = isFA2Token(token) ? [tokenAddress, token.id] : tokenAddress;

  const dexes: FoundDex[] = [];
  await Promise.all(
    factories.map(async factory => {
      const facContract = await toContract(tezos, factory);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const facStorage = await facContract.storage<any>();
      const dexAddress = await resolveOrNull(facStorage.token_to_exchange.get(t2dexQuery));

      if (dexAddress) {
        const dexContract = await toContract(tezos, dexAddress as ContractOrAddress);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dexStorage = await dexContract.storage<any>();
        dexes.push(new FoundDex(dexContract, dexStorage));
      }
    })
  );

  if (dexes.length > 1) {
    return dexes.sort(chooseDex)[0];
  } else if (dexes.length === 1) {
    return dexes[0];
  } else {
    throw new DexNotFoundError();
  }
}
