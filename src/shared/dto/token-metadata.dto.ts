import { Typed } from '@shared/decorators';
import { TokenMetadata } from '@shared/types';

export class TokenMetadataDto implements TokenMetadata {
  @Typed({ type: Number })
  decimals!: number;

  @Typed({ type: String })
  symbol!: string;

  @Typed({ type: String })
  name!: string;

  @Typed({ type: String })
  thumbnailUri!: string;
}
