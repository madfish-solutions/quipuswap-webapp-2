import { BigNumber } from 'bignumber.js';

import { sendBatch } from '@blockchain';
import { COINFLIP_CONTRACT_ADDRESS } from '@config/environment';
import { TEZOS_TOKEN_DECIMALS } from '@config/tokens';
import { CoinflipStorage, TOKEN_ASSETS } from '@modules/coinflip/api/types';
import { useCoinflipStore } from '@modules/coinflip/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { getContract } from '@shared/dapp';
import { isNull, isTezosToken, toAtomic } from '@shared/helpers';
import { useToasts } from '@shared/utils';

import { getHarvestAllParams } from '../../farming/api';
import { useStakedOnlyFarmIds } from '../../farming/hooks/use-staked-only-farm-ids';
import { getBetTokensParams } from '../api';

export const useHarvestAndRoll = () => {
  const { tezos } = useRootStore();
  const { token } = useCoinflipStore();
  const accountPkh = useAccountPkh();
  const { showErrorToast } = useToasts();
  const { getStakedOnlyFarmIds } = useStakedOnlyFarmIds();

  const doHarvestAndRoll = async (inputAmount: BigNumber, coinSide: string) => {
    if (isNull(inputAmount) || isNull(tezos) || isNull(accountPkh) || isNull(coinSide)) {
      return null;
    }

    const stakedOnlyFarmIds = getStakedOnlyFarmIds();

    try {
      const tokenAsset = isTezosToken(token) ? TOKEN_ASSETS.TEZOS : TOKEN_ASSETS.QUIPU;
      const atomicInputAmount = toAtomic(inputAmount, TEZOS_TOKEN_DECIMALS);

      const contract = await getContract(tezos, COINFLIP_CONTRACT_ADDRESS);
      const { network_fee } = await contract.storage<CoinflipStorage>();

      const fee = isTezosToken(token) ? network_fee.plus(atomicInputAmount) : network_fee;

      const harvestOperations = await getHarvestAllParams(tezos, stakedOnlyFarmIds, accountPkh);

      const betOperation = await getBetTokensParams(
        tezos,
        token,
        accountPkh,
        tokenAsset,
        atomicInputAmount,
        coinSide,
        fee
      );

      await sendBatch(tezos, [...harvestOperations, betOperation]);
    } catch (error) {
      showErrorToast(error as Error);
    }
  };

  return { doHarvestAndRoll };
};
