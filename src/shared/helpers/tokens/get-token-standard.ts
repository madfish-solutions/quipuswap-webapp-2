import { Standard, TokenAddress } from '../../types';
import { isExist } from '../type-checks';

export const getTokenStandard = ({ fa2TokenId }: TokenAddress) => (isExist(fa2TokenId) ? Standard.Fa2 : Standard.Fa12);
