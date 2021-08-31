import React, {
  useCallback,
  useEffect,
  useMemo, useState,
} from 'react';
import BigNumber from 'bignumber.js';
import { withTypes } from 'react-final-form';
import {
  FoundDex,
  TransferParams,
} from '@quipuswap/sdk';
import { useRouter } from 'next/router';

import useUpdateToast from '@hooks/useUpdateToast';
import { fallbackTokenToTokenData, isTokenEqual, localSearchToken } from '@utils/helpers';
import {
  getUserBalance,
  useAccountPkh,
  useNetwork,
  useSearchCustomTokens,
  useTezos,
  useTokens,
} from '@utils/dapp';
import {
  TokenDataMap,
  VoteFormValues,
  VoterType, WhitelistedToken, WhitelistedTokenPair,
} from '@utils/types';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { VotingStats } from '@components/voting/VotingStats';
import { StickyBlock } from '@components/common/StickyBlock';

import s from '@styles/CommonContainer.module.sass';
import { hanldeTokenPairSelect } from '@containers/Liquidity/liquidityHelpers';
import { useRouterPair } from '@hooks/useRouterPair';
import { VotingForm } from './VotingForm';
import { submitForm } from './votingHelpers';

const TabsContent = [
  {
    id: 'vote',
    label: 'Vote',
  },
  {
    id: 'veto',
    label: 'Veto',
  },
];

type VotingProps = {
  className?: string
};

const fallbackTokenPair = {
  token1: TEZOS_TOKEN,
  token2: STABLE_TOKEN,
} as WhitelistedTokenPair;

export const Voting: React.FC<VotingProps> = ({
  className,
}) => {
  const updateToast = useUpdateToast();
  const tezos = useTezos();
  const network = useNetwork();
  const { data: tokens } = useTokens();
  const accountPkh = useAccountPkh();
  const searchCustomToken = useSearchCustomTokens();
  const [tokensData, setTokensData] = useState<TokenDataMap>(
    {
      first: fallbackTokenToTokenData(TEZOS_TOKEN),
      second: fallbackTokenToTokenData(STABLE_TOKEN),
    },
  );
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [voteParams, setVoteParams] = useState<TransferParams[]>([]);
  const { Form } = withTypes<VoteFormValues>();
  const [dex, setDex] = useState<FoundDex>();
  const [urlLoaded, setUrlLoaded] = useState<boolean>(true);
  const [rewards, setRewards] = useState('0');
  const [voter, setVoter] = useState<VoterType>();
  const [
    tokenPair,
    setTokenPair,
  ] = useState<WhitelistedTokenPair>(fallbackTokenPair);
  const router = useRouter();
  const [tabsState, setTabsState] = useState(router.query.method); // TODO: Change to routes
  const { from, to } = useRouterPair({
    page: `voting/${router.query.method}`,
    urlLoaded,
    initialLoad,
    token1: tokenPair.token1,
    token2: tokenPair.token2,
  });

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  const handleErrorToast = useCallback((err) => {
    updateToast({
      type: 'error',
      render: `${err.name}: ${err.message}`,
    });
  }, [updateToast]);

  const handleTokenChange = async (token: WhitelistedToken, tokenNumber: 'first' | 'second') => {
    let finalBalance = '0';
    if (tezos && accountPkh) {
      const balance = await getUserBalance(
        tezos,
        accountPkh,
        token.contractAddress,
        token.type,
        token.fa2TokenId,
      );
      if (balance) {
        finalBalance = balance.div(
          new BigNumber(10)
            .pow(
              new BigNumber(token.metadata.decimals),
            ),
        ).toString();
      }
    }

    setTokensData((prevState) => ({
      ...prevState,
      [tokenNumber]: {
        token: {
          address: token.contractAddress,
          type: token.type,
          id: token.fa2TokenId,
          decimals: token.metadata.decimals,
        },
        balance: finalBalance,
      },
    }));
  };

  useEffect(() => {
    const asyncCall = async () => {
      setInitialLoad(true);
      setUrlLoaded(false);
      const searchPart = async (str:string | string[]):Promise<WhitelistedToken> => {
        const strStr = Array.isArray(str) ? str[0] : str;
        const inputValue = strStr.split('_')[0];
        const inputToken = strStr.split('_')[1] ?? -1;
        const isTokens = tokens
          .filter(
            (token:any) => localSearchToken(
              token,
              network,
              inputValue,
              +inputToken,
            ),
          );
        if (isTokens.length === 0) {
          return await searchCustomToken(inputValue, +inputToken, true).then((x) => {
            if (x) {
              return x;
            }
            return TEZOS_TOKEN;
          });
        }
        return isTokens[0];
      };
      let res:any[] = [];
      if (from) {
        if (to) {
          const resTo = await searchPart(to);
          res = [resTo];
          handleTokenChange(resTo, 'second');
        }
        // const resFrom = await searchPart(from);
        const resFrom = TEZOS_TOKEN;
        res = [resFrom, ...res];
        handleTokenChange(resFrom, 'first');
      }
      setUrlLoaded(true);
      if (!isTokenEqual(res[0], res[1])) {
        hanldeTokenPairSelect(
          { token1: res[0], token2: res[1] } as WhitelistedTokenPair,
          setTokenPair,
          handleTokenChange,
        );
      }
    };
    if (from && to && !initialLoad && tokens.length > 0) asyncCall();
  }, [from, to, initialLoad, tokens]);

  useEffect(() => {
    if (tezos && tokenPair) {
      handleTokenChange(tokenPair.token1, 'first');
      handleTokenChange(tokenPair.token2, 'second');
      hanldeTokenPairSelect(
        tokenPair,
        setTokenPair,
        handleTokenChange,
      );
    }
  }, [tezos, accountPkh, network.id]);

  return (
    <>
      <VotingStats
        pendingReward={rewards}
        amounts={[tokenPair.balance ?? '', voter?.vote ?? '', voter?.veto ?? '']}
        className={s.votingStats}
      />
      <StickyBlock className={className}>
        <Form
          onSubmit={() => {
            if (!tezos) return;
            submitForm(tezos, voteParams, handleErrorToast);
          }}
          mutators={{
            setValue: ([field, value], state, { changeValue }) => {
              changeValue(state, field, () => value);
            },
          }}
          render={({ handleSubmit, form }) => (
            <VotingForm
              form={form}
              handleSubmit={handleSubmit}
              debounce={1000}
              save={() => { }}
              setTabsState={setTabsState}
              tabsState={tabsState}
              dex={dex}
              setDex={setDex}
              rewards={rewards}
              setRewards={setRewards}
              voter={voter}
              setVoter={setVoter}
              tokenPair={tokenPair}
              setTokenPair={setTokenPair}
              tokensData={tokensData}
              handleTokenChange={handleTokenChange}
              currentTab={currentTab}
              setVoteParams={setVoteParams}
            />
          )}
        />
      </StickyBlock>
    </>
  );
};
