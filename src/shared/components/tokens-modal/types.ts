import { Props as ModalProps } from 'react-modal';

import { Token } from '@shared/types';

export enum TMFormField {
  SEARCH = 'search',
  TOKEN_ID = 'tokenId'
}

export interface FormValues {
  [TMFormField.SEARCH]: string;
  [TMFormField.TOKEN_ID]: number | string;
}

export interface TokensModalProps extends ModalProps {
  onChange: (token: Token) => void;
  blackListedTokens: Token[];
}
