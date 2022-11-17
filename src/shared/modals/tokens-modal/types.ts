import { ReactNode } from 'react';

import { Nullable, Token } from '@shared/types';

import { ManagedTokensModalCellProps, TokensModalCellProps } from './components';
import { TokensModalHeaderProps } from './components/tokens-modal-header';

export enum TokensQuantityStatus {
  OK = 'OK',
  TOO_MANY = 'TOO_MANY',
  TOO_SMALL = 'TOO_SMALL'
}

export interface TokensModalViewProps {
  isSearching: boolean;
  setTokens: () => void;
  isModalOpen: boolean;
  closeTokensModal: () => void;
  tokensModalCellParams: Array<TokensModalCellProps>;
  managedTokensModalCellParams: Array<ManagedTokensModalCellProps>;
  headerProps: TokensModalHeaderProps;
  tokensModalFooter: ReactNode;
}

interface TokensModalInitialParamsAbstraction {
  tokens?: Nullable<Array<Token>>;
  disabledTokens?: Nullable<Array<Token>>;
}
interface TokensQuantityValidation extends TokensModalInitialParamsAbstraction {
  min: number;
  max: number;
}

export type TokensModalInitialParams = TokensModalInitialParamsAbstraction | TokensQuantityValidation;

export const isTokensQuantityValidation = (
  candidate: TokensModalInitialParams
): candidate is TokensQuantityValidation =>
  'min' in candidate && Boolean(candidate.min) && 'max' in candidate && Boolean(candidate.max);

export interface TokensModalAbort {
  abort?: boolean;
}
