import { FormHeader } from '@modules/new-liquidity/components';
import { Card, SettingsButton } from '@shared/components';
import { CFC } from '@shared/types';
import CommonContainerStyles from '@styles/CommonContainer.module.scss';

import styles from './new-liquidity-card.module.scss';

export const NewLiquidityCard: CFC = ({ children }) => {
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
