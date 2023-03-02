import { ReactNode } from 'react';

import { ButtonProps } from '@shared/components';
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
  cancelButtonProps?: Nullable<Omit<ButtonProps, 'onClick'> & { children?: ReactNode }>;
  confirmButtonProps?: Nullable<Omit<ButtonProps, 'onClick' | 'disabled'> & { children?: ReactNode }>;
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
