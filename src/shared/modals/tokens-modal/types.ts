import { TokensModalCellProps } from '@shared/components/tokens-modal-cell';

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
