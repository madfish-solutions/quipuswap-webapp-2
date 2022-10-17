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

  get totalLpSupply() {
    return this.item.totalSupply;
  }

  get type() {
    return this.item.type;
  }

  get aToken() {
    return this.item.tokensInfo[FIRST_TUPLE_INDEX].token;
  }

  get bToken() {
    return this.item.tokensInfo[SECOND_TUPLE_INDEX].token;
  }

  get tokensInfo() {
    return this.item.tokensInfo;
  }
}
