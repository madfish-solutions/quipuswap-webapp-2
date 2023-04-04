import { ThreeRouteTokensResponseDto } from '../dto';
import { ThreeRouteTokenModel } from './three-route-token.model';

export class ThreeRouteTokensResponseModel extends ThreeRouteTokensResponseDto {
  tokens: ThreeRouteTokenModel[];

  constructor(dto: ThreeRouteTokensResponseDto) {
    super();

    this.tokens = dto.tokens.map(token => new ThreeRouteTokenModel(token));
  }
}
