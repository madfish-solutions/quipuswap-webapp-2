import { useLiquidityV3ItemStore } from '@modules/liquidity/hooks';
import { getTokenSymbol } from '@shared/helpers';
import { useToken } from '@shared/hooks';
import { mapTokenAddress } from '@shared/mapping/map-token-address';
import { useTranslation } from '@translation';

export const useV3ItemPageViewModel = () => {
  const { t } = useTranslation();
  const { item } = useLiquidityV3ItemStore();

  const tokenX = useToken(item ? mapTokenAddress(item.constants.token_x) : null);
  const tokenY = useToken(item ? mapTokenAddress(item.constants.token_y) : null);

  // eslint-disable-next-line no-console
  console.log('tokens', { tokenX, tokenY });

  const title = tokenX && tokenY ? `${getTokenSymbol(tokenX)} / ${getTokenSymbol(tokenY)}` : 'Loading...';

  return {
    t,
    isLoading: !tokenX || !tokenY,
    title
  };
};
