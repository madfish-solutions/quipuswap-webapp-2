import { Token } from '@shared/types';

import { ManagedTokensModalCellProps, TokensModalCellProps } from './components';
import { TokensModalHeaderProps } from './components/tokens-modal-header';

export interface TokensModalViewProps {
  isSearching: boolean;
  setTokens: () => void;
  isModalOpen: boolean;
  closeTokensModal: () => void;
  tokensModalCellParams: Array<TokensModalCellProps>;
  managedTokensModalCellParams: Array<ManagedTokensModalCellProps>;
  minQuantity?: number;
  maxQuantity?: number;
  headerProps: TokensModalHeaderProps;
}

export interface TokensModalInitialParams {
  min?: number;
  max?: number;
  tokens?: Array<Token>;
  isSingle?: boolean;
}

export interface TokensModalAbort {
  abort?: boolean;
}
