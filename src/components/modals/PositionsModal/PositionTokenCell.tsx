import React from 'react';

import { Checkbox } from '@quipuswap/ui-kit';

import { TokenCell } from '@components/modals/Modal';
import { getWhitelistedTokenName, getWhitelistedTokenSymbol, prepareTokenLogo } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

interface PositionTokenCellProps {
  token: WhitelistedToken;
  onClick: () => void;
  isChecked: boolean;
}

export const PositionTokenCell: React.FC<PositionTokenCellProps> = ({ token, onClick, isChecked }) => (
  <TokenCell
    tokenIcon={prepareTokenLogo(token.metadata?.thumbnailUri)}
    tokenName={getWhitelistedTokenName(token)}
    tokenSymbol={getWhitelistedTokenSymbol(token)}
    tabIndex={0}
    onClick={() => onClick()}
  >
    <Checkbox checked={isChecked} />
  </TokenCell>
);
