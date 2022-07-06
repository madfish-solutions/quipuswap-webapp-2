import { TokensModalCellProps } from '@shared/components/tokens-modal-cell';
import { Token } from '@shared/types';

import { ManagedTokensModalCellProps } from './components';
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
