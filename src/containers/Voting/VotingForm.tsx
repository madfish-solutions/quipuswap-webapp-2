import React, {
  useEffect, useRef, useState,
} from 'react';
import BigNumber from 'bignumber.js';
import { Field, FormSpy } from 'react-final-form';
import {
  FoundDex,
  TransferParams,
  vetoCurrentBaker,
  voteForBaker,
} from '@quipuswap/sdk';

import {
  useAccountPkh, useNetwork, useTezos,
} from '@utils/dapp';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import {
  QSMainNet,
  TokenDataMap,
  VoteFormValues,
  WhitelistedToken, WhitelistedTokenPair,
} from '@utils/types';
import { parseDecimals } from '@utils/helpers';
import {
  composeValidators, validateBalance, validateMinMax,
} from '@utils/validators';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { ComplexBaker } from '@components/ui/ComplexInput';
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

type LiquidityFormProps = {
  handleSubmit: () => void,
  setVoteParams: (params: TransferParams[]) => void,
  debounce: number,
  save: any,
  values: VoteFormValues,
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

const RealForm:React.FC<LiquidityFormProps> = ({
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
            validateMinMax(0, Infinity),
            validateBalance(new BigNumber(tokenPair.balance ? tokenPair.balance : Infinity)),
          )}
          parse={(v) => parseDecimals(v, 0, Infinity, tokenPair.token1.metadata.decimals)}
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
          <Field name="selectedBaker">
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
          <Button
            onClick={handleFirstButton}
            className={s.button}
            theme="secondary"
            disabled={!values.selectedBaker}
          >
            {currentTab.id === 'vote' ? 'Unvote' : 'Remove veto'}
          </Button>
          <Button
            disabled={!values.selectedBaker}
            onClick={handleSecondButton}
            className={s.button}
          >
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

export const VotingForm = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
