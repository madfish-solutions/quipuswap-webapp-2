import { ThreeRouteTokenDto } from '../dto';

export class ThreeRouteTokenModel extends ThreeRouteTokenDto {
  constructor(dto: ThreeRouteTokenDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof ThreeRouteTokenDto];
    }
  }
}
