import { michelsonMapMapper } from '@shared/mapping/michelson-map.map';
import { Undefined } from '@shared/types';

import { MapperKinds } from './mapper-kinds.enum';
import { bigNumberMapper } from '../../mapping/big-number.map';
import { booleanMapper } from '../../mapping/boolean.map';
import { dateMapper } from '../../mapping/date.map';
import { numberMapper } from '../../mapping/number.map';
import { stringMapper } from '../../mapping/string.map';
import { symbolMapper } from '../../mapping/symbol.map';

export const mapperFactory: Record<
  MapperKinds,
  (arg: unknown, optional: Undefined<boolean>, nullable: Undefined<boolean>) => unknown
> = {
  [MapperKinds.NUMBER]: numberMapper,
  [MapperKinds.BIGNUMBER]: bigNumberMapper,
  [MapperKinds.BOOLEAN]: booleanMapper,
  [MapperKinds.STRING]: stringMapper,
  [MapperKinds.DATE]: dateMapper,
  [MapperKinds.SYMBOL]: symbolMapper,
  [MapperKinds.MICHELSON_MAP]: michelsonMapMapper
};
