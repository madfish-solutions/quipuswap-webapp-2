import React, { useMemo, useState, useEffect, SetStateAction, Dispatch } from 'react';

import { Token, findDex, FoundDex } from '@quipuswap/sdk';
import { Card, Tabs } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { FormApi } from 'final-form';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Field, FormSpy } from 'react-final-form';

import { FACTORIES, TEZOS_TOKEN } from '@app.config';
import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { ComplexBaker } from '@components/ui/ComplexInput';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { Button } from '@components/ui/elements/button';
import {
  getCandidateInfo,
  getVoteVetoBalances,
  handleTokenPairSelect,
  unvoteOrRemoveVeto
} from '@containers/voiting/helpers';
import { VotingTabs } from '@containers/voiting/tabs.enum';
import { useToasts } from '@hooks/use-toasts';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import CC from '@styles/CommonContainer.module.sass';
import s from '@styles/CommonContainer.module.sass';
import { useTezos, useNetwork, useAccountPkh, useBakers } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { isAssetEqual, parseDecimals, getWhitelistedTokenSymbol, isNull } from '@utils/helpers';
import { tokenDataToToken } from '@utils/helpers/tokenDataToToken';
import {
  TokenDataMap,
  VoteFormValues,
  WhitelistedToken,
  WhitelistedTokenPair,
  VoterType,
  Undefined,
  Nullable
} from '@utils/types';
import { required, validateMinMax, validateBalance, composeValidators } from '@utils/validators';

interface TabsContent {
  id: VotingTabs;
  label: string;
}
const TabsContent = [
  {
    id: VotingTabs.vote,
    label: 'Vote'
  },
  {
    id: VotingTabs.veto,
    label: 'Veto'
  }
];

interface VotingFormProps {
  save: (arg: VoteFormValues) => void;
  debounce: number;
  values: VoteFormValues;
  form: FormApi<VoteFormValues, Partial<VoteFormValues>>;
  tabsState: VotingTabs;
  rewards: string;
  dex: Nullable<FoundDex>;
  voter: VoterType;
  tokenPair: WhitelistedTokenPair;
  tokensData: TokenDataMap;
  currentTab: TabsContent;
  setRewards: Dispatch<SetStateAction<string>>;
  setDex: Dispatch<SetStateAction<Nullable<FoundDex>>>;
  setTokens: (tokens: WhitelistedToken[]) => void;
  setTokenPair: Dispatch<SetStateAction<WhitelistedTokenPair>>;
  setVoter: Dispatch<SetStateAction<Nullable<VoterType>>>;
  setTabsState: (val: VotingTabs) => void;
  getBalance: () => void;
  handleSubmit: () => void;
  handleTokenChange: (token: WhitelistedToken, tokenNumber: 'first' | 'second') => void;
}

