import { Typed } from '@shared/decorators';

import { ThreeRouteTokenDto } from './three-route-token.dto';

export class ThreeRouteTokensResponseDto {
  @Typed({ type: ThreeRouteTokenDto, isArray: true })
  tokens: ThreeRouteTokenDto[];
}
