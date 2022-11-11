import { Typed } from '@shared/decorators';
import type { Nullable } from '@shared/types';

export class NullableStringWrapperDto {
  @Typed({ type: String, nullable: true })
  value: Nullable<string>;
}
