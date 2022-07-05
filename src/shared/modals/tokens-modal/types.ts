import { ManagedTokensModalCellProps } from '@shared/components';
import { TokensModalCellProps } from '@shared/components/tokens-modal-cell';

import { TokensModalHeaderProps } from './tokens-modal-header';

export interface TokensModalViewProps {
  isSearching: boolean;
  setTokens: () => void;
  isModalOpen: boolean;
  openTokensModal: () => void;
  closeTokensModal: () => void;
  tokensModalCellParams: Array<TokensModalCellProps>;
  managedTokensModalCellParams: Array<ManagedTokensModalCellProps>;
  minQuantity?: number;
  maxQuantity?: number;
  headerProps: TokensModalHeaderProps;
}
