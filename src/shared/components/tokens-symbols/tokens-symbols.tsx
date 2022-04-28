import { FC } from 'react';

import { SLASH } from '@config/constants';
import { getTokenSymbol, isLastElementIndex, toArray } from '@shared/helpers';
import { Token } from '@shared/types';

type Tokens = Token | Array<Token>;

interface Props {
  tokens: Tokens;
  className?: string;
}

const getSymbolsString = (symbols: Array<string>) => {
  let sybolsStr = '';

  symbols.forEach((symbol, index) => {
    if (!isLastElementIndex(index, symbols)) {
      sybolsStr = sybolsStr + symbol + SLASH;
    } else {
      sybolsStr = sybolsStr + symbol;
    }
  });

  return sybolsStr;
};

export const TokensSymbols: FC<Props> = ({ tokens, className }) => {
  const tokensList = toArray(tokens).map(token => getTokenSymbol(token));

  return <div className={className}>{getSymbolsString(tokensList)}</div>;
};
