import { FC } from 'react';

import { TokenCell } from '@shared/components';
import { Checkbox } from '@shared/elements';
import { getTokenSymbol } from '@shared/helpers';
import { Token } from '@shared/types';

interface PositionTokenCellProps {
  token: Token;
  onClick: () => void;
  isChecked: boolean;
  index?: number;
}

export const PositionTokenCell: FC<PositionTokenCellProps> = ({ token, onClick, isChecked, index }) => (
  <div data-test-id={getTokenSymbol(token)}>
    <TokenCell token={token} tabIndex={0} onClick={onClick} index={index}>
      <Checkbox checked={isChecked} />
    </TokenCell>
  </div>
);
