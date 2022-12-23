import { useLiquidityV3ItemTokens } from '@modules/liquidity/hooks';

/* eslint-disable no-console */
export const useV3AddLiqFormViewModel = () => {
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  return {
    data: [
      { value: '', label: 'Input', tokens: tokenX, onInputChange: () => console.log('click') },
      { value: '', label: 'Input', tokens: tokenY, onInputChange: () => console.log('click') }
    ],
    onSubmit: () => console.log('click')
  };
};
