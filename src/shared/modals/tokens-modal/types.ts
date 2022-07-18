import { Token } from '@shared/types';

import { ManagedTokensModalCellProps, TokensModalCellProps, TokensQuantityInfoProps } from './components';
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
  isTokensQuantityOk: boolean;
  tokensModalCellParams: Array<TokensModalCellProps>;
  managedTokensModalCellParams: Array<ManagedTokensModalCellProps>;
  headerProps: TokensModalHeaderProps;
  tokensQuantityInfoParams: TokensQuantityInfoProps;
}

interface TokensModalInitialParamsAbstraction {
  tokens?: Nullable<Array<Token>>;
}
interface TokensQuiantityValidation extends TokensModalInitialParamsAbstraction {
  min: number;
  max: number;
}

export type TokensModalInitialParams = TokensModalInitialParamsAbstraction | TokensQuiantityValidation;

export const isTokensQuiantityValidation = (
  candidate: TokensModalInitialParams
): candidate is TokensQuiantityValidation =>
  'min' in candidate && Boolean(candidate.min) && 'max' in candidate && Boolean(candidate.max);

export interface TokensModalAbort {
  abort?: boolean;
}
