import { Optional } from '@shared/types';

import { CoinSide, TokenToPlay } from '../../stores';

export interface CoinflipGameSelectProps {
  tokenToPlay: TokenToPlay;
  coinSide: Nullable<CoinSide>;
  error: Optional<string>;
  handleSelectCoinSide: (coinSide: CoinSide) => void;
}
