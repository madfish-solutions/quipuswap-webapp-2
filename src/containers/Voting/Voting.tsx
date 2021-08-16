import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { withTypes, Field, FormSpy } from 'react-final-form';
import {
  batchify,
  estimateReward,
  findDex,
  FoundDex,
  getLiquidityShare,
  TransferParams,
  vetoCurrentBaker,
  voteForBaker,
} from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import { useConnectModalsState } from '@hooks/useConnectModalsState';
import {
  getUserBalance,
  useAccountPkh, useBakers, useNetwork, useTezos,
} from '@utils/dapp';
import { composeValidators, required, validateMinMax } from '@utils/validators';
import { parseDecimals } from '@utils/helpers';
import { WhitelistedBaker, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';
import { Tooltip } from '@components/ui/Tooltip';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import { VotingStats } from '@components/voting/VotingStats';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { ComplexBaker } from '@components/ui/ComplexInput';
import { StickyBlock } from '@components/common/StickyBlock';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Transactions } from '@components/svg/Transactions';
import { ArrowDown } from '@components/svg/ArrowDown';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '@styles/CommonContainer.module.sass';

function sharesFromNat(val: BigNumber.Value) {
  return new BigNumber(val).div(10 ** 6);
}

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

type TokenDataType = {
  token: {
    address: string,
    type: 'fa1.2' | 'fa2',
    id?: number | null
    decimals: number,
  },
  balance: string,
  exchangeRate?: string
};

type TokenDataMap = {
  first: TokenDataType,
  second: TokenDataType
};

const fallbackTokensData: TokenDataType = {
  token: {
    address: 'tez',
    type: 'fa1.2',
    decimals: 6,
    id: null,
  },
  balance: '0',
};

type FormValues = {
  balance1: number
  selectedBaker: string
};

type HeaderProps = {
  handleSubmit: () => void,
  setVoteParams: (params: TransferParams[]) => void,
  debounce: number,
  save: any,
  values: FormValues,
  form: any,
  tabsState: any,
  dex: FoundDex,
  setDex: (dex: FoundDex) => void,
  rewards: string,
  setRewards: (reward: string) => void,
  voter: any,
  setVoter: (voter: any) => void,
  tokenPair: WhitelistedTokenPair,
  setTokenPair: (pair: WhitelistedTokenPair) => void,
  tokensData: TokenDataMap,
  handleTokenChange: (token: WhitelistedToken, tokenNumber: 'first' | 'second') => void,
  currentTab: any,
  setTabsState: (val: any) => void
};

type QSMainNet = 'mainnet' | 'florencenet';

const hanldeTokenPairSelect = (
  pair: WhitelistedTokenPair,
  setTokenPair: (pair: WhitelistedTokenPair) => void,
  setDex: (dex: FoundDex) => void,
  setRewards: (reward: string) => void,
  setVoter: (voter: VoterType) => any,
  tezos: TezosToolkit | null,
  accountPkh: string | null,
  networkId?: QSMainNet,
) => {
  const asyncFunc = async () => {
    if (!tezos || !accountPkh || !networkId) {
      setTokenPair(pair);
      return;
    }
    try {
      const secondAsset = {
        contract: pair.token2.contractAddress,
        id: pair.token2.fa2TokenId,
      };
      const foundDex = await findDex(tezos, FACTORIES[networkId], secondAsset);
      setDex(foundDex);
      const asyncRewards = async () => {
        const res = await estimateReward(tezos, foundDex, accountPkh);
        const rewards = res.div(new BigNumber(10).pow(new BigNumber(6))).toString();
        setRewards(rewards);
      };
      asyncRewards();
      const asyncVoter = async () => {
        const voter = await foundDex.storage.storage.voters.get(accountPkh);
        if (voter) {
          setVoter({
            veto: voter.veto.div(new BigNumber(10).pow(new BigNumber(6))).toString(),
            candidate: voter.candidate,
            vote: voter.vote.div(new BigNumber(10).pow(new BigNumber(6))).toString(),
          });
        } else setVoter({} as VoterType);
      };
      asyncVoter();
      const share = await getLiquidityShare(tezos, foundDex, accountPkh!!);

      const frozenBalance = share.frozen.div(
        new BigNumber(10)
          .pow(
            // TODO: allow token->token
            new BigNumber(6),
          ),
      ).toString();
      const totalBalance = share.total.div(
        new BigNumber(10)
          .pow(
            // new BigNumber(pair.token2.metadata.decimals),
            new BigNumber(6),
          ),
      ).toString();
      const res = {
        ...pair, frozenBalance, balance: totalBalance, dex: foundDex,
      };
      setTokenPair(res);
    } catch (err) {
      console.error(err);
    }
  };
  asyncFunc();
};

