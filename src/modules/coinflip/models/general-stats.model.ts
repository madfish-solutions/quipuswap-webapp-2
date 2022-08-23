import { GeneralStatsDto } from '../dto';

export class GeneralStatsModel extends GeneralStatsDto {
  constructor(dto: GeneralStatsDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof GeneralStatsDto];
    }
  }
}
