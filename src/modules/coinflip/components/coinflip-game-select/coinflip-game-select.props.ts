import { Nullable, Optional } from '@shared/types';

import { CoinSide, TokenToPlay } from '../../stores';

export interface CoinflipGameSelectProps {
  isLoading: boolean;
  tokenToPlay: TokenToPlay;
  coinSide: Nullable<CoinSide>;
  error: Optional<string>;
  handleSelectCoinSide: (coinSide: CoinSide) => void;
}
