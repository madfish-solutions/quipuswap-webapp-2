import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy } from 'react-final-form';
import { findDex, FoundDex, Token } from '@quipuswap/sdk';

import { useAccountPkh, useNetwork, useTezos } from '@providers/dapp';
import useUpdateToast from '@hooks/useUpdateToast';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import {
  QSMainNet,
  TokenDataMap,
  VoteFormValues,
  WhitelistedToken,
  WhitelistedTokenPair,
  VoterType,
} from '@utils/types';
import { tokenDataToToken } from '@utils/helpers/tokenDataToToken';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import {
  getWhitelistedTokenSymbol,
  isAssetEqual,
  parseDecimals,
  parseTezDecimals,
} from '@utils/helpers';
import { composeValidators, validateBalance, validateMinMax } from '@utils/validators';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { ComplexBaker } from '@components/ui/ComplexInput';
import { Transactions } from '@components/svg/Transactions';

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

type VotingFormProps = {
  handleSubmit: () => void;
  debounce: number;
  save: any;
  values: VoteFormValues;
  form: any;
  tabsState: any;
  rewards: string;
  setRewards: (reward: string) => void;
  dex?: FoundDex;
  setDex: (dex: FoundDex | undefined) => void;
  voter?: VoterType;
  setVoter: (voter: any) => void;
  setTokens: (tokens: WhitelistedToken[]) => void;
  tokenPair: WhitelistedTokenPair;
  setTokenPair: (pair: WhitelistedTokenPair) => void;
  tokensData: TokenDataMap;
  handleTokenChange: (token: WhitelistedToken, tokenNumber: 'first' | 'second') => void;
  currentTab: any;
  setTabsState: (val: any) => void;
};

