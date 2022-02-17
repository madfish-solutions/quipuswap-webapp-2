import { FC } from 'react';

import { Checkbox } from '@quipuswap/ui-kit';

import { TokenCell } from '@components/modals/Modal';
import { RawToken } from '@interfaces/types';
import { getTokenName, getTokenSymbol, prepareTokenLogo } from '@utils/helpers';

interface PositionTokenCellProps {
  token: RawToken;
  onClick: () => void;
  isChecked: boolean;
}

export const PositionTokenCell: FC<PositionTokenCellProps> = ({ token, onClick, isChecked }) => (
  <TokenCell
    tokenIcon={prepareTokenLogo(token.metadata?.thumbnailUri)}
    tokenName={getTokenName(token)}
    tokenSymbol={getTokenSymbol(token)}
    tabIndex={0}
    onClick={onClick}
  >
    <Checkbox checked={isChecked} />
  </TokenCell>
);
