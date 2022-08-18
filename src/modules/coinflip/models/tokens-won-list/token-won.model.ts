import { TokenWonDto } from '../../dto';

export class TokenWonModel extends TokenWonDto {
  constructor(dto: TokenWonDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof TokenWonDto];
    }
  }
}
