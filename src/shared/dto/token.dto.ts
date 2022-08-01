import { Typed } from '@shared/decorators';
import { Standard, Token } from '@shared/types';

import { TokenMetadataDto } from './token-metadata.dto';

export class TokenDto implements Token {
  @Typed({ type: String })
  type!: Standard;

  @Typed({ type: Boolean })
  isWhitelisted!: boolean;

  @Typed({ type: TokenMetadataDto })
  metadata!: TokenMetadataDto;

  @Typed({ type: String })
  contractAddress!: string;

  @Typed({ type: Number })
  fa2TokenId?: number;
}
