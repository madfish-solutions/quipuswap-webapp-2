import { TEZOS_TOKEN } from '@config/tokens';
import { Button, Card, ConnectWalletOrDoSomething, Iterator, TokenInput } from '@shared/components';
import { Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { CommonFormHeader } from '../common-form-header';
import { RangeInput } from '../range-input';
import styles from './common-form.module.scss';

const disabled = false;
const isSubmitting = false;

export const CommonForm = () => {
  const { t } = useTranslation();

  const data = [
    {
      tokens: TEZOS_TOKEN,
      value: '0',
      onInputChange: function (value: string): void {
        throw new Error();
      },
      label: t('common|Input')
    },
    {
      tokens: TEZOS_TOKEN,
      value: '0',
      onInputChange: function (value: string): void {
        throw new Error();
      },
      label: t('common|Input')
    }
  ];

  return (
    <Card
      contentClassName={styles.container}
      header={{ content: <CommonFormHeader href="/liquidity" />, className: styles.header }}
    >
      <h3>{t('common|Create')}</h3>
      <RangeInput
        tokens={[TEZOS_TOKEN, TEZOS_TOKEN]}
        minPrice={'0'}
        maxPrice={'0'}
        minPriceChange={function (value: string): void {
          throw new Error();
        }}
        maxPriceChange={function (value: string): void {
          throw new Error();
        }}
      />
      <Iterator render={TokenInput} data={data} separator={<Plus className={styles.svg} />} />
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
