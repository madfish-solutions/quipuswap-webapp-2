import React, {
  useRef, useMemo, useState, useEffect,
} from 'react';
import { Token, findDex, FoundDex } from '@quipuswap/sdk';
import { Card, Tabs, Button } from '@quipuswap/ui-kit';
import { Field, FormSpy } from 'react-final-form';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import BigNumber from 'bignumber.js';

import { useTezos, useNetwork, useAccountPkh } from '@utils/dapp';
import {
  TokenDataMap,
  VoteFormValues,
  WhitelistedToken,
  WhitelistedTokenPair,
  VoterType,
  Undefined,
} from '@utils/types';
import { tokenDataToToken } from '@utils/helpers/tokenDataToToken';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import {
  isAssetEqual,
  parseDecimals,
  getWhitelistedTokenSymbol,
} from '@utils/helpers';
import {
  required,
  validateMinMax,
  validateBalance,
  composeValidators,
} from '@utils/validators';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { ComplexBaker } from '@components/ui/ComplexInput';

import s from '@styles/CommonContainer.module.sass';

import { FormApi } from 'final-form';
import { VotingDetails } from './VotingDetails';
import {
  hanldeTokenPairSelect,
  unvoteOrRemoveVeto,
} from './helpers/votingHelpers';
import { useVotingToast } from './useVotingToast';
import { getVoteVetoBalances } from './helpers/getVoteVetoBalance';

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

interface VotingFormProps {
  handleSubmit: () => void;
  debounce: number;
  save: any;
  values: VoteFormValues;
  form: FormApi<VoteFormValues, Partial<VoteFormValues>>;
  tabsState: any;
  rewards: string;
  setRewards: (reward: string) => void;
  dex?: FoundDex;
  setDex: (dex: FoundDex) => void;
  voter?: VoterType;
  setVoter: (voter: any) => void;
  setTokens: (tokens: WhitelistedToken[]) => void;
  tokenPair: WhitelistedTokenPair;
  setTokenPair: (pair: WhitelistedTokenPair) => void;
  tokensData: TokenDataMap;
  handleTokenChange: (
    token: WhitelistedToken,
    tokenNumber: 'first' | 'second'
  ) => void;
  currentTab: any;
  setTabsState: (val: any) => void;
  getBalance: () => void;
}

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
  getBalance,
}) => {
  const { t } = useTranslation(['common', 'vote']);
  const { updateToast, handleErrorToast } = useVotingToast();
  const {
    openConnectWalletModal,
    connectWalletModalOpen,
    closeConnectWalletModal,
  } = useConnectModalsState();
  const tezos = useTezos();
  const networkId = useNetwork().id;
  const [, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const router = useRouter();
  const accountPkh = useAccountPkh();
  const [oldAsset, setOldAsset] = useState<Token>();
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const [isBakerChoosen, setIsBakerChoosen] = useState(false)

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

  const handleVoteOrVeto = async () => {
    if (!tezos || !dex) return;

    if (!accountPkh) {
      return openConnectWalletModal();
    }

    if (!values.balance1) {
      // throw form validation error
      handleSubmit();
      return;
    }
    form.resumeValidation();
    handleSubmit();
  };

  const handleUnvoteOrRemoveveto = async () => {
    if (!tezos || !dex) return;

    if (!accountPkh) {
      return openConnectWalletModal();
    }

    unvoteOrRemoveVeto(
      currentTab.id,
      tezos,
      dex,
      { updateToast, handleErrorToast },
      getBalance,
      voter?.candidate,
    );
  };

  const { availableVoteBalance, availableVetoBalance } = useMemo(
    () => getVoteVetoBalances(tokenPair, voter),
    [tokenPair, voter],
  );

  const errorInterceptor = (value: Undefined<string>): Undefined<string> => {
    if (isFormError !== Boolean(value)) setIsFormError(Boolean(value));

    return value;
  };

  const toSixDecimals = (value: string) => new BigNumber(value)
    .decimalPlaces(TEZOS_TOKEN.metadata.decimals)
    .toNumber();

  const handleSetActiveId = (val: string) => {
    router.replace(
      `/voting/${val}/${getWhitelistedTokenSymbol(
        tokenPair.token1,
      )}-${getWhitelistedTokenSymbol(tokenPair.token2)}`,
      undefined,
      { shallow: true },
    );
    setTabsState(val);
  };

  const isVoteOrVetoButtonDisabled = () => !values.balance1
    || (currentTab.id === 'vote' && isBanned)
    || isFormError
    || !accountPkh
    || !isBakerChoosen

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs
              values={TabsContent}
              activeId={tabsState}
              setActiveId={handleSetActiveId}
              className={s.tabs}
            />
          ),
          className: s.header,
        }}
        contentClassName={s.content}
      >
        <Field
          name="balance1"
          validate={composeValidators(
            validateMinMax(0, Infinity),
            accountPkh
              ? validateBalance(
                new BigNumber(
                  tokenPair.balance ? tokenPair.balance : Infinity,
                ),
              )
              : () => undefined,
          )}
          parse={(v) => parseDecimals(v, 0, Infinity, tokenPair.token1.metadata.decimals)}
        >
          {({ input, meta }) => (
            <PositionSelect
              {...input}
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
              balance={
                currentTab.id === 'vote'
                  ? availableVoteBalance
                  : availableVetoBalance
              }
              handleBalance={(value) => {
                form.mutators.setValue('balance1', toSixDecimals(value));
              }}
              noBalanceButtons={!accountPkh}
              balanceLabel={t('vote|Available balance')}
              notFrozen
              id="liquidity-remove-input"
              label={currentTab.label}
              className={s.input}
              error={errorInterceptor(
                (meta.touched && meta.error) || meta.submitError,
              )}
            />
          )}
        </Field>
        {currentTab.id === 'vote' && (
          <Field name="selectedBaker" validate={required}>
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
                    
                    if(!isBakerChoosen) setIsBakerChoosen(true)

                    const tempBaker = await dex.storage.storage.vetos.get(
                      bakerObj.address,
                    );
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
            disabled={isVoteOrVetoButtonDisabled()}
          >
            {currentTab.id === 'vote' && isBanned
              ? t('vote|Baker under Veto')
              : currentTab.label}
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
