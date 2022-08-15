import { Typed } from '@shared/decorators';

export class NullableStringWrapperDto {
  @Typed({ nullable: true })
  value: string;
}
