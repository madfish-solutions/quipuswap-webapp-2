import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Button, ComplexBaker, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import { isExist, isNull } from '@shared/helpers';
import styles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { FarmingAlert } from '../../farming-alert';
import { useStakeFormViewModel } from './use-stake-form.vm';

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
    stakedTokenDecimals,
    bakerError,
    farmStatusError,
    disabled,
    handleBakerChange,
    tradeHref,
    investHref,
    handleInputAmountChange
  } = useStakeFormViewModel();

  if (!farmingItem) {
    return null;
  }

  const tokens = [farmingItem.tokenA, farmingItem.tokenB].filter(isExist);

  return (
    <form onSubmit={handleSubmit}>
      <TokenInput
        id="stake-form"
        label={t('common|Amount')}
        value={inputAmount}
        balance={userTokenBalance}
        decimals={stakedTokenDecimals}
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
      <div className={styles.suggestedOperationsButtons}>
        <Button theme="underlined" href={tradeHref} data-test-id="tradeButton">
          {t('common|Trade')}
        </Button>
        {!isNull(investHref) && (
          <Button theme="underlined" href={investHref}>
            {t('common|Invest')}
          </Button>
        )}
      </div>
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
