import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { ConnectWalletOrDoSomething, Button, Iterator, Switcher, Tooltip } from '@shared/components';
import { isNull } from '@shared/helpers';
import { ArrowDown, Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { StableLpInput } from '../../stable-lp-input';
import { StableTokenInput } from '../../stable-token-input';
import styles from '../forms.module.scss';
import { useRemoveLiqFormViewModel } from './use-remove-liq-form.vm';

export const RemoveLiqForm: FC = observer(() => {
  const { t } = useTranslation();

  const removeLiqFormViewModel = useRemoveLiqFormViewModel();

  if (isNull(removeLiqFormViewModel)) {
    return null;
  }

  const {
    data,
    formik,
    lpBalance,
    isLpInputDisabled,
    labelInput,
    tooltip,
    switcherValue,
    handleSwitcherClick,
    handleSubmit,
    handleLpInputChange
  } = removeLiqFormViewModel;

  const disabled = false;
  const isSubmitting = false;

  return (
    <form onSubmit={handleSubmit}>
      <StableLpInput
        disabled={isLpInputDisabled}
        formik={formik}
        label={labelInput}
        balance={lpBalance}
        onInputChange={handleLpInputChange}
      />

      <ArrowDown className={styles.svg} />

      <Iterator render={StableTokenInput} data={data} separator={<Plus className={styles.svg} />} />

      <div className={cx(styles.switcherContainer, styles.switcherWhitelistedOnly)}>
        <Switcher value={switcherValue} onClick={handleSwitcherClick} />
        <span className={styles.switcherTranslation}>{t('stableswap|balancedProportionRemove')}</span>
        <Tooltip content={tooltip} />
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
});
