import React from 'react';

import { Checkbox, TokenCell } from '@quipuswap/ui-kit';
import { WhitelistedToken } from '@quipuswap/ui-kit/dist/utils/types';

import { getWhitelistedTokenName, getWhitelistedTokenSymbol, prepareTokenLogo } from '@utils/helpers';

interface PositionTokenCellProps {
  token: WhitelistedToken;
  onClick: () => void;
  isChecked: boolean;
}

export const PositionTokenCell: React.FC<PositionTokenCellProps> = ({ token, onClick, isChecked }) => (
  <TokenCell
    tokenIcon={prepareTokenLogo(token.metadata?.thumbnailUri)}
    tokenName={getWhitelistedTokenSymbol(token)}
    tokenSymbol={getWhitelistedTokenName(token)}
    tabIndex={0}
    onClick={() => onClick()}
  >
    <Checkbox checked={isChecked} />
  </TokenCell>
);
