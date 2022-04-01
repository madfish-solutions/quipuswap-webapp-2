import { FC } from 'react';

import { getTokensPairName } from '@shared/helpers';
import { Nullable, Optional, TokenPair } from '@shared/types';

import { DashPlug } from '../dash-plug';

interface Props {
  tokenPair: Nullable<TokenPair>;
  isLoading: Optional<boolean>;
  placeholder?: string;
  tokenSymbolSliceAmount?: number;
}

export const LoadableTokenPairName: FC<Props> = ({ tokenPair, isLoading, placeholder, tokenSymbolSliceAmount }) => {
  if (isLoading) {
    return (
      <>
        <DashPlug />
        {' / '}
        <DashPlug />
      </>
    );
  }

  return <>{tokenPair ? getTokensPairName(tokenPair.token1, tokenPair.token2, tokenSymbolSliceAmount) : placeholder}</>;
};
