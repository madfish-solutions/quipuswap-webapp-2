import { Typed } from '@shared/decorators';
import { Standard, Token } from '@shared/types';

import { TokenMetadataDto } from './token-metadata.dto';

export class TokenDto implements Token {
  @Typed({ isEnum: true })
  type: Standard;

  @Typed()
  isWhitelisted: boolean;

  @Typed()
  metadata: TokenMetadataDto;

  @Typed()
  contractAddress: string;

  @Typed()
  fa2TokenId?: number;
}
