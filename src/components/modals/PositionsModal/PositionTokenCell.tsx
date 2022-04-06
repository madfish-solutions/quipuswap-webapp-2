import { FC } from 'react';

import { Checkbox } from '@quipuswap/ui-kit';

import { TokenCell } from '@components/modals/Modal';
import { getTokenName, getTokenSymbol, isTezosToken, prepareTokenLogo } from '@utils/helpers';
import { Token } from '@utils/types';

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
