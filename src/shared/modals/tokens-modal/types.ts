import { TabsProps } from '@shared/components';
import { TokensModalCellProps } from '@shared/components/tokens-modal-cell';

export interface TokensModalViewProps {
  setTokens: () => void;
  isModalOpen: boolean;
  openTokensModal: () => void;
  closeTokensModal: () => void;
  tokens: Array<TokensModalCellProps>;
  minQuantity?: number;
  maxQuantity?: number;
  tabsProps: TabsProps;
}
