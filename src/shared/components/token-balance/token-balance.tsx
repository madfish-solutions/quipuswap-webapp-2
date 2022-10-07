import { FC, useRef } from 'react';

import { useOnScreen, useTokenBalance } from '../../hooks';
import { Token } from '../../types';
import { StateCurrencyAmount } from '../state-components';

interface Props {
  token: Token;
}

export const TokenBalance: FC<Props> = ({ token }) => {
  const tokenBalance = useTokenBalance(token);

  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  if (isVisible) {
    // eslint-disable-next-line no-console
    console.log('visible', token);
  }

  return <StateCurrencyAmount isLoading={false} loaderFallback={<></>} amount={tokenBalance.amount} ref={ref} />;
};
