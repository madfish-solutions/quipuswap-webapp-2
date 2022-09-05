import { BigNumber } from 'bignumber.js';

import { getFA2ApproveParams, sendBatch } from '@blockchain';
import { COINFLIP_CONTRACT_ADDRESS } from '@config/environment';
import { QUIPU_TOKEN, TEZOS_TOKEN_DECIMALS } from '@config/tokens';
import { CoinflipStorage, TOKEN_ASSETS } from '@modules/coinflip/api/types';
import { useGamersStats, useUserLastGame, useUserPendingGame } from '@modules/coinflip/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { getContract } from '@shared/dapp';
import { isNull, toAtomic } from '@shared/helpers';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { getHarvestAllParams } from '../../farming/api';
import { useStakedOnlyFarmIds } from '../../farming/hooks/use-staked-only-farm-ids';
import { getBetTokensParams } from '../api';

export const useHarvestAndRoll = () => {
  const { tezos } = useRootStore();
  const accountPkh = useAccountPkh();
  const { showErrorToast } = useToasts();
  const { getStakedOnlyFarmIds } = useStakedOnlyFarmIds();
  const { getGamersStats } = useGamersStats();
  const { loadUserLastGame } = useUserLastGame();
  const { getUserPendingGame } = useUserPendingGame();
  const confirmOperation = useConfirmOperation();

  const token = QUIPU_TOKEN;

  const doHarvestAndRoll = async (inputAmount: BigNumber, coinSide: string) => {
    if (isNull(inputAmount) || isNull(tezos) || isNull(accountPkh) || isNull(coinSide)) {
      return null;
    }

    const stakedOnlyFarmIds = getStakedOnlyFarmIds();

    try {
      const atomicInputAmount = toAtomic(inputAmount, TEZOS_TOKEN_DECIMALS);

      const contract = await getContract(tezos, COINFLIP_CONTRACT_ADDRESS);
      const { network_fee } = await contract.storage<CoinflipStorage>();

      const fee = network_fee;

      const harvestOperationsParams = await getHarvestAllParams(tezos, stakedOnlyFarmIds, accountPkh);

      const betOperationParams = await getBetTokensParams(
        tezos,
        token,
        accountPkh,
        TOKEN_ASSETS.QUIPU,
        atomicInputAmount,
        coinSide,
        fee
      );

      const oparation = await sendBatch(tezos, [
        ...harvestOperationsParams,
        ...(await getFA2ApproveParams(tezos, COINFLIP_CONTRACT_ADDRESS, token, accountPkh, [betOperationParams]))
      ]);

      await confirmOperation(oparation.opHash);

      await getGamersStats();
      await loadUserLastGame();
      await getUserPendingGame();
    } catch (error) {
      showErrorToast(error as Error);
    }
  };

  return { doHarvestAndRoll };
};
