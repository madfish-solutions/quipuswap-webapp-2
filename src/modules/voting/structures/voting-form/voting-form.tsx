import { useState, useEffect } from 'react';

import { Token, findDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { FormApi } from 'final-form';
import { Field, FormSpy } from 'react-final-form';

import { FACTORIES } from '@config/config';
import { LP_TOKEN_DECIMALS } from '@config/constants';
import { NETWORK_ID } from '@config/enviroment';
import { TEZOS_TOKEN, TEZOS_TOKEN_DECIMALS } from '@config/tokens';
import { UnvoteButton } from '@modules/voting/components';
import { getCandidateInfo } from '@modules/voting/helpers';
import {
  useAvailableBalances,
  useTokensLoading,
  useTokensPair,
  useVotingDex,
  useVotingHandlers,
  useVotingRouting,
  useVotingTokens
} from '@modules/voting/helpers/voting.provider';
import { TabsContent } from '@modules/voting/hooks';
import { VotingTabs } from '@modules/voting/tabs.enum';
import { useBakers } from '@providers/dapp-bakers';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { ConnectWalletButton, ComplexBaker, Tabs, Card } from '@shared/components';
import { Button } from '@shared/components/button';
import { PositionSelect } from '@shared/components/ComplexInput/PositionSelect';
import { isAssetEqual, parseDecimals, isTezosToken } from '@shared/helpers';
import { tokenDataToToken } from '@shared/helpers/token-data-to-token';
import { VoteFormValues, Undefined } from '@shared/types';
import { required, validateMinMax, validateBalance, composeValidators } from '@shared/validators';
import s from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

interface VotingFormProps {
  values: VoteFormValues;
  form: FormApi<VoteFormValues, Partial<VoteFormValues>>;
  handleSubmit: () => Promise<void>;
}

const toSixDecimals = (value: string) => new BigNumber(value).decimalPlaces(TEZOS_TOKEN_DECIMALS).toNumber();

const RealForm: React.FC<VotingFormProps> = ({
  handleSubmit,
  values,
  form
  // eslint-disable-next-line
}) => {
  const { t } = useTranslation(['common', 'vote']);
  const { connectWalletModalOpen, closeConnectWalletModal } = useGlobalModalsState();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const [oldAsset, setOldAsset] = useState<Token>();
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const [isBakerChoosen, setIsBakerChoosen] = useState(false);

  const { data: bakers } = useBakers();

  const { dex, setDex } = useVotingDex();
  const { currentCandidate } = getCandidateInfo(dex, bakers);
  const { token1 } = useVotingTokens();
  const { tokenPair } = useTokensPair();
  const { votingTab, handleSetActiveId, currentTab } = useVotingRouting();
  const { handleTokenPairSelectChange } = useVotingHandlers();
  const { availableBalance } = useAvailableBalances();
  const tokensUpdating = useTokensLoading();

  const handleInputChange = async () => {
    try {
      const currentTokenA = tokenDataToToken(token1);
      if (isTezosToken(currentTokenA) && tezos && tokenPair) {
        const toAsset = {
          contract: tokenPair.token2.contractAddress,
          id: tokenPair.token2.fa2TokenId ?? undefined
        };
        if (!oldAsset || !isAssetEqual(toAsset, oldAsset)) {
          const tempDex = await findDex(tezos, FACTORIES[NETWORK_ID], toAsset);
          if (tempDex !== dex) {
            setDex(tempDex);
          }
          setOldAsset(toAsset);
        }
      }
    } catch (_) {
      // nothing to do
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

  const errorInterceptor = (value: Undefined<string>): Undefined<string> => {
    if (isFormError !== Boolean(value)) {
      setIsFormError(Boolean(value));
    }

    return value;
  };

  const isVetoUnavailable = !currentCandidate && currentTab.id === VotingTabs.veto;
  const isBackerChooseRequired = !isBakerChoosen && currentTab.id === VotingTabs.vote;
  const isBackerBanned = currentTab.id === VotingTabs.vote && isBanned;

  const isVoteOrVetoButtonDisabled = () =>
    !values.balance1 || isBackerBanned || isFormError || isBackerChooseRequired || isVetoUnavailable;

  const validateBalance_ =
    accountPkh && availableBalance ? validateBalance(new BigNumber(availableBalance)) : () => undefined;

  const validate = composeValidators(validateMinMax(0, Infinity), validateBalance_);

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs values={TabsContent} activeId={votingTab} setActiveId={handleSetActiveId} className={s.tabs} />
          ),
          className: s.header
        }}
        contentClassName={s.content}
      >
        <Field name="balance1" validate={validate} parse={v => parseDecimals(v, 0, Infinity, LP_TOKEN_DECIMALS)}>
          {({ input, meta }) => (
            <PositionSelect
              {...input}
              notSelectable1={TEZOS_TOKEN}
              tokenPair={tokenPair}
              setTokenPair={handleTokenPairSelectChange}
              balance={availableBalance}
              handleBalance={value => {
                form.mutators.setValue('balance1', toSixDecimals(value));
              }}
              tokensUpdating={tokensUpdating}
              shouldShowBalanceButtons={Boolean(accountPkh)}
              balanceLabel={t('voting|Available balance')}
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
                className={s.mt24}
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
          {accountPkh && <UnvoteButton className={s.button} />}
          {accountPkh ? (
            <Button onClick={handleVoteOrVeto} className={s.button} disabled={isVoteOrVetoButtonDisabled()}>
              {currentTab.id === VotingTabs.vote && isBanned ? t('voting|Baker under Veto') : currentTab.label}
            </Button>
          ) : (
            <ConnectWalletButton className={cx(s.connect, s['mt-24'])} />
          )}
        </div>
      </Card>
    </>
  );
};

// eslint-disable-next-line
export const VotingForm = (props: any) => <FormSpy {...props} subscription={{ values: true }} component={RealForm} />;
