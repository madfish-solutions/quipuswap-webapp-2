import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

import { findDex, FoundDex, Token } from '@quipuswap/sdk';
import { Card, Tabs } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { FormApi } from 'final-form';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Field, FormSpy } from 'react-final-form';

import { FACTORIES, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { ComplexBaker } from '@components/ui/ComplexInput';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { Button } from '@components/ui/elements/button';
import { BakerCleaner, getCandidateInfo, getVoteVetoBalances, unvoteOrRemoveVeto } from '@containers/voiting/helpers';
import { VotingTabs } from '@containers/voiting/tabs.enum';
import { useToasts } from '@hooks/use-toasts';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import s from '@styles/CommonContainer.module.sass';
import { useAccountPkh, useBakers, useTezos } from '@utils/dapp';
import { useConfirmOperation } from '@utils/dapp/confirm-operation';
import { getTokenSlug, isAssetEqual, isNull, parseDecimals } from '@utils/helpers';
import { tokenDataToToken } from '@utils/helpers/tokenDataToToken';
import { Nullable, TokenDataMap, Undefined, VoteFormValues, VoterType, WhitelistedTokenPair } from '@utils/types';
import { composeValidators, required, validateBalance, validateMinMax } from '@utils/validators';

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
  values: VoteFormValues;
  form: FormApi<VoteFormValues, Partial<VoteFormValues>>;
  tabsState: VotingTabs;
  rewards: string;
  dex: Nullable<FoundDex>;
  voter: VoterType;
  tokenPair: WhitelistedTokenPair;
  tokensData: TokenDataMap;
  currentTab: TabsContent;
  tokensUpdading: boolean;
  setDex: Dispatch<SetStateAction<Nullable<FoundDex>>>;
  onChangeTokenPair: (pair: WhitelistedTokenPair) => void;
  onUnvoteOrRemoveVeto: () => void;
  setTabsState: (val: VotingTabs) => void;
  handleSubmit: () => Promise<void>;
  bakerCleaner: BakerCleaner;
}

const KEY_IS_BAKER_CHOSEN_TO_FALSE = 'isBakerChosenToFalse';
const toSixDecimals = (value: string) => new BigNumber(value).decimalPlaces(TEZOS_TOKEN.metadata.decimals).toNumber();

const RealForm: FC<VotingFormProps> = ({
  handleSubmit,
  values,
  form,
  tabsState,
  setDex,
  dex,
  onChangeTokenPair,
  voter,
  tokenPair,
  tokensData,
  currentTab,
  setTabsState,
  tokensUpdading,
  bakerCleaner,
  onUnvoteOrRemoveVeto
  // eslint-disable-next-line
}) => {
  const { t } = useTranslation(['common', 'vote']);
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { connectWalletModalOpen, closeConnectWalletModal } = useConnectModalsState();
  const tezos = useTezos();
  const router = useRouter();
  const accountPkh = useAccountPkh();
  const [oldAsset, setOldAsset] = useState<Token>();
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const [isBakerChoosen, setIsBakerChoosen] = useState(false);

  const { data: bakers } = useBakers();
  const { currentCandidate } = getCandidateInfo(dex, bakers);

  useEffect(() => bakerCleaner.set(KEY_IS_BAKER_CHOSEN_TO_FALSE, () => setIsBakerChoosen(false)), [bakerCleaner]);

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
      const tempDex = await findDex(tezos, FACTORIES[NETWORK_ID], toAsset);
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
    form.mutators.setValue('balance1', form.getFieldState('balance1')!.value);
    // eslint-disable-next-line
  }, [currentTab, dex]);

  useEffect(() => {
    if (connectWalletModalOpen && accountPkh) {
      closeConnectWalletModal();
    }
    // eslint-disable-next-line
  }, [accountPkh, closeConnectWalletModal]);

  const handleVoteOrVeto = async () => {
    if (!tezos || !dex || !values.balance1) {
      return;
    }

    await handleSubmit();
  };

  const handleUnvoteOrRemoveVeto = async () => {
    if (!tezos || !dex || isNull(voter.candidate)) {
      return;
    }

    try {
      await unvoteOrRemoveVeto(currentTab.id, tezos, dex, confirmOperation, voter.candidate);
    } catch (error) {
      showErrorToast(error as Error);
    }

    onUnvoteOrRemoveVeto();
  };

  const { availableVoteBalance, availableVetoBalance } = getVoteVetoBalances(tokenPair, voter);

  const errorInterceptor = (value: Undefined<string>): Undefined<string> => {
    if (isFormError !== Boolean(value)) {
      setIsFormError(Boolean(value));
    }

    return value;
  };

  const handleSetActiveId = (val: string) => {
    router.replace(`/voting/${val}/${getTokenSlug(tokenPair.token1)}-${getTokenSlug(tokenPair.token2)}`, undefined, {
      shallow: true
    });
    setTabsState(val as VotingTabs);
  };

  const isVetoUnavailable = !currentCandidate && currentTab.id === VotingTabs.veto;
  const isBackerChooseRequired = !isBakerChoosen && currentTab.id === VotingTabs.vote;
  const isBackerBanned = currentTab.id === VotingTabs.vote && isBanned;

  const isVoteOrVetoButtonDisabled = () =>
    !values.balance1 || isBackerBanned || isFormError || isBackerChooseRequired || isVetoUnavailable;

  const availableBalance = currentTab.id === VotingTabs.vote ? availableVoteBalance : availableVetoBalance;

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
              setTokenPair={onChangeTokenPair}
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
              tokensUpdading={tokensUpdading}
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
                className={s.mt24}
                cleanBaker={bakerCleaner}
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
              onClick={handleUnvoteOrRemoveVeto}
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
            <ConnectWalletButton className={cx(s.connect, s['mt-24'])} />
          )}
        </div>
      </Card>
    </>
  );
};

// TODO: Remove any
// eslint-disable-next-line
export const VotingForm = (props: any) => <FormSpy {...props} subscription={{ values: true }} component={RealForm} />;
