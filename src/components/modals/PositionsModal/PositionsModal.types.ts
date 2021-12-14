import ReactModal from 'react-modal';

import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

interface IPositionsModalProps {
  onChange: (tokenPair: WhitelistedTokenPair) => void;
  initialPair?: WhitelistedTokenPair;
  notSelectable1?: WhitelistedToken;
  notSelectable2?: WhitelistedToken;
}

export type PositionsModalProps = IPositionsModalProps & ReactModal.Props;

export interface HeaderProps {
  isSecondInput: boolean;
  debounce: number;
  save: any;
  values: any;
  form: any;
}

export interface FormValues {
  search: string;
  tokenId: string;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
}
