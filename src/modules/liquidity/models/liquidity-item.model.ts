import BigNumber from 'bignumber.js';

import { FIRST_TUPLE_INDEX, SECOND_TUPLE_INDEX } from '@config/constants';
import { isEmptyArray } from '@shared/helpers';

import { LiquidityItemResponseDto } from '../dto';
import { PoolType } from '../interfaces';

export class LiquidityItemModel extends LiquidityItemResponseDto {
  constructor(dto: LiquidityItemResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key];
    }

    //TODO: fix stableswap maxApr https://madfish.atlassian.net/browse/QUIPU-623
    if (this.type === PoolType.STABLESWAP && this.item.opportunities && !isEmptyArray(this.item.opportunities)) {
      this.item.maxApr = this.item.opportunities
        .reduce((max, { apr }) => BigNumber.max(max, apr), new BigNumber(0))
        .toNumber();
    }
  }

  get contractAddress() {
    return this.item.contractAddress;
  }

  get id() {
    return this.item.id;
  }

  get aTokenAtomicTvl() {
    return this.item.tokensInfo[FIRST_TUPLE_INDEX].atomicTokenTvl;
  }

  get bTokenAtomicTvl() {
    return this.item.tokensInfo[SECOND_TUPLE_INDEX].atomicTokenTvl;
  }

  get tvlInUsd() {
    return this.item.tvlInUsd;
  }

  get totalLpSupply() {
    return this.item.totalSupply;
  }

  get type() {
    return this.item.type;
  }

  get tokensInfo() {
    return this.item.tokensInfo;
  }

  get tokens() {
    return this.tokensInfo.map(({ token }) => token);
  }
}
