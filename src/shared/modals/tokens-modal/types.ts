import { ManagedTokensModalCellProps, TabsProps } from '@shared/components';
import { TokensModalCellProps } from '@shared/components/tokens-modal-cell';

export interface TokensModalViewProps {
  setTokens: () => void;
  isModalOpen: boolean;
  openTokensModal: () => void;
  closeTokensModal: () => void;
  tokensModalCellParams: Array<TokensModalCellProps>;
  managedTokensModalCellParams: Array<ManagedTokensModalCellProps>;
  minQuantity?: number;
  maxQuantity?: number;
  tabsProps: TabsProps;
}
