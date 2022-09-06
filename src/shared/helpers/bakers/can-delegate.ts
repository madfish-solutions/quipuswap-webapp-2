import { Optional, Token } from '@shared/types';

import { isTezosToken } from '../get-token-appellation';
import { isExist } from '../type-checks';

export const canDelegate = (tokensInfo: Array<Optional<Token>>) => tokensInfo.filter(isExist).some(isTezosToken);
