import { Button, Card, ConnectWalletOrDoSomething, Iterator, RadioButton, TokenInput } from '@shared/components';
import { TokenSelect } from '@shared/components/token-select';
import { WarningAlert } from '@shared/components/warning-alert';
import { Plus } from '@shared/svg';
import commonStyles from '@styles/CommonContainer.module.scss';

import styles from './create-pool-form.module.scss';
import { useCreatePoolFormViewModel } from './create-pool-form.vm';

export const CreatePoolForm = () => {
  const {
    translation,
    tokensSelectData,
    tokens,
    radioButtonParams,
    disabled,
    isSubmitting,
    initialPriceValue,
    initialPriceError,
    setInitialPriceValue,
    onSubmit,
    warningMessage
  } = useCreatePoolFormViewModel();

  const { create, initialPrice, feeRates } = translation;

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

        <h3>{feeRates}</h3>
        <RadioButton {...radioButtonParams} />
        <WarningAlert message={warningMessage} />
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
