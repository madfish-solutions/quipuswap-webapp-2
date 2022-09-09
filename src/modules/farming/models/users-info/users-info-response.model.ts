import { UsersInfoResponseDto } from '../../dto';

export class UsersInfoResponseModel extends UsersInfoResponseDto {
  constructor(dto: UsersInfoResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof UsersInfoResponseDto];
    }
  }
}
