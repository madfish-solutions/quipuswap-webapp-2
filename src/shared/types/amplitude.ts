import { BigMapAbstraction } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

export interface PartialStableswapDevFee {
  storage: {
    dev_store: {
      dev_fee_f: BigNumber;
    };
  };
}

export interface PartialStableswapFactoryContractField {
  storage: {
    dev_store: {
      dev_fee_f: BigNumber;
    };
  };
}

export interface PartialStableswapPoolContractField {
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

export interface PartialDexTwoFees {
  storage: {
    fees: {
      auction_fee: BigNumber;
    };
  };
}
