import { useState, useEffect } from 'react';

import { Card, Tabs } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { FormApi } from 'final-form';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy } from 'react-final-form';

import { LP_TOKEN_DECIMALS, TEZOS_TOKEN } from '@app.config';
import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { ComplexBaker } from '@components/ui/ComplexInput';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Button } from '@components/ui/elements/button';
import { UnstakeButton } from '@containers/stake/item/components/unstake-button';
import { getCandidateInfo, BakerCleaner } from '@containers/stake/item/helpers';
import {
  useAvailableBalances,
  useStakingId,
  useStakingLoading,
  useStakingRouting,
  useTokenOrPair
} from '@containers/stake/item/helpers/staking.provider';
import { TabsContent } from '@containers/stake/item/hooks';
import { StakingTabs } from '@containers/stake/item/types';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import s from '@styles/CommonContainer.module.sass';
import { useTezos, useAccountPkh, useBakers } from '@utils/dapp';
import { parseDecimals } from '@utils/helpers';
import { StakeFormValues, Undefined } from '@utils/types';
import { required, validateMinMax, validateBalance, composeValidators } from '@utils/validators';

interface StakingFormProps {
  values: StakeFormValues;
  form: FormApi<StakeFormValues, Partial<StakeFormValues>>;
  handleSubmit: () => Promise<void>;
  bakerCleaner: BakerCleaner;
}

const KEY_IS_BAKER_CHOSEN_TO_FALSE = 'isBakerChosenToFalse';
const toSixDecimals = (value: string) => new BigNumber(value).decimalPlaces(TEZOS_TOKEN.metadata.decimals).toNumber();

const RealForm: React.FC<StakingFormProps> = ({
  handleSubmit,
  values,
  form,
  bakerCleaner
  // eslint-disable-next-line
}) => {
  const { t } = useTranslation(['common', 'stake']);
  const { connectWalletModalOpen, closeConnectWalletModal } = useConnectModalsState();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const [isBakerChoosen, setIsBakerChoosen] = useState(false);

  const { data: bakers } = useBakers();

  const stakingId = useStakingId();
  const { currentCandidate } = stakingId ? getCandidateInfo(stakingId, bakers) : { currentCandidate: null };
  const tokenOrPair = useTokenOrPair();
  const { stakingTab, handleSetActiveId, currentTab } = useStakingRouting();
  const { availableBalance } = useAvailableBalances();
  const stakingLoading = useStakingLoading();

  useEffect(() => bakerCleaner.set(KEY_IS_BAKER_CHOSEN_TO_FALSE, () => setIsBakerChoosen(false)), [bakerCleaner]);

  useEffect(() => {
    form.mutators.setValue('balance1', form.getFieldState('balance1')!.value);
    // eslint-disable-next-line
  }, [currentTab]);

  useEffect(() => {
    if (connectWalletModalOpen && accountPkh) {
      closeConnectWalletModal();
    }
    // eslint-disable-next-line
  }, [accountPkh, closeConnectWalletModal]);

  const handleStakeOrUnstake = async () => {
    if (!tezos || !stakingId || !values.balance1) {
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

  const isUnstakeUnavailable = !currentCandidate && currentTab.id === StakingTabs.unstake;
  const isBackerChooseRequired = !isBakerChoosen && currentTab.id === StakingTabs.stake;
  const isBackerBanned = currentTab.id === StakingTabs.stake;

  const isStakeOrUnstakeButtonDisabled = () =>
    !values.balance1 || isBackerBanned || isFormError || isBackerChooseRequired || isUnstakeUnavailable;

  const validateBalance_ =
    accountPkh && availableBalance ? validateBalance(new BigNumber(availableBalance)) : () => undefined;

  const validate = composeValidators(validateMinMax(0, Infinity), validateBalance_);

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs values={TabsContent} activeId={stakingTab} setActiveId={handleSetActiveId} className={s.tabs} />
          ),
          className: s.header
        }}
        contentClassName={s.content}
      >
        <Field name="balance1" validate={validate} parse={v => parseDecimals(v, 0, Infinity, LP_TOKEN_DECIMALS)}>
          {({ input, meta }) =>
            'token2' in tokenOrPair ? (
              <PositionSelect
                {...input}
                notSelectable1={TEZOS_TOKEN}
                tokenPair={tokenOrPair}
                tokenPairFrozen={true}
                balance={availableBalance}
                handleBalance={value => {
                  form.mutators.setValue('balance1', toSixDecimals(value));
                }}
                /* eslint-disable-next-line @typescript-eslint/no-empty-function */
                tokensUpdating={{ isTokenChanging: stakingLoading.isStakingLoading, setIsTokenChanging: () => {} }}
                shouldShowBalanceButtons={Boolean(accountPkh)}
                balanceLabel={t('stake|Available balance')}
                notFrozen
                id="liquidity-remove-input"
                label={currentTab.label}
                className={s.input}
                error={errorInterceptor((meta.dirty && meta.error) || meta.submitError)}
              />
            ) : (
              <TokenSelect
                balance={availableBalance ?? null}
                label="Amount"
                /* eslint-disable-next-line @typescript-eslint/no-empty-function */
                handleBalance={() => {}}
                token={tokenOrPair.token}
                blackListedTokens={[]}
              />
            )
          }
        </Field>
        {currentTab.id === StakingTabs.stake && (
          <Field name="selectedBaker" validate={required}>
            {({ input, meta }) => (
              <ComplexBaker
                {...input}
                label="Baker"
                id="staking-baker"
                className={s.mt24}
                cleanBaker={bakerCleaner}
                handleChange={bakerObj => {
                  input.onChange(bakerObj.address);
                  const asyncisBanned = async () => {
                    if (!stakingId) {
                      return;
                    }

                    if (!isBakerChoosen) {
                      setIsBakerChoosen(true);
                    }
                  };
                  void asyncisBanned();
                }}
                error={(meta.touched && meta.error) || meta.submitError}
              />
            )}
          </Field>
        )}
        <div className={s.buttons}>
          {accountPkh && stakingTab === StakingTabs.unstake && <UnstakeButton className={s.button} />}
          {accountPkh && stakingTab === StakingTabs.stake && (
            <Button onClick={handleStakeOrUnstake} className={s.button} disabled={isStakeOrUnstakeButtonDisabled()}>
              {currentTab.label}
            </Button>
          )}
          {!accountPkh && <ConnectWalletButton className={cx(s.connect, s['mt-24'])} />}
        </div>
      </Card>
    </>
  );
};

// eslint-disable-next-line
export const StakingForm = (props: any) => <FormSpy {...props} subscription={{ values: true }} component={RealForm} />;
