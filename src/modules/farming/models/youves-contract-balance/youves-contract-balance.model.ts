import { YouvesContractBalanceDto } from '../../dto/youves-contract-balance';

export class YouvesContractBalanceModel extends YouvesContractBalanceDto {
  constructor(dto: YouvesContractBalanceDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof YouvesContractBalanceDto];
    }
  }
}
