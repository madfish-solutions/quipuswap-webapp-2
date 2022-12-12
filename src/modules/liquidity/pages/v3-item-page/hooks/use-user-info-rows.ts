import { useLiquidityV3ItemTokens } from '@modules/liquidity/hooks';
import { LiquidityV3PositionWithStats } from '@modules/liquidity/types';
import { isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

export const useUserInfoRows = () => {
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  const getUserInfoRows = (userPosition: Nullable<LiquidityV3PositionWithStats>) => {
    if (isNull(userPosition) || isNull(tokenX) || isNull(tokenY)) {
      return [];
    }

    const tokenXDeposit = userPosition?.stats.tokenXDeposit ?? null;
    const tokenYDeposit = userPosition?.stats.tokenYDeposit ?? null;
    const tokenXFees = userPosition?.stats.tokenXFees ?? null;
    const tokenYFees = userPosition?.stats.tokenYFees ?? null;

    return [
      {
        token: tokenX,
        deposit: tokenXDeposit,
        fee: tokenXFees
      },
      {
        token: tokenY,
        deposit: tokenYDeposit,
        fee: tokenYFees
      }
    ];
  };

  return { getUserInfoRows };
};
