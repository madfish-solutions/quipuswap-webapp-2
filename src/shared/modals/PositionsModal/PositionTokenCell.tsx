import { FC } from 'react';

import { TokenCell } from '@shared/components';
import { Checkbox } from '@shared/elements';
import { getTokenName, getTokenSymbol, isTezosToken, prepareTokenLogo } from '@shared/helpers';
import { Token } from '@shared/types';

interface PositionTokenCellProps {
  token: Token;
  onClick: () => void;
  isChecked: boolean;
}

export const PositionTokenCell: FC<PositionTokenCellProps> = ({ token, onClick, isChecked }) => (
  <TokenCell
    tokenIcon={prepareTokenLogo(token.metadata?.thumbnailUri)}
    tokenName={getTokenName(token)}
    tokenSymbol={getTokenSymbol(token)}
    tokenType={token.type}
    isTezosToken={isTezosToken(token)}
    tabIndex={0}
    onClick={onClick}
  >
    <Checkbox checked={isChecked} />
  </TokenCell>
);
