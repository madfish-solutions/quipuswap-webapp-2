import { TezosToolkit } from '@taquito/taquito';

export const getDeadline = async (tezos: TezosToolkit): Promise<string> => {
  const ONE_THOUSAND = 1000;
  const FIFTEEN_MINUTES_IN_SECONDS = 900;

  const currentTime = (await tezos.rpc.getBlockHeader()).timestamp;

  const currentTimeMilliseconds = new Date(currentTime).getTime();
  const currentTimeSeconds = currentTimeMilliseconds / ONE_THOUSAND;

  return (currentTimeSeconds + FIFTEEN_MINUTES_IN_SECONDS).toString();
};
