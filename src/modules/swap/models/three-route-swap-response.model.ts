import { ThreeRouteSwapResponseDto } from '../dto';
import { ThreeRouteSwapChainModel } from './three-route-swap-chain.model';

export class ThreeRouteSwapResponseModel extends ThreeRouteSwapResponseDto {
  chains: ThreeRouteSwapChainModel[];

  constructor(dto: ThreeRouteSwapResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof ThreeRouteSwapResponseDto];
    }
    this.chains = dto.chains.map(chain => new ThreeRouteSwapChainModel(chain));
  }
}
