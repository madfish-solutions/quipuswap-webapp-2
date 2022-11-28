import { TEZOS_TOKEN } from '@config/tokens';
import { Button, Card, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { CommonFormHeader } from '../common-form-header';
import { RangeInput } from '../range-input';
import styles from './common-form.module.scss';

const disabled = false;
const isSubmitting = false;

export const CommonForm = () => {
  const { t } = useTranslation();

  return (
    <Card
      contentClassName={styles.container}
      header={{ content: <CommonFormHeader href="/liquidity" />, className: styles.header }}
    >
      <h3>{t('common|Create')}</h3>
      <RangeInput
        minPrice={0}
        maxPrice={0}
        minPriceChange={function (value: number): void {
          throw new Error();
        }}
        maxPriceChange={function (value: number): void {
          throw new Error();
        }}
        tokens={[TEZOS_TOKEN, TEZOS_TOKEN]}
      />
      <TokenInput
        value={null}
        label={''}
        onInputChange={function (value: string): void {
          throw new Error();
        }}
        tokens={TEZOS_TOKEN}
      />
      <TokenInput
        value={null}
        label={''}
        onInputChange={function (value: string): void {
          throw new Error();
        }}
        tokens={TEZOS_TOKEN}
      />
      <div className={stylesCommonContainer.buttons}>
        <ConnectWalletOrDoSomething>
          <Button
            type="submit"
            className={stylesCommonContainer.button}
            disabled={disabled}
            loading={isSubmitting}
            data-test-id="stableswapButton"
          >
            {t('common|Add')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </Card>
  );
};
