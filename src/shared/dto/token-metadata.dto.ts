import { Typed } from '@shared/decorators';
import { TokenMetadata } from '@shared/types';

export class TokenMetadataDto implements TokenMetadata {
  @Typed()
  decimals!: number;

  @Typed()
  symbol!: string;

  @Typed()
  name!: string;

  @Typed()
  thumbnailUri!: string;
}
