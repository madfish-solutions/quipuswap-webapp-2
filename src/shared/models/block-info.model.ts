import { BlockInfoDto } from '@shared/dto';

export class BlockInfoModel extends BlockInfoDto {
  constructor(dto: BlockInfoDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key];
    }
  }
}
