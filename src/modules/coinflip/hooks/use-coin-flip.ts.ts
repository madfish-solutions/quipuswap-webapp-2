import { COINFLIP_CONTRACT_ADDRESS } from '@config/enviroment';
import { TEZOS_TOKEN_DECIMALS } from '@config/tokens';
import { CoinflipStorage, TOKEN_ASSETS } from '@modules/coinflip/api/types';
import { useCoinflipStore } from '@modules/coinflip/hooks';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import { getContract } from '@shared/dapp';
import { isNull, isTezosToken, toDecimals } from '@shared/helpers';
import { useConfirmOperation, useToasts } from '@shared/utils';

import { betTokens } from '../api';

export const useCoinFlip = () => {
  const { tezos } = useRootStore();
  const { game, token } = useCoinflipStore();
  const { coinSide, input } = game;
  const accountPkh = useAccountPkh();
  const confirmOperation = useConfirmOperation();
  const { showErrorToast } = useToasts();

  const handleCoinFlip = async () => {
    if (isNull(input) || isNull(tezos) || isNull(accountPkh) || isNull(coinSide)) {
      return null;
    }

    try {
      const tokenAsset = isTezosToken(token) ? TOKEN_ASSETS.TEZOS : TOKEN_ASSETS.QUIPU;
      const formattedAmount = toDecimals(input, TEZOS_TOKEN_DECIMALS);

      const contract = await getContract(tezos, COINFLIP_CONTRACT_ADDRESS);
      const { network_fee } = await contract.storage<CoinflipStorage>();

      const fee = isTezosToken(token) ? network_fee.plus(formattedAmount) : network_fee;

      const operation = await betTokens(tezos, token, accountPkh, tokenAsset, formattedAmount, coinSide, fee);

      await confirmOperation(operation.opHash, { message: 'Bet succesfull!' });
    } catch (error) {
      showErrorToast(error as Error);
    }
  };

  return { handleCoinFlip };
};
