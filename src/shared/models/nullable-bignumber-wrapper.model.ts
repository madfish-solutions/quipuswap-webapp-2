import { NullableBigNumberWrapperDto } from '@shared/dto';

export class NullableBigNumberWrapperModel extends NullableBigNumberWrapperDto {
  constructor(dto: NullableBigNumberWrapperDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof UsersInfoResponseDto];
    }
  }
}
