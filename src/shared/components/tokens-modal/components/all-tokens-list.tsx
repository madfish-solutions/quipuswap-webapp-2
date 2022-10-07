import { FC } from 'react';

import { Token } from '@shared/types';

import { getTokenSlug } from '../../../helpers';
import { TokenCell } from '../../modal-cell';

interface Props {
  tokens: Token[];
  onTokenClick: (token: Token) => void;
}

export const AllTokensList: FC<Props> = ({ tokens, onTokenClick }) => {
  return (
    <div>
      {tokens.map(token => (
        <TokenCell key={getTokenSlug(token)} token={token} tabIndex={0} onClick={() => onTokenClick(token)} />
      ))}
    </div>
  );
};
