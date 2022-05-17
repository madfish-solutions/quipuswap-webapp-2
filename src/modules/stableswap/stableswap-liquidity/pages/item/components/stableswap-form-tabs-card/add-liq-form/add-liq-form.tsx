import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { Button, ConnectWalletOrDoSomething, Iterator, Switcher, TokenInput, Tooltip } from '@shared/components';
import { noopMap } from '@shared/mapping';
import { Plus } from '@shared/svg';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from '../stableswap-form-tabs-card.module.scss';
import { useAddLiqFormViewModel } from './use-add-liq-form.vm';

export const AddLiqForm: FC = observer(() => {
  const { t } = useTranslation();

  const { disabled, isSubmitting, data, handleSubmit } = useAddLiqFormViewModel();

  return (
    <form onSubmit={handleSubmit}>
      <Iterator render={TokenInput} data={data} separator={<Plus className={styles.svg} />} />
      <div className={cx(styles.switcherContainer, styles.switcherWhitelistedOnly)}>
        {/* Mock data */}
        <Switcher value={true} disabled={true} onClick={noopMap} />
        <span className={styles.switcherTranslation}>{t('stableswap|Add all coins in a balanced proportion')}</span>
        <Tooltip content="Tooltip" />
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
    </form>
  );
});
