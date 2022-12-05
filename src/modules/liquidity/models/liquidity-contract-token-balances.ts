import { LiquidityContractTokenBalancesDto } from '../dto/liquidity-contract-token-balances.dto';

export class LiquidityContractTokenBalancesModel extends LiquidityContractTokenBalancesDto {
  constructor(dto: LiquidityContractTokenBalancesDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof LiquidityContractTokenBalancesDto];
    }
  }
}
