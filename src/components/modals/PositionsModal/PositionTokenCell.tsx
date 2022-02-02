import React from 'react';

import { Checkbox, TokenCell } from '@quipuswap/ui-kit';

import { getTokenName, getTokenSymbol, prepareTokenLogo } from '@utils/helpers';
import { Token } from '@utils/types';

interface PositionTokenCellProps {
  token: Token;
  onClick: () => void;
  isChecked: boolean;
}

export const PositionTokenCell: React.FC<PositionTokenCellProps> = ({ token, onClick, isChecked }) => (
  <TokenCell
    tokenIcon={prepareTokenLogo(token.metadata?.thumbnailUri)}
    tokenName={getTokenName(token)}
    tokenSymbol={getTokenSymbol(token)}
    tabIndex={0}
    onClick={() => onClick()}
  >
    <Checkbox checked={isChecked} />
  </TokenCell>
);
