import { FC, HTMLProps } from 'react';

import BigNumber from 'bignumber.js';

import { Undefined, Token } from '@shared/types';

import { TokenInput } from '../token-input';
import { TokensModal } from '../tokens-modal';
import { useTokenSelectViewModel } from './token-select.vm';

interface Props extends HTMLProps<HTMLDivElement> {
  className?: string;
  amount?: BigNumber;
  balance?: BigNumber;
  label: string;
  error?: string;
  selectable?: boolean;
  token?: Token;
  blackListedTokens: Token[];
  id?: string;
  onAmountChange: (value: Undefined<BigNumber>) => void;
  onTokenChange: (token: Token) => void;
}

export const TokenSelect: FC<Props> = ({
  id,
  className,
  amount,
  balance,
  label,
  error,
  onAmountChange,
  onTokenChange,
  token,
  blackListedTokens,
  ...props
}) => {
  const {
    tokensModal,
    openTokenModal,
    closeTokenModal,

    localAmount,

    handleAmountChange,
    handleTokenChange
  } = useTokenSelectViewModel({ amount, onAmountChange, onTokenChange });

  return (
    <div {...props}>
      <TokensModal
        blackListedTokens={blackListedTokens}
        isOpen={tokensModal}
        onRequestClose={closeTokenModal}
        onChange={handleTokenChange}
      />
      <TokenInput
        id={id}
        label={label}
        balance={balance}
        value={localAmount}
        tokens={token}
        onInputChange={handleAmountChange}
        onSelectorClick={openTokenModal}
      />
    </div>
  );
};
