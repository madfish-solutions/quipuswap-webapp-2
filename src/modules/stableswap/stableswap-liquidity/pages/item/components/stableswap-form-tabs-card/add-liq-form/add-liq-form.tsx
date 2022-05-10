import { FC } from 'react';

import cx from 'classnames';

import { DEFAULT_TOKEN } from '@config/tokens';
import { Button, ConnectWalletOrDoSomething, Switcher, TokenInput, Tooltip } from '@shared/components';
import { noopMap } from '@shared/mapping';
import { Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from '../stableswap-form-tabs-card.module.scss';

export const AddLiqForm: FC = () => {
  const { t } = useTranslation();

  const inputAmount = '100000';
  const userTokenBalance = '100000';
  const stakedTokenDecimals = 8;
  const label = t('common|Input');
  const disabled = false;
  const isSubmitting = false;

  const handleInputAmountChange = noopMap;

  return (
    <>
      <TokenInput
        id="stableswap-input"
        label={label}
        value={inputAmount}
        balance={userTokenBalance}
        decimals={stakedTokenDecimals}
        tokenA={DEFAULT_TOKEN}
        onInputChange={handleInputAmountChange}
      />
      <Plus className={styles.svg} />
      <TokenInput
        id="stableswap-input"
        label={label}
        value={inputAmount}
        balance={userTokenBalance}
        decimals={stakedTokenDecimals}
        tokenA={DEFAULT_TOKEN}
        onInputChange={handleInputAmountChange}
      />
      <Plus className={styles.svg} />
      <TokenInput
        id="stableswap-input"
        label={label}
        value={inputAmount}
        balance={userTokenBalance}
        decimals={stakedTokenDecimals}
        tokenA={DEFAULT_TOKEN}
        onInputChange={handleInputAmountChange}
      />
      <Plus className={styles.svg} />
      <TokenInput
        id="stableswap-input"
        label={label}
        value={inputAmount}
        balance={userTokenBalance}
        decimals={stakedTokenDecimals}
        tokenA={DEFAULT_TOKEN}
        onInputChange={handleInputAmountChange}
      />
      <div className={cx(styles.switcherContainer, styles.switcherWhitelistedOnly)}>
        <Switcher value={true} onClick={handleInputAmountChange} />
        <span className={styles.switcherTranslation}>{t('stableswap|Add all coins in a balanced proportion')}</span>
        <Tooltip content={label} />
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
            {t('common|Add')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </>
  );
};
