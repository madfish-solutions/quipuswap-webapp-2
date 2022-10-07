import { FC } from 'react';

import { Token } from '@shared/types';

import { getTokenSlug } from '../../../helpers';
import { PositionTokenCell } from '../PositionTokenCell';

interface Props {
  tokens: Token[];
  onTokenClick: (token: Token) => void;
}

export const AllTokensList: FC<Props> = ({ tokens, onTokenClick }) => {
  return (
    <div>
      {tokens.map(token => (
        <PositionTokenCell
          key={getTokenSlug(token)}
          token={token}
          onClick={() => onTokenClick(token)}
          isChecked={false}
        />
      ))}
    </div>
  );
};
