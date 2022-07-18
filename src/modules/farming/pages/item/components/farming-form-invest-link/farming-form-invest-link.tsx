import { observer } from 'mobx-react-lite';

import { Button } from '@shared/components';
import { isNull } from '@shared/helpers';
import styles from '@styles/CommonContainer.module.scss';
import { i18n } from '@translation';

import { useFarmingFormInvestLinkViewModel } from './farming-form-invest-link.vm';

export const FarmingFormInvestLink = observer(() => {
  const { investHref } = useFarmingFormInvestLinkViewModel();

  if (isNull(investHref)) {
    return null;
  }

  return (
    <div className={styles.suggestedOperationsButtons}>
      <Button theme="underlined" href={investHref} data-test-id="investButton">
        {i18n.t('common|Invest')}
      </Button>
    </div>
  );
});
