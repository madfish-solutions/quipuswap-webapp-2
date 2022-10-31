import { FC } from 'react';

import { Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { Button } from '../button';
import { ComplexBaker, ComplexBakerProps } from '../ComplexInput';
import { ConnectWalletOrDoSomething } from '../connect-wallet-or-do-something';
import { Iterator } from '../iterator';
import { TokenInput, TokenInputProps } from '../token-input';
import { WarningAlert } from '../warning-alert';
import styles from './dex-two-add-liq-form-view.module.scss';

interface BakerProps extends ComplexBakerProps {
  shouldShowBakerInput: boolean;
}

interface Props {
  data: TokenInputProps[];
  bakerData: BakerProps;
  onSubmit: () => void;
  isSubmitting?: boolean;
  canMigrateLiquidity?: boolean;
  handleMigrateLiquidity?: () => Promise<void> | void;
  warningMessage: Nullable<string>;
}

export const DexTwoAddLiqFormView: FC<Props> = ({
  data,
  onSubmit,
  bakerData,
  canMigrateLiquidity,
  handleMigrateLiquidity,
  isSubmitting,
  warningMessage
}) => {
  const { t } = useTranslation();

  const { value, error, handleChange, shouldShowBakerInput } = bakerData;

  return (
    <>
      <form onSubmit={onSubmit}>
        <Iterator render={TokenInput} data={data} separator={<Plus className={styles.svg} />} />
        {shouldShowBakerInput && (
          <ComplexBaker
            value={value}
            error={error}
            handleChange={handleChange}
            label={t('common|Baker')}
            className={stylesCommonContainer.mt24}
          />
        )}
        <WarningAlert className={stylesCommonContainer.mt16} message={warningMessage} />
        <div className={stylesCommonContainer.buttons}>
          <ConnectWalletOrDoSomething>
            <Button
              type="submit"
              theme={canMigrateLiquidity ? 'secondary' : 'primary'}
              className={stylesCommonContainer.button}
              disabled={false}
              loading={false}
              data-test-id="dexTwoAddLiqButton"
            >
              {t('common|Add')}
            </Button>
            {canMigrateLiquidity && (
              <Button theme="primary" type="button" loading={isSubmitting} onClick={handleMigrateLiquidity}>
                {t('liquidity|migrate')}
              </Button>
            )}
          </ConnectWalletOrDoSomething>
        </div>
      </form>
    </>
  );
};
