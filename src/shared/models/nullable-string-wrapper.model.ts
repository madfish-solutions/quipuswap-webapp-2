import { NullableStringWrapperDto } from '@shared/dto';

export class NullableStringWrapperModel extends NullableStringWrapperDto {
  constructor(dto: NullableStringWrapperDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof UsersInfoResponseDto];
    }
  }
}
