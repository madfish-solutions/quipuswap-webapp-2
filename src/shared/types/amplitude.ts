import { BigMapAbstraction } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

export interface StableswapDevFee {
  storage: {
    dev_store: {
      dev_fee_f: BigNumber;
    };
  };
}

export interface StableswapFactoryContractField {
  storage: {
    dev_store: {
      dev_fee_f: BigNumber;
    };
  };
}

export interface StableswapPoolContractField {
  storage: {
    pools: BigMapAbstraction;
  };
}

export interface Pools {
  fee: {
    lp_f: BigNumber;
    ref_f: BigNumber;
    stakers_f: BigNumber;
  };
}

export interface DexTwoFees {
  storage: {
    fees: {
      auction_fee: BigNumber;
    };
  };
}
