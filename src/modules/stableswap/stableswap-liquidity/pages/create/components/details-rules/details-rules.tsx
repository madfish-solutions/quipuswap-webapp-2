import { useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Card } from '@shared/components';
import { useTranslation } from '@translation';

import styles from './details-rules.module.scss';
import { useDetailsRulesViewModel } from './use-details-rules.vm';
import { DetailsRulesItem } from '../details-rules-item';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const DetailsRules = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation();
  const { itemsProps } = useDetailsRulesViewModel();

  return (
    <Card
      header={{
        content: t('stableswap|creationRules')
      }}
      className={modeClass[colorThemeMode]}
      contentClassName={styles.content}
      data-test-id="stableswapDetails"
    >
      <div>{t('stableswap|youMayCreatePool')}</div>

      <h4 className={styles.rules}>{t('stableswap|rules')}</h4>

      <ol className={styles.orderedList}>
        {itemsProps.map(itemProps => (
          <DetailsRulesItem key={itemProps.index} {...itemProps} />
        ))}
      </ol>
    </Card>
  );
};
