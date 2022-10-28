import { FormHeader } from '@modules/liquidity/components';
import { Card, SettingsButton } from '@shared/components';
import { CFC } from '@shared/types';
import CommonContainerStyles from '@styles/CommonContainer.module.scss';

import styles from './liquidity-card.module.scss';

export const LiquidityCard: CFC = ({ children }) => {
  return (
    <Card
      subheader={{
        content: <FormHeader className={styles.formHeader} />,
        button: <SettingsButton colored />,
        className: CommonContainerStyles.header
      }}
      contentClassName={CommonContainerStyles.content}
      data-test-id="newLiquidityFormCard"
    >
      {children}
    </Card>
  );
};
