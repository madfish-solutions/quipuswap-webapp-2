import { ThreeRouteSwapChainDto } from '../dto';
import { ThreeRouteHopModel } from './three-route-hop.model';

export class ThreeRouteSwapChainModel extends ThreeRouteSwapChainDto {
  hops: ThreeRouteHopModel[];

  constructor(dto: ThreeRouteSwapChainDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof ThreeRouteSwapChainDto];
    }
    this.hops = dto.hops.map(hop => new ThreeRouteHopModel(hop));
  }
}
