import { BigNumber } from 'bignumber.js';

import { DexLink } from '@modules/liquidity/helpers';
import { useRootStore } from '@providers/root-store-provider';
import { isNotDefined } from '@shared/helpers';
import { useAuthStore, useToken, useTokenBalance } from '@shared/hooks';
import { Token } from '@shared/types';

import { useFarmingYouvesItemStore } from '../../../../../hooks';
import { StakeFormProps } from './stake-form-props.interface';
import { useGetConfirmationMessageParams } from './use-get-confirmation-message-params';
import { useStakeFormForming } from './use-stake-form-forming';

export const useStakeFormViewModel = (): StakeFormProps => {
  const { tezos } = useRootStore();
  const { accountPkh } = useAuthStore();

  const { item, tokens, currentStakeId, farmingAddress } = useFarmingYouvesItemStore();
  const stakedToken = useToken(item?.stakedToken ?? null);
  const stakedTokenBalance = useTokenBalance(stakedToken);
  const getConfirmationMessageParams = useGetConfirmationMessageParams();

  const form = useStakeFormForming(
    farmingAddress,
    currentStakeId,
    stakedToken,
    stakedTokenBalance,
    getConfirmationMessageParams
  );

  const disabled = form.disabled || isNotDefined(tezos) || isNotDefined(accountPkh);

  const investHref =
    tokens.length === 2
      ? DexLink.getCpmmPoolLink(tokens as [Token, Token])
      : tokens.length === 3
      ? //TODO: create stableswap pool link by real id https://madfish.atlassian.net/browse/QUIPU-621
        DexLink.getStableswapPoolLink(new BigNumber(6))
      : '';

  return {
    ...form,
    disabled,
    tokens,
    investHref,
    balance: stakedTokenBalance
  };
};
