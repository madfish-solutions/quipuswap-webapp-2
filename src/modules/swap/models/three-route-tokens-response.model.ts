import { ThreeRouteTokenModel } from './three-route-token.model';
import { ThreeRouteTokensResponseDto } from '../dto';

export class ThreeRouteTokensResponseModel extends ThreeRouteTokensResponseDto {
  tokens: ThreeRouteTokenModel[];

  constructor(dto: ThreeRouteTokensResponseDto) {
    super();

    this.tokens = dto.tokens.map(token => new ThreeRouteTokenModel(token));
  }
}
