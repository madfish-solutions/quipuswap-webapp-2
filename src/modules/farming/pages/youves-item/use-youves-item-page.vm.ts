import { useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import { useNavigate, useParams } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { LpTokensApi } from '@blockchain';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { defined, getTokensNames, isNotDefined, isNotFoundError, NOT_FOUND_MESSAGE } from '@shared/helpers';
import { useToken, useTokenBalance } from '@shared/hooks';
import { Token, TokenAddress, TokenIdFa2 } from '@shared/types';
import { useToasts } from '@shared/utils';

import { YouvesFarmingApi } from '../../api/blockchain/youves-farming.api';
import { TabProps } from './components/youves-tabs/tab-props.interface';

const DEFAULT_TOKENS: { tokenA: Nullable<TokenAddress>; tokenB: Nullable<TokenAddress> } = {
  tokenA: null,
  tokenB: null
};

const getTitle = (tokenA: Nullable<Token>, tokenB: Nullable<Token>): string =>
  `Farming ${tokenA && tokenB ? getTokensNames([tokenA, tokenB]) : '...'}`;

export const useYouvesItemPageViewModel = (): { title: string } & TabProps => {
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

  const title = getTitle(tokenA, tokenB);

  // Load LP token & User stakes
  useEffect(() => {
    (async () => {
      if (isNotDefined(tezos) || isNotDefined(accountPkh) || isNotDefined(contractAddress)) {
        return;
      }

      try {
        const _lpToken = await YouvesFarmingApi.getToken(tezos, contractAddress);
        if (!_lpToken) {
          throw new Error(NOT_FOUND_MESSAGE);
        }
        const _stakes = await YouvesFarmingApi.getStakes(tezos, accountPkh, contractAddress);
        const _tokens = await LpTokensApi.getTokens(tezos, _lpToken);

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

  return {
    title,
    contractAddress: defined(contractAddress, 'Contract Address'),
    stakes,
    // TODO: Next Epic
    stakeId: new BigNumber(0),
    lpToken,
    userLpTokenBalance,
    tokenA,
    tokenB
  };
};
