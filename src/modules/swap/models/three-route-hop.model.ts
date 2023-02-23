import { ThreeRouteHopDto } from '../dto';

export class ThreeRouteHopModel extends ThreeRouteHopDto {
  constructor(dto: ThreeRouteHopDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof ThreeRouteHopDto];
    }
  }
}
