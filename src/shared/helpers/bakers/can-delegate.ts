import { Token } from '@shared/types';

import { isTezosToken } from '../get-token-appellation';

export const canDelegate = (tokensInfo: Array<Token>) => tokensInfo.some(isTezosToken);