const toSixDecimals = (value: string) => new BigNumber(value).decimalPlaces(TEZOS_TOKEN.metadata.decimals).toNumber();

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
  getBalance
  // eslint-disable-next-line
}) => {
  const { t } = useTranslation(['common', 'vote']);
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { connectWalletModalOpen, closeConnectWalletModal } = useConnectModalsState();
  const tezos = useTezos();
  const networkId = useNetwork().id;
  const router = useRouter();
  const accountPkh = useAccountPkh();
  const [oldAsset, setOldAsset] = useState<Token>();
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const [isBakerChoosen, setIsBakerChoosen] = useState(false);

  const { data: bakers } = useBakers();
  const { currentCandidate } = getCandidateInfo(dex, bakers);

  const handleInputChange = async () => {
    if (!tezos) {
      return;
    }
    const currentTokenA = tokenDataToToken(tokensData.first);
    if (currentTokenA.contractAddress !== TEZOS_TOKEN.contractAddress) {
      return;
    }
    if (tezos && tokenPair) {
      const toAsset = {
        contract: tokenPair.token2.contractAddress,
        id: tokenPair.token2.fa2TokenId ?? undefined
      };
      const isAssetSame = isAssetEqual(toAsset, oldAsset ?? { contract: '' });
      if (isAssetSame) {
        return;
      }
      const tempDex = await findDex(tezos, FACTORIES[networkId], toAsset);
      if (tempDex && tempDex !== dex) {
        setDex(tempDex);
      }
      setOldAsset(toAsset);
    }
  };

  useEffect(() => {
    handleInputChange();
    // eslint-disable-next-line
  }, [values.balance1, values.selectedBaker, tokenPair, dex, currentTab]);

  useEffect(() => {
    if (connectWalletModalOpen && accountPkh) {
      closeConnectWalletModal();
    }
    // eslint-disable-next-line
  }, [accountPkh, closeConnectWalletModal]);

  const handleVoteOrVeto = async () => {
    if (!tezos || !dex) {
      return;
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
    if (!tezos || !dex || isNull(voter.candidate)) {
      return;
    }

    unvoteOrRemoveVeto(currentTab.id, tezos, dex, showErrorToast, confirmOperation, getBalance, voter.candidate);
  };

  const { availableVoteBalance, availableVetoBalance } = useMemo(
    () => getVoteVetoBalances(tokenPair, voter),
    [tokenPair, voter]
  );

  const errorInterceptor = (value: Undefined<string>): Undefined<string> => {
    if (isFormError !== Boolean(value)) {
      setIsFormError(Boolean(value));
    }

    return value;
  };

  const handleSetActiveId = (val: string) => {
    router.replace(
      `/voting/${val}/${getWhitelistedTokenSymbol(tokenPair.token1)}-${getWhitelistedTokenSymbol(tokenPair.token2)}`,
      undefined,
      { shallow: true }
    );
    setTabsState(val as VotingTabs);
  };

  const isVetoUnevailable = !currentCandidate && currentTab.id === 'veto';
  const isBackerChooseRequired = !isBakerChoosen && currentTab.id === 'veto';
  const isBackerBanned = currentTab.id === 'vote' && isBanned;

  const isVoteOrVetoButtonDisabled = () =>
    !values.balance1 || isBackerBanned || isFormError || isBackerChooseRequired || isVetoUnevailable;

  const availableBalance = currentTab.id === 'vote' ? availableVoteBalance : availableVetoBalance;

  const validateBalance_ = accountPkh ? validateBalance(new BigNumber(availableBalance)) : () => undefined;

  const validate = composeValidators(validateMinMax(0, Infinity), validateBalance_);

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs values={TabsContent} activeId={tabsState} setActiveId={handleSetActiveId} className={s.tabs} />
          ),
          className: s.header
        }}
        contentClassName={s.content}
      >
        <Field
          name="balance1"
          validate={validate}
          parse={v => parseDecimals(v, 0, Infinity, tokenPair.token1.metadata.decimals)}
        >
          {({ input, meta }) => (
            <PositionSelect
              {...input}
              notSelectable1={TEZOS_TOKEN}
              tokenPair={tokenPair}
              setTokenPair={pair => {
                handleTokenChange(pair.token1, 'first');
                handleTokenChange(pair.token2, 'second');
                setTokens([pair.token1, pair.token2]);
                handleTokenPairSelect(
                  pair,
                  setTokenPair,
                  setDex,
                  setRewards,
                  setVoter,
                  showErrorToast,
                  tezos,
                  accountPkh,
                  networkId
                );
              }}
              balance={availableBalance}
              handleBalance={value => {
                form.mutators.setValue('balance1', toSixDecimals(value));
              }}
              shouldShowBalanceButtons={Boolean(accountPkh)}
              balanceLabel={t('vote|Available balance')}
              notFrozen
              id="liquidity-remove-input"
              label={currentTab.label}
              className={s.input}
              error={errorInterceptor((meta.dirty && meta.error) || meta.submitError)}
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
                handleChange={bakerObj => {
                  input.onChange(bakerObj.address);
                  const asyncisBanned = async () => {
                    if (!dex) {
                      return;
                    }

                    if (!isBakerChoosen) {
                      setIsBakerChoosen(true);
                    }

                    const tempBaker = await dex.storage.storage.vetos.get(bakerObj.address);
                    setIsBanned(!!tempBaker);
                  };
                  void asyncisBanned();
                }}
                error={(meta.touched && meta.error) || meta.submitError}
              />
            )}
          </Field>
        )}
        <div className={s.buttons}>
          {accountPkh && (
            <Button
              onClick={handleUnvoteOrRemoveveto}
              className={s.button}
              theme="secondary"
              disabled={
                currentTab.id === VotingTabs.vote
                  ? new BigNumber(voter?.vote ?? '0').eq(0)
                  : new BigNumber(voter?.veto ?? '0').eq(0)
              }
            >
              {currentTab.id === VotingTabs.vote ? 'Unvote' : 'Remove veto'}
            </Button>
          )}
          {accountPkh ? (
            <Button onClick={handleVoteOrVeto} className={s.button} disabled={isVoteOrVetoButtonDisabled()}>
              {currentTab.id === VotingTabs.vote && isBanned ? t('vote|Baker under Veto') : currentTab.label}
            </Button>
          ) : (
            <ConnectWalletButton className={cx(CC.connect, s['mt-24'])} />
          )}
        </div>
      </Card>
    </>
  );
};

// eslint-disable-next-line
export const VotingForm = (props: any) => <FormSpy {...props} subscription={{ values: true }} component={RealForm} />;
