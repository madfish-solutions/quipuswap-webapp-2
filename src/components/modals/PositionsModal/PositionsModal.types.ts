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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
}

export interface FormValues {
  search: string;
  tokenId: string;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
}
