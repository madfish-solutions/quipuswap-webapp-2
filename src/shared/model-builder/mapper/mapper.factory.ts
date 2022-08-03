import { bigNumberMapper } from '../../mapping/big-number.map';
import { booleanMapper } from '../../mapping/boolean.map';
import { numberMapper } from '../../mapping/number.map';
import { stringMapper } from '../../mapping/string.map';
import { MapperKinds } from './mapper-kinds.enum';

export const mapperFactory: Record<MapperKinds, (arg: unknown, optional: boolean, nullable: boolean) => unknown> = {
  [MapperKinds.NUMBER]: numberMapper,
  [MapperKinds.BIGNUMBER]: bigNumberMapper,
  [MapperKinds.BOOLEAN]: booleanMapper,
  [MapperKinds.STRING]: stringMapper
};
