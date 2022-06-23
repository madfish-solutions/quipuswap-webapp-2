import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { AlarmMessage, Button, ConnectWalletOrDoSomething, Iterator, Switcher, Tooltip } from '@shared/components';
import { isNull } from '@shared/helpers';
import { Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { StableTokenInput } from '../../stable-token-input';
import styles from '../forms.module.scss';
import { useAddLiqFormViewModel } from './use-add-liq-form.vm';

export const AddLiqForm: FC = observer(() => {
  const { t } = useTranslation();

  const addLiqFormViewModel = useAddLiqFormViewModel();

  if (isNull(addLiqFormViewModel)) {
    return null;
  }

  const {
    data,
    disabled,
    isSubmitting,
    tooltip,
    switcherValue,
    shouldShowZeroInputsAlert,
    handleSwitcherClick,
    handleSubmit
  } = addLiqFormViewModel;

  return (
    <form onSubmit={handleSubmit}>
      <Iterator render={StableTokenInput} data={data} separator={<Plus className={styles.svg} />} />
      <div className={cx(styles.switcherContainer, styles.switcherWhitelistedOnly)}>
        <Switcher value={switcherValue} onClick={handleSwitcherClick} />
        <span className={styles.switcherTranslation}>{t('stableswap|balancedProportionAdd')}</span>
        <Tooltip content={tooltip} />
      </div>
      {shouldShowZeroInputsAlert && (
        <AlarmMessage message={t('stableswap|allZeroInpupts')} className={styles.alarmMessage} />
      )}
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
    </form>
  );
});
