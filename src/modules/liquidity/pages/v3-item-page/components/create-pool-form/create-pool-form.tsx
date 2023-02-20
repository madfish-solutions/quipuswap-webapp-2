import { AppRootRoutes } from '@app.router';
import {
  AlarmMessage,
  Button,
  Card,
  CardHeaderWithBackButton,
  ConnectWalletOrDoSomething,
  Iterator,
  RadioButton,
  TokenInput
} from '@shared/components';
import { TokenSelect } from '@shared/components/token-select';
import { WarningAlert } from '@shared/components/warning-alert';
import { isExist } from '@shared/helpers';
import { Plus } from '@shared/svg';
import commonStyles from '@styles/CommonContainer.module.scss';

import { LiquidityPoolExist } from '../../../../components';
import styles from './create-pool-form.module.scss';
import { useCreatePoolFormViewModel } from './create-pool-form.vm';

export const CreatePoolForm = () => {
  const {
    alarmMessageInfo,
    translation,
    tokensSelectData,
    quoteToken,
    radioButtonParams,
    disabled,
    isSubmitting,
    initialPriceLabel,
    initialPriceValue,
    initialPriceError,
    setInitialPriceValue,
    onSubmit,
    warningMessage,
    errorMessage,
    tokensSwitcher
  } = useCreatePoolFormViewModel();

  const { create, feeRates } = translation;
  const { poolExists, poolLink } = alarmMessageInfo;

  return (
    <Card
      contentClassName={styles.content}
      header={{
        content: <CardHeaderWithBackButton backHref={AppRootRoutes.Liquidity} />,
        button: tokensSwitcher
      }}
    >
      <form className={styles.form} onSubmit={onSubmit}>
        <div>
          <Iterator render={TokenSelect} data={tokensSelectData} separator={<Plus className={styles.svg} />} />
        </div>

        <TokenInput
          value={initialPriceValue}
          label={initialPriceLabel}
          hiddenPercentSelector
          hiddenBalance
          tokens={quoteToken}
          error={initialPriceError}
          onInputChange={setInitialPriceValue}
        />

        {poolExists && (
          <AlarmMessage>
            <LiquidityPoolExist className={styles.poolExistWarning} existingPoolLink={poolLink} />
          </AlarmMessage>
        )}

        <h3>{feeRates}</h3>
        <RadioButton {...radioButtonParams} />
        <WarningAlert message={warningMessage} />
        {isExist(errorMessage) && <AlarmMessage message={errorMessage} />}
        <div className={commonStyles.buttons}>
          <ConnectWalletOrDoSomething>
            <Button
              type="submit"
              className={commonStyles.button}
              disabled={disabled}
              loading={isSubmitting}
              data-test-id="create-v3-pool-button"
            >
              {create}
            </Button>
          </ConnectWalletOrDoSomething>
        </div>
      </form>
    </Card>
  );
};
