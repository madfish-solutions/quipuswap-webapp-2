import { MapperKinds } from './mapper-kinds.enum';

interface MapperConfigValue<MapperConfig> {
  optional?: boolean;
  nullable?: boolean;
  isArray: boolean;
  mapper: MapperKinds;
  shape: MapperConfig;
}

export type MapperConfig = Record<string, MapperConfigValue<MapperConfig>>;
