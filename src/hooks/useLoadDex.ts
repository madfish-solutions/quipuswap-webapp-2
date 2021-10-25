import {useCallback, useEffect, useState} from 'react';

import {useNetwork, useTezos} from '@utils/dapp';
import {QSMainNet, WhitelistedToken} from '@utils/types';
import {STABLE_TOKEN, TEZOS_TOKEN} from '@utils/defaults';
import {FoundDex} from '@quipuswap/sdk';
import {getDex} from '@containers/SwapSend/swapHelpers';
import {isTokenEqual} from '@utils/helpers';

interface UseLoadDexArgs {
  token1: WhitelistedToken;
  token2: WhitelistedToken;
}

let curDate = Date.now();

export const useLoadDex = ({token1, token2}: UseLoadDexArgs) => {
  const [localToken1, setLocalToken1] = useState(token1 || TEZOS_TOKEN);
  const [localToken2, setLocalToken2] = useState(token2 || STABLE_TOKEN);
  const [[dex1, dex2], setDex] = useState<FoundDex[]>([]);
  const [[dexStorage1, dexStorage2], setDexStorage] = useState<any>([]);
  const tezos = useTezos();
  const networkId = useNetwork().id as QSMainNet;
  const loadDex = useCallback(() => {
    if (!tezos || !localToken2 || !localToken1) return;
    curDate = Date.now();
    getDex({
      tezos,
      networkId,
      token1: localToken1,
      token2: localToken2,
      nonce: curDate,
    })
      .then((x) => {
        if (curDate !== x.nonce) return;
        const {dexes, storages} = x;
        setDex(dexes);
        setDexStorage(storages);
      })
      .catch(() => {
        // todo, fall silently
      });
  }, [tezos, localToken1, localToken2, networkId]);

  useEffect(() => {
    if (!(isTokenEqual(token1, localToken2) && isTokenEqual(token2, localToken1))) {
      setLocalToken1(token1);
      setLocalToken2(token2);
    }
  }, [token1, token2, localToken1, localToken2]);

  useEffect(() => {
    loadDex();
  }, [loadDex]);

  return {
    dexes: [dex1, dex2],
    storages: [dexStorage1, dexStorage2],
    setDex,
    setDexStorage,
  };
};
