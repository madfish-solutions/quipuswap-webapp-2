import { useEffect, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { getValidMichelTemplate, sortTokensContracts } from '@containers/Liquidity/liquidutyHelpers';
import { WhitelistedToken } from '@utils/types';

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const MichelCodec = require('@taquito/michel-codec');

export const usePairData = ({
  dex,
  tokenA,
  tokenB
}: {
  dex: FoundDex | null;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
}) => {
  const [pairId, setPairId] = useState();
  const [pairData, setPairDataInfo] = useState<{
    totalSupply: BigNumber;
    tokenAPool: BigNumber;
    tokenBPool: BigNumber;
  } | null>(null);

  useEffect(() => {
    const loadPairData = async () => {
      if (!dex) {
        return;
      }

      const addresses = sortTokensContracts(tokenA, tokenB);
      if (!addresses) {
        return;
      }

      const michelData = getValidMichelTemplate(addresses);
      const key = Buffer.from(MichelCodec.packData(michelData)).toString('hex');

      const pairIdTemp = await dex.storage.storage.token_to_id.get(key);
      setPairId(pairIdTemp);

      if (pairIdTemp) {
        const pairDataTemp = await dex.storage.storage.pairs.get(pairIdTemp);
        setPairDataInfo({
          totalSupply: pairDataTemp.total_supply,
          tokenAPool: pairDataTemp.token_a_pool,
          tokenBPool: pairDataTemp.token_b_pool
        });
      } else {
        setPairDataInfo(null);
      }
    };

    void loadPairData();
  }, [dex, tokenA, tokenB]);

  return {
    pairId,
    pairData
  };
};
