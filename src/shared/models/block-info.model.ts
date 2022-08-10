import { BlockInfoDto } from '@shared/dto';

export class BlockInfoModel extends BlockInfoDto {
  [key: string]: BlockInfoDto[keyof BlockInfoDto];
  constructor(dto: BlockInfoDto) {
    super();

    for (const key in dto) {
      this[key] = dto[key as keyof BlockInfoDto];
    }
  }
}
