import { FIRST_TUPLE_INDEX, SECOND_TUPLE_INDEX } from '@config/constants';

import { LiquidityItemResponseDto } from '../dto';

export class LiquidityItemModel extends LiquidityItemResponseDto {
  constructor(dto: LiquidityItemResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key];
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
