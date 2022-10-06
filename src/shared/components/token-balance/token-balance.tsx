import { FC } from 'react';

import { useTokenBalance } from '../../hooks';
import { Token } from '../../types';
import { StateCurrencyAmount } from '../state-components';

interface Props {
  token: Token;
}

export const TokenBalance: FC<Props> = ({ token }) => {
  const tokenBalance = useTokenBalance(token);
  const amount = Number(tokenBalance?.toFixed());

  return <StateCurrencyAmount isLoading={false} loaderFallback={<></>} amount={amount || null} />;
};
