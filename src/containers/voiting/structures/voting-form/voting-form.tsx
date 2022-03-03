import { useState, useEffect } from 'react';

import { Token, findDex } from '@quipuswap/sdk';
import { Card, Tabs } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { FormApi } from 'final-form';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy } from 'react-final-form';

import { FACTORIES, LP_TOKEN_DECIMALS, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { ComplexBaker } from '@components/ui/ComplexInput';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { Button } from '@components/ui/elements/button';
import { UnvoteButton } from '@containers/voiting/components';
import { getCandidateInfo, BakerCleaner } from '@containers/voiting/helpers';
import {
  useAvailableBalances,
  useTokensLoading,
  useTokensPair,
  useVotingDex,
  useVotingHandlers,
  useVotingRouting,
  useVotingTokens
} from '@containers/voiting/helpers/voting.provider';
import { TabsContent } from '@containers/voiting/hooks';
import { VotingTabs } from '@containers/voiting/tabs.enum';
import { useGlobalModalsState } from '@hooks/use-global-modals-state';
import s from '@styles/CommonContainer.module.sass';
import { useTezos, useAccountPkh, useBakers } from '@utils/dapp';
import { isAssetEqual, parseDecimals } from '@utils/helpers';
import { tokenDataToToken } from '@utils/helpers/tokenDataToToken';
import { VoteFormValues, Undefined } from '@utils/types';
import { required, validateMinMax, validateBalance, composeValidators } from '@utils/validators';

interface VotingFormProps {
  values: VoteFormValues;
  form: FormApi<VoteFormValues, Partial<VoteFormValues>>;
  handleSubmit: () => Promise<void>;
  bakerCleaner: BakerCleaner;
}

const KEY_IS_BAKER_CHOSEN_TO_FALSE = 'isBakerChosenToFalse';
const toSixDecimals = (value: string) => new BigNumber(value).decimalPlaces(TEZOS_TOKEN.metadata.decimals).toNumber();

const RealForm: React.FC<VotingFormProps> = ({
  handleSubmit,
  values,
  form,
  bakerCleaner
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

  useEffect(() => bakerCleaner.set(KEY_IS_BAKER_CHOSEN_TO_FALSE, () => setIsBakerChoosen(false)), [bakerCleaner]);

  const handleInputChange = async () => {
    if (!tezos) {
      return;
    }
    const currentTokenA = tokenDataToToken(token1);
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
          {accountPkh && <UnvoteButton className={s.button} />}
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

// eslint-disable-next-line
export const VotingForm = (props: any) => <FormSpy {...props} subscription={{ values: true }} component={RealForm} />;
