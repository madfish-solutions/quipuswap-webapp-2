import { FC } from 'react';

import { getSymbolsString } from '@shared/helpers';
import { Token } from '@shared/types';

type Tokens = Nullable<Token> | Array<Nullable<Token>>;

interface Props {
  tokens: Tokens;
  className?: string;
}

export const TokensSymbols: FC<Props> = ({ tokens, className }) => {
  return (
    <div className={className} data-test-id="tokensSymbols">
      {getSymbolsString(tokens)}
    </div>
  );
};
