import { bigNumberMapper, booleanMapper, numberMapper, stringMapper } from '../../mapping';
import { MapperKinds } from './mapper-kinds.enum';

export const mapperFactory: Record<MapperKinds, (arg: unknown, optional: boolean, nullable: boolean) => unknown> = {
  [MapperKinds.NUMBER]: numberMapper,
  [MapperKinds.BIGNUMBER]: bigNumberMapper,
  [MapperKinds.BOOLEAN]: booleanMapper,
  [MapperKinds.STRING]: stringMapper
};
