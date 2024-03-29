import { FormHeader } from '@modules/liquidity/components';
import { Card, SettingsButton } from '@shared/components';
import { CFC } from '@shared/types';
import CommonContainerStyles from '@styles/CommonContainer.module.scss';

import styles from './position-form-card.module.scss';
import { TokensOrderSwitcher } from '../tokens-order-switcher';

interface PositionFormCardProps {
  backHref: string;
}

export const PositionFormCard: CFC<PositionFormCardProps> = ({ children, backHref }) => (
  <Card
    subheader={{
      content: <FormHeader className={styles.formHeader} href={backHref} />,
      className: CommonContainerStyles.header,
      button: (
        <div className={styles.buttons}>
          <TokensOrderSwitcher />
          <SettingsButton colored />
        </div>
      )
    }}
    contentClassName={CommonContainerStyles.content}
    data-test-id="positionFormCard"
  >
    {children}
  </Card>
);
