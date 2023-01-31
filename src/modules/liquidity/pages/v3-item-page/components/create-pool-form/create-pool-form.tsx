import {
  AlarmMessage,
  Button,
  Card,
  ConnectWalletOrDoSomething,
  Iterator,
  RadioButton,
  TokenInput
} from '@shared/components';
import { TokenSelect } from '@shared/components/token-select';
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
    tokens,
    radioButtonParams,
    disabled,
    isSubmitting,
    initialPriceValue,
    initialPriceError,
    setInitialPriceValue,
    onSubmit
  } = useCreatePoolFormViewModel();

  const { create, initialPrice, feeRates } = translation;
  const { poolExists, poolLink } = alarmMessageInfo;

  return (
    <Card contentClassName={styles.content}>
      <form className={styles.form} onSubmit={onSubmit}>
        <div>
          <Iterator render={TokenSelect} data={tokensSelectData} separator={<Plus className={styles.svg} />} />
        </div>

        <TokenInput
          value={initialPriceValue}
          label={initialPrice}
          hiddenPercentSelector
          hiddenBalance
          tokens={tokens}
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
