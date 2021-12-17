import { useState, useEffect } from 'react';

import { FoundDex } from '@quipuswap/sdk';

import {
  findNotTezTokenInPair,
  sortTokensContracts,
  getValidMichelTemplate,
  isTezInPair
} from '@containers/Liquidity/liquidutyHelpers';
import { getUserBalance, useAccountPkh, useTezos } from '@utils/dapp';
import { Nullable, WhitelistedToken } from '@utils/types';

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const MichelCodec = require('@taquito/michel-codec');

export const useLoadLpTokenBalance = (
  dex: Nullable<FoundDex>,
  tokenA: Nullable<WhitelistedToken>,
  tokenB: Nullable<WhitelistedToken>
) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [lpTokenBalance, setLpTokenBalance] = useState<string>('0');

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    let isMounted = true;
    const getLpTokenBalance = async () => {
      if (!tezos || !accountPkh || !dex || !tokenA || !tokenB) {
        return;
      }

      const isTezosToTokenDex = isTezInPair(tokenA.contractAddress, tokenB.contractAddress);

      if (isTezosToTokenDex) {
        const notTezToken = findNotTezTokenInPair(tokenA, tokenB);

        const { address } = dex.contract;
        const { type, fa2TokenId } = notTezToken;

        const userLpTokenBalance = await getUserBalance(tezos, accountPkh, address, type, fa2TokenId);

        if (userLpTokenBalance && isMounted) {
          setLpTokenBalance(userLpTokenBalance.dividedBy(1_000_000).toFixed());
        } else if (!userLpTokenBalance && isMounted) {
          setLpTokenBalance('0');
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
            setLpTokenBalance(userLpTokenBalance.balance.dividedBy(1_000_000).toFixed());
          } else if (!userLpTokenBalance && isMounted) {
            setLpTokenBalance('0');
          }
        } else if (!pairId && isMounted) {
          setLpTokenBalance('0');
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