const Header: React.FC<HeaderProps> = ({
  handleSubmit,
  debounce,
  save,
  values,
  form,
  tabsState,
  setRewards,
  setVoter,
  voter,
  dex,
  tokenPair,
  setTokenPair,
  setDex,
  handleTokenChange,
  currentTab,
  setTabsState,
  setVoteParams,
}) => {
  const { t } = useTranslation(['common', 'liquidity']);
  const { openConnectWalletModal } = useConnectModalsState();
  const { data: bakers } = useBakers();
  const tezos = useTezos();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const accountPkh = useAccountPkh();

  const timeout = useRef(setTimeout(() => { }, 0));
  let promise: any;

  const saveFunc = async () => {
    if (promise) {
      await promise;
    }
    setVal(values);
    setSubm(true);
    // handleInputChange(values);
    promise = save(values);
    await promise;
    setSubm(false);
  };

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(saveFunc, debounce);
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [
    values,
    tokenPair,
    dex,
    currentTab]);

  const currentCandidate: WhitelistedBaker | undefined = useMemo(() => {
    if (dex?.storage?.storage) {
      return bakers.find((x) => x.address === dex.storage.storage.current_candidate);
    }
    return {} as WhitelistedBaker;
  }, [dex, bakers]);

  const secondCandidate: WhitelistedBaker | undefined = useMemo(() => {
    if (dex?.storage?.storage) {
      return bakers.find((x) => x.address === dex.storage.storage.current_delegated);
    }
    return undefined;
  }, [dex, bakers]);

  const myCandidate: WhitelistedBaker | undefined = useMemo(() => {
    if (voter?.candidate) {
      return bakers.find((x) => x.address === voter?.candidate);
    }
    return undefined;
  }, [voter, bakers]);

  const totalVotes = useMemo(() => {
    if (dex?.storage?.storage) {
      return sharesFromNat(dex.storage.storage.total_votes).toFixed();
    }
    return '';
  }, [dex, bakers]);

  const totalVeto = useMemo(() => {
    if (dex?.storage?.storage) {
      return sharesFromNat(dex.storage.storage.veto).toFixed();
    }
    return '';
  }, [dex]);

  const votesToVeto = useMemo(() => {
    if (dex?.storage?.storage) {
      return sharesFromNat(dex.storage.storage.total_votes)
        .div(3)
        .minus(sharesFromNat(dex.storage.storage.veto))
        .toFixed(6);
    }
    return '';
  }, [dex]);

  const handleFirstButton = async () => {
    if (!tezos) return;
    if (!accountPkh) {
      openConnectWalletModal();
      return;
    }
    try {
      if (currentTab.id === 'vote') {
        const params = await voteForBaker(tezos, dex, values.selectedBaker, new BigNumber(0));
        setVoteParams(params);
      } else {
        const params = await vetoCurrentBaker(tezos, dex, new BigNumber(0));
        setVoteParams(params);
      }
    } catch (e) {
      console.error(e);
    }
    handleSubmit();
  };

  const handleSecondButton = async () => {
    if (!tezos) return;
    if (!accountPkh) {
      openConnectWalletModal();
      return;
    }
    if (!values.balance1) {
      // throw form validation error
      handleSubmit();
      return;
    }
    try {
      if (currentTab.id === 'vote') {
        const params = await voteForBaker(tezos, dex, values.selectedBaker, values.balance1);
        setVoteParams(params);
      } else {
        const params = await vetoCurrentBaker(tezos, dex, values.balance1);
        setVoteParams(params);
      }
    } catch (e) {
      console.error(e);
    }
    handleSubmit();
  };

  const pairLink = useMemo(() => (tokenPair.dex
    ? `https://analytics.quipuswap.com/pairs/${tokenPair.dex?.contract.address}`
    : '#'), [tokenPair.dex]);

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs
              values={TabsContent}
              activeId={tabsState}
              setActiveId={(val) => setTabsState(val)}
              className={s.tabs}
            />
          ),
          button: (
            <Button
              theme="quaternary"
            >
              <Transactions />
            </Button>
          ),
          className: s.header,
        }}
        contentClassName={s.content}
      >
        <Field
          name="balance1"
          validate={composeValidators(
            required,
            validateMinMax(0, tokenPair.balance ? +tokenPair.balance : Infinity),
          )}
          parse={(v) => parseDecimals(v, 0, Infinity)}
        >
          {({ input, meta }) => (
            <>
              <PositionSelect
                {...input}
                tokenPair={tokenPair}
                setTokenPair={(pair) => {
                  handleTokenChange(pair.token1, 'first');
                  handleTokenChange(pair.token2, 'second');
                  hanldeTokenPairSelect(
                    pair,
                    setTokenPair,
                    setDex,
                    setRewards,
                    setVoter,
                    tezos,
                    accountPkh,
                    networkId,
                  );
                }}
                handleBalance={(value) => {
                  form.mutators.setValue(
                    'balance1',
                    +value,
                  );
                }}
                balance={tokenPair.balance}
                notFrozen
                id="liquidity-remove-input"
                label="Select LP"
                className={s.input}
                error={(meta.touched && meta.error) || meta.submitError}
              />
              <ArrowDown className={s.iconButton} />
            </>
          )}
        </Field>
        {currentTab.id === 'vote' && (
          <Field validate={required} name="selectedBaker">
            {({ input, meta }) => (
              <ComplexBaker
                {...input}
                label="Baker"
                id="voting-baker"
                handleChange={(baker) => input.onChange(baker.address)}
                error={(meta.touched && meta.error) || meta.submitError}
              />
            )}

          </Field>
        )}
        <div className={s.buttons}>
          <Button onClick={handleFirstButton} className={s.button} theme="secondary">
            {currentTab.id === 'vote' ? 'Unvote' : 'Remove veto'}
          </Button>
          <Button onClick={handleSecondButton} className={s.button}>
            {currentTab.label}
          </Button>
        </div>

      </Card>
      <Card
        header={{
          content: 'Voting Details',
        }}
        contentClassName={s.content}
      >
        <CardCell
          header={(
            <>
              {t('vote:Delegated To')}
              <Tooltip
                sizeT="small"
                content={t('vote:Current baker elected by simple majority of votes.')}
              />
            </>
          )}
          className={s.cell}
        >
          <Button href={currentCandidate ? `https://tzkt.io/${currentCandidate.address}` : '#'} theme="underlined">
            {currentCandidate?.name}
          </Button>
        </CardCell>
        <CardCell
          header={(
            <>
              {t('vote:Second Candidate')}
              <Tooltip
                sizeT="small"
                content={t('vote:The candidate who garnered second largest number of votes. If the current baker gets vetoed, the second candidate will assume his place.')}
              />
            </>
          )}
          className={s.cell}
        >
          <Button href={secondCandidate ? `https://tzkt.io/${secondCandidate.address}` : '#'} theme="underlined">
            {secondCandidate?.name}
          </Button>
        </CardCell>
        <CardCell
          header={(
            <>
              {t('veto:Total Votes')}
              <Tooltip
                sizeT="small"
                content={t('vote:The total amount of votes cast to elect a baker in the pool.')}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount={totalVotes} />
        </CardCell>
        <CardCell
          header={(
            <>
              {t('veto:Total Vetos')}
              <Tooltip
                sizeT="small"
                content={t('vote:The total amount of shares cast so far to veto the current baker.')}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount={totalVeto} />
        </CardCell>
        <CardCell
          header={(
            <>
              {t('veto:Your Candidate')}
              <Tooltip
                sizeT="small"
                content={t('vote:The candidate you voted for.')}
              />
            </>
          )}
          className={s.cell}
        >
          <Button href={myCandidate ? `https://tzkt.io/${myCandidate.address}` : '#'} theme="underlined">
            {myCandidate?.name}
          </Button>
        </CardCell>
        <CardCell
          header={(
            <>
              {t('Votes To Veto Left')}
              <Tooltip
                sizeT="small"
                content={t('vote:This much more votes needed to veto a delegate.')}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount={votesToVeto} />
        </CardCell>
        <div className={s.detailsButtons}>
          <Button
            className={s.detailsButton}
            theme="inverse"
            href={pairLink}
          >
            Pair Analytics
            <ExternalLink className={s.linkIcon} />
          </Button>
          <Button
            className={s.detailsButton}
            theme="inverse"
            href="#"
            // TODO: find out delegation analytics reqs
          >
            Delegation Analytics
            <ExternalLink className={s.linkIcon} />
          </Button>
        </div>
      </Card>
    </>
  );
};

const AutoSave = (props: any) => (
  <FormSpy {...props} subscription={{ values: true }} component={Header} />
);

const fallbackTokenPair = {
  token1: TEZOS_TOKEN,
  token2: TEZOS_TOKEN,
} as WhitelistedTokenPair;

type VoterType = {
  vote: string,
  veto: string,
  candidate: string
};

export const Voting: React.FC<VotingProps> = ({
  className,
}) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes
  const [tokensData, setTokensData] = useState<TokenDataMap>(
    {
      first: fallbackTokensData,
      second: fallbackTokensData,
    },
  );

  const [voteParams, setVoteParams] = useState<TransferParams[]>([]);
  const { Form } = withTypes<FormValues>();
  const [dex, setDex] = useState<FoundDex>();
  const [rewards, setRewards] = useState('0');
  const [voter, setVoter] = useState<VoterType>();
  const [
    tokenPair,
    setTokenPair,
  ] = useState<WhitelistedTokenPair>(fallbackTokenPair);

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

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
    const newTokensData = {
      ...tokensData,
      [tokenNumber]: {
        token: {
          address: token.contractAddress,
          type: token.type,
          id: token.fa2TokenId,
          decimals: token.metadata.decimals,
        },
        balance: finalBalance,
      },
    };

    setTokensData(newTokensData);
  };

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
            const asyncFunc = async () => {
              const op = await batchify(
                tezos.wallet.batch([]),
                voteParams,
              ).send();
              await op.confirmation();
            };
            asyncFunc();
          }}
          mutators={{
            setValue: ([field, value], state, { changeValue }) => {
              changeValue(state, field, () => value);
            },
          }}
          render={({ handleSubmit, form }) => (
            <AutoSave
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
