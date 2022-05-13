import { FC } from 'react';

import { TokenInput, ConnectWalletOrDoSomething, Button, Iterator } from '@shared/components';
import { ArrowDown, Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from '../stableswap-form-tabs-card.module.scss';
import { useRemoveLiqFormViewModel } from './use-remove-liq-form.vm';

export const RemoveLiqForm: FC = () => {
  const { t } = useTranslation();

  const { data, lpValue, lpError, lpToken, labelOutput, handleLpInputChange, handleSubmit } =
    useRemoveLiqFormViewModel();

  const userTokenBalance = '100000';
  const stakedTokenDecimals = 8;
  const disabled = false;
  const isSubmitting = false;

  return (
    <form onSubmit={handleSubmit}>
      <TokenInput
        id="stableswap-input"
        label={labelOutput}
        value={lpValue}
        balance={userTokenBalance}
        decimals={stakedTokenDecimals}
        tokenA={lpToken}
        error={lpError}
        onInputChange={handleLpInputChange}
      />

      <ArrowDown className={styles.svg} />

      <Iterator render={TokenInput} data={data} separator={<Plus className={styles.svg} />} />

      {/* <div className={cx(styles.switcherContainer, styles.switcherWhitelistedOnly)}>
        <Switcher value={true} onClick={handleInputAmountChange} />
        <span className={styles.switcherTranslation}>{t('stableswap|Remove all coins in a balanced proportion')}</span>
        <Tooltip content={labelOutput} />
      </div> */}

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
    </form>
  );
};
