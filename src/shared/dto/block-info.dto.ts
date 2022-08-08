import { Typed } from '@shared/decorators';

export class BlockInfoDto {
  @Typed()
  level: number;

  @Typed()
  hash: string;

  @Typed()
  timestamp: string; //should be Date?
}
