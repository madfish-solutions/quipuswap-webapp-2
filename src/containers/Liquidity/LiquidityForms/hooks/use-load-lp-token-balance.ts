import { useState, useEffect } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { useAccountPkh, useTezos } from '@utils/dapp';
import { WhitelistedToken } from '@utils/types';

import { loadUserLpBalanceTez } from '../blockchain';
import { getValidMichelTemplate, isTezInPair, sortTokensContracts } from '../helpers';

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const MichelCodec = require('@taquito/michel-codec');

const DEFAULT_BALANCE = 0;

export const useLoadLpTokenBalance = (dex: FoundDex, tokenA: WhitelistedToken, tokenB: WhitelistedToken) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [lpTokenBalance, setLpTokenBalance] = useState<BigNumber>(new BigNumber(DEFAULT_BALANCE));

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    let isMounted = true;
    const getLpTokenBalance = async () => {
      if (!tezos || !accountPkh) {
        return;
      }

      const isTezosToTokenDex = isTezInPair(tokenA.contractAddress, tokenB.contractAddress);

      if (isTezosToTokenDex) {
        const userLpTokenBalance = await loadUserLpBalanceTez(tezos, accountPkh, dex, tokenA, tokenB);

        if (userLpTokenBalance && isMounted) {
          setLpTokenBalance(userLpTokenBalance);
        }
      } else if (!isTezosToTokenDex) {
        const addresses = sortTokensContracts(tokenA, tokenB);
        if (!addresses) {
          return;
        }

        const michelData = getValidMichelTemplate(addresses);
        const key = Buffer.from(MichelCodec.packData(michelData)).toString('hex');
        const pairId = await dex.storage.storage.token_to_id.get(key);
        if (pairId) {
          const userLpTokenBalance = await dex.storage.storage.ledger.get([accountPkh, pairId]);

          if (userLpTokenBalance && isMounted) {
            setLpTokenBalance(userLpTokenBalance.balance);
          }
        }
      }
    };
    void getLpTokenBalance();

    return () => {
      isMounted = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tezos, accountPkh, dex]);

  return lpTokenBalance;
};
