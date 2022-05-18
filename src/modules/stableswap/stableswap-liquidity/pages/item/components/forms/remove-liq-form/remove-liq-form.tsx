import { FC } from 'react';

import cx from 'classnames';

import { TokenInput, ConnectWalletOrDoSomething, Button, Iterator, Switcher, Tooltip } from '@shared/components';
import { noopMap } from '@shared/mapping';
import { ArrowDown, Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from '../forms.module.scss';
import { useRemoveLiqFormViewModel } from './use-remove-liq-form.vm';

export const RemoveLiqForm: FC = () => {
  const { t } = useTranslation();

  const { data, lpBalance, lpInputValue, lpError, lpToken, labelOutput, handleLpInputChange, handleSubmit } =
    useRemoveLiqFormViewModel();

  const stakedTokenDecimals = 8;
  const disabled = false;
  const isSubmitting = false;

  return (
    <form onSubmit={handleSubmit}>
      <TokenInput
        id="stableswap-input"
        label={labelOutput}
        value={lpInputValue}
        balance={lpBalance}
        decimals={stakedTokenDecimals}
        tokenA={lpToken}
        error={lpError}
        onInputChange={handleLpInputChange}
      />

      <ArrowDown className={styles.svg} />

      <Iterator render={TokenInput} data={data} separator={<Plus className={styles.svg} />} />

      <div className={cx(styles.switcherContainer, styles.switcherWhitelistedOnly)}>
        {/* Mock data */}
        <Switcher value={true} disabled={true} onClick={noopMap} />
        <span className={styles.switcherTranslation}>{t('stableswap|balancedProportionRemove')}</span>
        <Tooltip content={labelOutput} />
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
    </form>
  );
};
