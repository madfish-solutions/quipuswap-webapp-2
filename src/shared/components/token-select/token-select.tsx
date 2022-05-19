import { FC, HTMLProps } from 'react';

import BigNumber from 'bignumber.js';

import { Undefined, Token } from '@shared/types';

import { TokenInput } from '../token-input';
import { TokensModal } from '../TokensModal';
import { useTokenSelectViewModel } from './token-select.vm';

interface NewTokenSelectProps extends HTMLProps<HTMLDivElement> {
  className?: string;
  amount?: BigNumber;
  balance?: BigNumber;
  exchangeRate?: BigNumber;
  label: string;
  error?: string;
  selectable?: boolean;
  token?: Token;
  blackListedTokens: Token[];
  id?: string;
  onAmountChange: (value: Undefined<BigNumber>) => void;
  onTokenChange: (token: Token) => void;
}

export const _TokenSelect: FC<NewTokenSelectProps> = ({
  id,
  className,
  amount,
  balance,
  label,
  exchangeRate,
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

  const tokenDecimals = token?.metadata.decimals ?? 0;

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
        exchangeRate={exchangeRate}
        tokens={token}
        decimals={tokenDecimals}
        onInputChange={handleAmountChange}
        onSelectorClick={openTokenModal}
      />
    </div>
  );
};
