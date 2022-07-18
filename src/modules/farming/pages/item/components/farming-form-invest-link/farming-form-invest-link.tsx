import { observer } from 'mobx-react-lite';

import { Button } from '@shared/components';
import { isExist, isNull } from '@shared/helpers';
import styles from '@styles/CommonContainer.module.scss';
import { i18n } from '@translation';

import { useFarmingFormInvestLinkViewModel } from './farming-form-invest-link.vm';

export const FarmingFormInvestLink = observer(() => {
  const { investHref, tradeHref } = useFarmingFormInvestLinkViewModel();

  if (isNull(investHref) && isNull(tradeHref)) {
    return null;
  }

  return (
    <div className={styles.suggestedOperationsButtons}>
      {isExist(tradeHref) && (
        <Button theme="underlined" href={tradeHref} data-test-id="tradeButton">
          {i18n.t('common|Trade')}
        </Button>
      )}
      {isExist(investHref) && (
        <Button theme="underlined" href={investHref} data-test-id="investButton">
          {i18n.t('common|Invest')}
        </Button>
      )}
    </div>
  );
});
