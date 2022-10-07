import { FC, useEffect, useRef } from 'react';

import { useOnScreen, useTokenBalance } from '../../hooks';
import { Token } from '../../types';
import { DashPlug } from '../dash-plug';
import { StateCurrencyAmount } from '../state-components';

interface Props {
  token: Token;
}

export const TokenBalance: FC<Props> = ({ token }) => {
  const { load, isLoading, amount } = useTokenBalance(token);

  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  useEffect(() => {
    if (isVisible || !isLoading) {
      void load();
    }
  }, [isVisible, load, isLoading]);

  return <StateCurrencyAmount isLoading={isLoading} loaderFallback={<DashPlug />} amount={amount} ref={ref} />;
};
