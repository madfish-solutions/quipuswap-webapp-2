import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import BigNumber from 'bignumber.js';
import { withTypes, Field, FormSpy } from 'react-final-form';
import {
  batchify,
  FoundDex,
  TransferParams,
  vetoCurrentBaker,
  voteForBaker,
} from '@quipuswap/sdk';

import { useConnectModalsState } from '@hooks/useConnectModalsState';
import {
  getUserBalance,
  useAccountPkh, useNetwork, useTezos,
} from '@utils/dapp';
import { composeValidators, required, validateMinMax } from '@utils/validators';
import { parseDecimals } from '@utils/helpers';
import {
  VoterType, WhitelistedToken, WhitelistedTokenPair,
} from '@utils/types';
import { TEZOS_TOKEN } from '@utils/defaults';
import { VotingStats } from '@components/voting/VotingStats';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { ComplexBaker } from '@components/ui/ComplexInput';
import { StickyBlock } from '@components/common/StickyBlock';
import { Transactions } from '@components/svg/Transactions';
import { ArrowDown } from '@components/svg/ArrowDown';

import s from '@styles/CommonContainer.module.sass';
import { VotingDetails } from './VotingDetails';
import { hanldeTokenPairSelect } from './votingHelpers';

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
  const { openConnectWalletModal } = useConnectModalsState();
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
      <VotingDetails
        tokenPair={tokenPair}
        dex={dex}
        voter={voter}
      />
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
