import { useLiquidityV3ItemTokens } from '@modules/liquidity/hooks';

/* eslint-disable no-console */
export const useV3RemoveLiqFormViewModel = () => {
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();

  return {
    data: [
      { value: '', label: 'Amount', tokens: [tokenX, tokenY], onInputChange: () => console.log('click') },
      {
        value: '',
        label: 'Output',
        tokens: tokenX,
        hiddenPercentSelector: true,
        onInputChange: () => console.log('click')
      },
      {
        value: '',
        label: 'Output',
        tokens: tokenY,
        hiddenPercentSelector: true,
        onInputChange: () => console.log('click')
      }
    ],
    onSubmit: () => console.log('click')
  };
};