const RealForm: React.FC<VotingFormProps> = ({
  handleSubmit,
  debounce,
  save,
  values,
  form,
  tabsState,
  setRewards,
  setDex,
  dex,
  setTokens,
  setVoter,
  voter,
  tokenPair,
  setTokenPair,
  handleTokenChange,
  tokensData,
  currentTab,
  setTabsState,
}) => {
  const { t } = useTranslation(['common', 'vote']);
  const updateToast = useUpdateToast();
  const { openConnectWalletModal, connectWalletModalOpen, closeConnectWalletModal } =
    useConnectModalsState();
  const tezos = useTezos();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const router = useRouter();
  const accountPkh = useAccountPkh();
  const [oldAsset, setOldAsset] = useState<Token>();
  const [isBanned, setIsBanned] = useState<boolean>(false);

  const handleErrorToast = useCallback(
    (err) => {
      updateToast({
        type: 'error',
        render: `${err.name}: ${err.message}`,
      });
    },
    [updateToast],
  );

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise: any;

  const handleInputChange = async () => {
    if (!tezos) return;
    const currentTokenA = tokenDataToToken(tokensData.first);
    if (currentTokenA.contractAddress !== TEZOS_TOKEN.contractAddress) return;
    if (tezos && tokenPair) {
      const toAsset = {
        contract: tokenPair.token2.contractAddress,
        id: tokenPair.token2.fa2TokenId ?? undefined,
      };
      const isAssetSame = isAssetEqual(toAsset, oldAsset ?? { contract: '' });
      if (isAssetSame) return;
      setDex(undefined);
      const tempDex = await findDex(tezos, FACTORIES[networkId], toAsset);
      if (tempDex && tempDex !== dex) {
        setDex(tempDex);
      }
      setOldAsset(toAsset);
    }
  };

  const saveFunc = async () => {
    if (promise) {
      await promise;
    }
    setVal(values);
    setSubm(true);
    handleInputChange();
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
    // eslint-disable-next-line
  }, [values.balance1, values.selectedBaker, tokenPair, dex, currentTab]);

  useEffect(() => {
    if (connectWalletModalOpen && accountPkh) {
      closeConnectWalletModal();
    }
    // eslint-disable-next-line
  }, [accountPkh, closeConnectWalletModal]);

  const handleUnvoteOrRemoveveto = async () => {
    if (!tezos) return;
    if (!dex) return;
    if (!accountPkh) {
      openConnectWalletModal();
      return;
    }
    form.mutators.setValue('method', 'first');
    handleSubmit();
  };

  const handleVoteOrVeto = async () => {
    if (!tezos) return;
    if (!dex) return;
    if (!accountPkh) {
      openConnectWalletModal();
      return;
    }
    form.mutators.setValue('method', 'second');
    if (!values.balance1) {
      // throw form validation error
      handleSubmit();
      return;
    }
    handleSubmit();
  };

  const availVoteBalance: string = useMemo(
    () =>
      tokenPair.balance && tokenPair.frozenBalance && voter
        ? new BigNumber(tokenPair.balance)
            .minus(new BigNumber(tokenPair.frozenBalance))
            .plus(new BigNumber(voter.vote ?? '0'))
            .toString()
        : new BigNumber(0).toString(),
    [tokenPair, voter],
  );

  const availVetoBalance: string = useMemo(
    () =>
      tokenPair.balance && tokenPair.frozenBalance && voter
        ? new BigNumber(tokenPair.balance).minus(new BigNumber(voter.vote ?? '0')).toString()
        : new BigNumber(0).toString(),
    [tokenPair, voter],
  );

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs
              values={TabsContent}
              activeId={tabsState}
              setActiveId={(val) => {
                router.replace(
                  `/voting/${val}/${getWhitelistedTokenSymbol(
                    tokenPair.token1,
                  )}-${getWhitelistedTokenSymbol(tokenPair.token2)}`,
                  undefined,
                  { shallow: true },
                );
                setTabsState(val);
              }}
              className={s.tabs}
            />
          ),
          button: (
            <Button theme="quaternary">
              <Transactions />
            </Button>
          ),
          className: s.header,
        }}
        contentClassName={s.content}
      >
        <Field name="method" initialValue="first">
          {() => <></>}
        </Field>
        <Field
          name="balance1"
          validate={composeValidators(
            validateMinMax(0, Infinity),
            accountPkh
              ? validateBalance(new BigNumber(tokenPair.balance ? tokenPair.balance : Infinity))
              : () => undefined,
          )}
          parse={(v) => parseDecimals(v, 0, Infinity, tokenPair.token1.metadata.decimals)}
        >
          {({ input, meta }) => (
            <PositionSelect
              {...input}
              autoComplete="off"
              notSelectable1={TEZOS_TOKEN}
              tokenPair={tokenPair}
              setTokenPair={(pair) => {
                handleTokenChange(pair.token1, 'first');
                handleTokenChange(pair.token2, 'second');
                setTokens([pair.token1, pair.token2]);
                hanldeTokenPairSelect(
                  pair,
                  setTokenPair,
                  setDex,
                  setRewards,
                  setVoter,
                  handleErrorToast,
                  tezos,
                  accountPkh,
                  networkId,
                );
              }}
              balance={currentTab.id === 'vote' ? availVoteBalance : availVetoBalance}
              handleBalance={(value) => {
                form.mutators.setValue('balance1', +parseTezDecimals(value));
              }}
              noBalanceButtons={!accountPkh}
              balanceLabel={t('vote|Available Balance')}
              notFrozen
              id="liquidity-remove-input"
              label={currentTab.label}
              className={s.input}
              error={(meta.touched && meta.error) || meta.submitError}
            />
          )}
        </Field>
        {currentTab.id === 'vote' && (
          <Field name="selectedBaker">
            {({ input, meta }) => (
              <ComplexBaker
                {...input}
                label="Baker"
                id="voting-baker"
                className={s.mt12}
                handleChange={(bakerObj) => {
                  input.onChange(bakerObj.address);
                  const asyncisBanned = async () => {
                    if (!dex) return;
                    const tempBaker = await dex.storage.storage.vetos.get(bakerObj.address);
                    setIsBanned(!!tempBaker);
                  };
                  asyncisBanned();
                }}
                error={(meta.touched && meta.error) || meta.submitError}
              />
            )}
          </Field>
        )}
        <div className={s.buttons}>
          <Button
            onClick={handleUnvoteOrRemoveveto}
            className={s.button}
            theme="secondary"
            disabled={
              currentTab.id === 'vote'
                ? new BigNumber(voter?.vote ?? '0').eq(0)
                : new BigNumber(voter?.veto ?? '0').eq(0)
            }
          >
            {currentTab.id === 'vote' ? 'Unvote' : 'Remove veto'}
          </Button>
          <Button
            onClick={handleVoteOrVeto}
            className={s.button}
            disabled={
              !values.balance1 || (currentTab.id === 'vote' && isBanned) || !values.selectedBaker
            }
          >
            {currentTab.id === 'vote' && isBanned ? t('vote|Baker under Veto') : currentTab.label}
          </Button>
        </div>
      </Card>
      <VotingDetails tokenPair={tokenPair} dex={dex} voter={voter} />
    </>
  );
};

export const VotingForm = (props: any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
