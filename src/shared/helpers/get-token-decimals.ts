import { DEFAULT_DECIMALS } from '@config/constants';
import { Optional, Token } from '@shared/types';

export const getTokenDecimals = (token: Optional<Token>) => token?.metadata.decimals ?? DEFAULT_DECIMALS;
