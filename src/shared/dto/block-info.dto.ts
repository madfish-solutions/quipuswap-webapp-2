import { Typed } from '@shared/decorators';

import { BlockInfo } from '../types';

export class BlockInfoDto implements BlockInfo {
  @Typed()
  level: number;

  @Typed()
  hash: string;

  @Typed()
  timestamp: string;
}
