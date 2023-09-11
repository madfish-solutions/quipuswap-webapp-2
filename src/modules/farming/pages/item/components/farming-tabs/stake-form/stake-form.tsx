import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Button, ComplexBaker, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import styles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { useStakeFormViewModel } from './use-stake-form.vm';
import { FarmingAlert } from '../../farming-alert';
import { FarmingFormInvestLink } from '../../farming-form-invest-link';

export const StakeForm: FC = observer(() => {
  const { t } = useTranslation(['common', 'farm']);
  const {
    bakerInputValue,
    shouldShowBakerInput,
    handleSubmit,
    inputAmount,
    isSubmitting,
    userTokenBalance,
    inputAmountError,
    farmingItem,
    bakerError,
    farmStatusError,
    disabled,
    handleBakerChange,
    handleInputAmountChange
  } = useStakeFormViewModel();

  if (!farmingItem) {
    return null;
  }

  const { tokens } = farmingItem;

  return (
    <form onSubmit={handleSubmit}>
      <TokenInput
        id="stake-form"
        label={t('common|Amount')}
        value={inputAmount}
        balance={userTokenBalance}
        error={inputAmountError}
        tokens={tokens}
        onInputChange={handleInputAmountChange}
      />
      {shouldShowBakerInput && (
        <ComplexBaker
          label={t('common|Baker')}
          className={styles.mt24}
          handleChange={handleBakerChange}
          error={bakerError}
          value={bakerInputValue}
        />
      )}

      <FarmingFormInvestLink />

      <FarmingAlert className={styles.mt16} variant={farmingItem.stakeStatus} errorMessage={farmStatusError} />
      <div className={styles.buttons}>
        <ConnectWalletOrDoSomething>
          <Button
            type="submit"
            className={styles.button}
            disabled={disabled}
            loading={isSubmitting}
            data-test-id="stakeButton"
          >
            {t('farm|Stake')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
});
