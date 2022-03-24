import { FC } from 'react';

import { DashPlug } from '@components/ui/dash-plug';
import { getTokensPairName } from '@utils/helpers';
import { Nullable, Optional, TokenPair } from '@utils/types';

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
