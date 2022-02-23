import BigNumber from 'bignumber.js';

import { StakingItem } from '@interfaces/staking.interfaces';
import { isExist, shortize } from '@utils/helpers';
import { Token } from '@utils/types';
import { isValidContractAddress } from '@utils/validators';

const normalizeTokenSymbol = (tokenSymbol: string) =>
  isValidContractAddress(tokenSymbol) ? shortize(tokenSymbol) : tokenSymbol;

export const mapStakingToken = (raw: Token): Token => ({
  ...raw,
  fa2TokenId: raw.fa2TokenId === undefined ? undefined : Number(raw.fa2TokenId),
  metadata: {
    ...raw.metadata,
    symbol: normalizeTokenSymbol(raw.metadata.symbol)
  }
});

export const getStakingDepositTokenSymbol = (stakeItem: Pick<StakingItem, 'tokenA' | 'tokenB'>) => {
  const {
    tokenA: {
      metadata: { symbol: rawTokenASymbol }
    },
    tokenB
  } = stakeItem;
  const tokenASymbol = normalizeTokenSymbol(rawTokenASymbol);
  const rawTokenBSymbol = tokenB?.metadata.symbol;
  const tokenBSymbol = rawTokenBSymbol ? normalizeTokenSymbol(rawTokenBSymbol) : null;

  return tokenBSymbol ? `${tokenASymbol}/${tokenBSymbol}` : tokenASymbol;
};

export const mapRawBigNumber = <T extends null | undefined>(raw: BigNumber.Value | T): BigNumber | T =>
  isExist(raw) ? new BigNumber(raw) : raw;
