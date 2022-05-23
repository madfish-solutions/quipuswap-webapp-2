import { FC } from 'react';

import cx from 'classnames';

import { DEFAULT_TOKEN } from '@config/tokens';
import { TokenInput, Switcher, Tooltip, ConnectWalletOrDoSomething, Button } from '@shared/components';
import { noopMap } from '@shared/mapping';
import { ArrowDown, Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from '../forms.module.scss';

export const RemoveLiqForm: FC = () => {
  const { t } = useTranslation();

  const inputAmount = '100000';
  const userTokenBalance = '100000';
  const outputLabel = t('common|Output');
  const inputLabel = t('common|Input');
  const disabled = false;
  const isSubmitting = false;

  const handleInputAmountChange = noopMap;

  return (
    <>
      <TokenInput
        id="stableswap-input"
        label={inputLabel}
        value={inputAmount}
        balance={userTokenBalance}
        tokens={DEFAULT_TOKEN}
        onInputChange={handleInputAmountChange}
      />
      <ArrowDown className={styles.svg} />
      <TokenInput
        id="stableswap-input"
        label={outputLabel}
        value={inputAmount}
        balance={userTokenBalance}
        tokens={DEFAULT_TOKEN}
        onInputChange={handleInputAmountChange}
      />
      <Plus className={styles.svg} />
      <TokenInput
        id="stableswap-input"
        label={outputLabel}
        value={inputAmount}
        balance={userTokenBalance}
        tokens={DEFAULT_TOKEN}
        onInputChange={handleInputAmountChange}
      />
      <Plus className={styles.svg} />
      <TokenInput
        id="stableswap-input"
        label={outputLabel}
        value={inputAmount}
        balance={userTokenBalance}
        tokens={DEFAULT_TOKEN}
        onInputChange={handleInputAmountChange}
      />
      <Plus className={styles.svg} />
      <TokenInput
        id="stableswap-input"
        label={outputLabel}
        value={inputAmount}
        balance={userTokenBalance}
        tokens={DEFAULT_TOKEN}
        onInputChange={handleInputAmountChange}
      />
      <div className={cx(styles.switcherContainer, styles.switcherWhitelistedOnly)}>
        <Switcher value={true} onClick={handleInputAmountChange} />
        <span className={styles.switcherTranslation}>{t('stableswap|balancedProportionRemove')}</span>
        <Tooltip content={outputLabel} />
      </div>
      <div className={stylesCommonContainer.buttons}>
        <ConnectWalletOrDoSomething>
          <Button
            type="submit"
            className={stylesCommonContainer.button}
            disabled={disabled}
            loading={isSubmitting}
            data-test-id="stableswapButton"
          >
            {t('common|Remove')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </>
  );
};
