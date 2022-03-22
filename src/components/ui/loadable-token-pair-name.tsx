import { getTokensPairName } from '@utils/helpers';
import { Nullable, Optional, TokenPair } from '@utils/types';

import { DashPlug } from './dash-plug';

interface Props {
  tokenPair: Nullable<TokenPair>;
  isLoading: Optional<boolean>;
  placeholder?: string;
  tokenSymbolSliceAmount?: number;
}

export const LoadableTokenPairName = ({ tokenPair, isLoading, placeholder, tokenSymbolSliceAmount }: Props) => {
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
