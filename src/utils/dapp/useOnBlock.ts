import { useEffect, useRef } from 'react';

import { Subscription } from '@taquito/taquito/dist/types/subscribe/interface';

import { useTezos } from '@utils/dapp/dapp';

export const useOnBlock = (callback: (hash: string) => void) => {
  const tezos = useTezos();

  const blockHashRef = useRef<string | undefined>();

  useEffect(() => {
    let sub: Subscription<string>; // Which type do I have to set here?

    if (!tezos) {
      return () => undefined;
    }

    const spawnSub = () => {
      sub = tezos.stream.subscribe('head');

      sub.on('data', hash => {
        if (blockHashRef.current && blockHashRef.current !== hash) {
          callback(hash);
        }
        blockHashRef.current = hash;
      });

      sub.on('error', (err: Error) => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line
          console.error(err);
        }
        sub.close();
        spawnSub();
      });
    };

    spawnSub();

    return () => sub.close();
  }, [tezos, callback]);
};
