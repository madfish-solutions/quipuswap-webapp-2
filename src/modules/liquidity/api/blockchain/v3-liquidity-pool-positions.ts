import { TezosToolkit } from '@taquito/taquito';

import { withApproveApiForManyTokens } from '@blockchain';
import { DEX_TWO_CONTRACT_ADDRESS } from '@config/environment';
import { AmountToken } from '@shared/types';

export namespace V3Positions {
  export const doNewPositionTransaction = async (tezos: TezosToolkit, accountPkh: string, contractAddress: string) => {
    const contract = await tezos.wallet.at(contractAddress);
    // eslint-disable-next-line no-console
    console.log('contractAddress', contractAddress, contract);

    const operationParams = contract.methods.set_position().toTransferParams({});

    const cleanedTokensAmount: AmountToken[] = [];

    return await withApproveApiForManyTokens(tezos, DEX_TWO_CONTRACT_ADDRESS, cleanedTokensAmount, accountPkh, [
      operationParams
    ]);
  };
}
