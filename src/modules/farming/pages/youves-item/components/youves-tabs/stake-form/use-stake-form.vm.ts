import { useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import { useNavigate, useParams } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { LpTokensApi } from '@blockchain';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { defined, isNotDefined, isNotFoundError } from '@shared/helpers';
import { useToken, useTokenBalance } from '@shared/hooks';
import { TokenAddress, TokenIdFa2 } from '@shared/types';
import { useToasts } from '@shared/utils';

import { YouvesFarmingApi } from '../../../../../api/blockchain/youves-farming.api';
import { useStakeFormForming } from './use-stake-form-forming';

const DEFAULT_TOKENS: { tokenA: Nullable<TokenAddress>; tokenB: Nullable<TokenAddress> } = {
  tokenA: null,
  tokenB: null
};

export const useStakeFormViewModel = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { showErrorToast } = useToasts();

  const navigate = useNavigate();
  const { contractAddress } = useParams();

  const [stakes, setStakes] = useState<BigNumber[]>([]);
  const [lpTokenId, setLpTokenId] = useState<Nullable<TokenIdFa2>>(null);
  const [tokens, setTokens] = useState(DEFAULT_TOKENS);
  const tokenA = useToken(tokens.tokenA);
  const tokenB = useToken(tokens.tokenB);
  const lpToken = useToken(lpTokenId);
  const userLpTokenBalance = useTokenBalance(lpToken);

  // Load LP token & User stakes
  useEffect(() => {
    (async () => {
      if (isNotDefined(tezos) || isNotDefined(accountPkh) || isNotDefined(contractAddress)) {
        return;
      }

      try {
        const _lpToken = await YouvesFarmingApi.getToken(tezos, contractAddress);
        const _stakes = await YouvesFarmingApi.getStakes(tezos, accountPkh, contractAddress);
        const _tokens = tezos && _lpToken ? await LpTokensApi.getTokens(tezos, _lpToken) : DEFAULT_TOKENS;

        setLpTokenId(_lpToken);
        setStakes(_stakes);
        setTokens(_tokens);
      } catch (error) {
        showErrorToast(error as Error);
        if (isNotFoundError(error as Error)) {
          navigate(`${AppRootRoutes.NotFound}/${contractAddress}`);
        }
      }
    })();
  }, [accountPkh, contractAddress, navigate, showErrorToast, tezos]);

  const form = useStakeFormForming(defined(contractAddress, 'Contract address'), lpToken, userLpTokenBalance);

  const disabled = form.disabled || isNotDefined(tezos) || isNotDefined(accountPkh);

  return {
    ...form,
    stakes,
    userLpTokenBalance,
    tokens: [tokenA, tokenB],
    disabled
  };
};
