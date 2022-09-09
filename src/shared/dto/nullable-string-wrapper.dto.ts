import { Typed } from '@shared/decorators';

export class NullableStringWrapperDto {
  @Typed({ type: String, nullable: true })
  value: Nullable<string>;
}
