import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { sendBatch } from '@blockchain';
import { ZERO_AMOUNT_BN } from '@config/constants';
import { DEX_V3_FACTORY_ADDRESS } from '@config/environment';
import { getContract, getStorageInfo } from '@shared/dapp';
import { defined, getTransactionDeadline } from '@shared/helpers';
import { address, BigMap, nat, TokensValue } from '@shared/types';

const QUIPUSWAP_REFERRAL_CODE = 1;

export namespace BlockchainLiquidityV3Api {
  export interface V3PoolStorage {
    constants: {
      ctez_burn_fee_bps: nat;
      dev_fee_bps: nat;
      factory_address: nat;
      fee_bps: nat;
      tick_spacing: nat;
      token_x: TokensValue;
      token_y: TokensValue;
    };
    sqrt_price: nat;
    liquidity: nat;
  }

  interface V3FactoryStorage {
    pools: BigMap<nat, address>;
  }

  export const getPool = async (tezos: TezosToolkit, id: BigNumber) => {
    const factoryStorage = await getStorageInfo<V3FactoryStorage>(tezos, DEX_V3_FACTORY_ADDRESS);
    const contractAddress = defined(await factoryStorage.pools.get(id), 'contractAddress');

    return {
      contractAddress,
      storage: await getStorageInfo<V3PoolStorage>(tezos, contractAddress)
    };
  };

  export const claimFees = async (
    tezos: TezosToolkit,
    contractAddress: string,
    positionsIds: BigNumber[],
    accountPkh: string,
    transactionDuration: BigNumber
  ) => {
    const contract = await getContract(tezos, contractAddress);
    const transactionDeadline = await getTransactionDeadline(tezos, transactionDuration);

    return await sendBatch(
      tezos,
      positionsIds.map(id =>
        contract.methods
          .update_position(
            id,
            ZERO_AMOUNT_BN,
            accountPkh,
            accountPkh,
            transactionDeadline,
            ZERO_AMOUNT_BN,
            ZERO_AMOUNT_BN,
            QUIPUSWAP_REFERRAL_CODE
          )
          .toTransferParams()
      )
    );
  };
}
