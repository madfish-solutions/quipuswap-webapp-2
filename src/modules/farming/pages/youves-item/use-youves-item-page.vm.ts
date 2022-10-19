import { useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import { useNavigate, useParams } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { LpTokensApi } from '@blockchain';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { defined, getTokensNames, isExist, isNotDefined, isNotFoundError, NOT_FOUND_MESSAGE } from '@shared/helpers';
import { useToken, useTokenBalance } from '@shared/hooks';
import { Token, TokenAddress, TokenIdFa2 } from '@shared/types';
import { useToasts } from '@shared/utils';

import { YouvesFarmingApi } from '../../api/blockchain/youves-farming.api';
import { TabProps } from './components/youves-tabs/tab-props.interface';

const DEFAULT_TOKENS: { tokenA: Nullable<TokenAddress>; tokenB: Nullable<TokenAddress> } = {
  tokenA: null,
  tokenB: null
};

const FIRST_INDEX = 0;
const NEW_STAKE_INDEX = 0;
const NEW_STAKE = new BigNumber(NEW_STAKE_INDEX);

const getTitle = (tokenA: Nullable<Token>, tokenB: Nullable<Token>): string =>
  `Farming ${tokenA && tokenB ? getTokensNames([tokenA, tokenB]) : '...'}`;

// eslint-disable-next-line sonarjs/cognitive-complexity
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
      if (isNotDefined(tezos) || isNotDefined(contractAddress)) {
        return;
      }

      try {
        const _lpToken = await YouvesFarmingApi.getToken(tezos, contractAddress);
        if (!_lpToken) {
          throw new Error(NOT_FOUND_MESSAGE);
        }

        const _tokens = await LpTokensApi.getTokens(tezos, _lpToken);
        setLpTokenId(_lpToken);
        setTokens(_tokens);

        if (accountPkh) {
          const _stakes = await YouvesFarmingApi.getStakesIds(tezos, accountPkh, contractAddress);
          setStakes(_stakes);
        }
      } catch (error) {
        showErrorToast(error as Error);
        if (isNotFoundError(error as Error)) {
          navigate(`${AppRootRoutes.NotFound}/${contractAddress}`);
        }
      }
    })();
  }, [accountPkh, contractAddress, navigate, showErrorToast, tezos]);

  const stakeId = isExist(stakes[FIRST_INDEX]) ? stakes[FIRST_INDEX] : NEW_STAKE;

  return {
    title,
    contractAddress: defined(contractAddress, 'Contract Address'),
    stakes,
    stakeId,
    lpToken,
    userLpTokenBalance,
    tokenA,
    tokenB
  };
};
