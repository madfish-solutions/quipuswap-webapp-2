import { FC, ReactNode, useState } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { Button, Card, ConnectWalletOrDoSomething, PendingRewards } from '@shared/components';
import { isNull } from '@shared/helpers';
import { ArrowSign } from '@shared/svg';
import { Nullable } from '@shared/types';
import { useTranslation } from '@translation';

import styles from './reward-info.module.scss';

interface Props {
  claimablePendingRewards: Nullable<BigNumber>;
  totalPendingRewards?: Nullable<BigNumber>;
  dollarEquivalent?: Nullable<BigNumber.Value>;
  amountDecimals?: number;
  className?: string;
  currency: string;
  onButtonClick: () => void;
  buttonText: string;
  header?: {
    content: ReactNode;
    button?: ReactNode;
    className?: string;
  };
  rewardTooltip?: string;
  disabled?: boolean;
  buttonUp?: boolean;
  details?: ReactNode;
  rewardButtonAttributeTestId: string;
  pendingRewardAttributeTestId: string;
}

const ZERO_REWARDS = 0;

export const RewardInfo: FC<Props> = ({
  dollarEquivalent,
  amountDecimals,
  className,
  onButtonClick,
  currency,
  header,
  buttonText,
  disabled,
  claimablePendingRewards,
  totalPendingRewards,
  buttonUp,
  details,
  rewardButtonAttributeTestId,
  pendingRewardAttributeTestId,
  children
}) => {
  const { t } = useTranslation();
  const [toggles, setToggles] = useState(false);

  const isButtonDisabled = isNull(claimablePendingRewards) || claimablePendingRewards.eq(ZERO_REWARDS) || disabled;

  const childrenContainerClassName = cx(styles.childrenContainer, {
    [styles.order2]: buttonUp
  });

  const buttonContainerClassName = cx(styles.buttonContainer, {
    [styles.order1]: buttonUp
  });

  const containerClassName = cx(styles.container, {
    [styles.pb0]: toggles
  });

  return (
    <Card
      className={cx(styles.card, className)}
      contentClassName={styles.p0}
      header={header}
      footer={toggles && details}
    >
      <div className={containerClassName}>
        <PendingRewards
          claimablePendingRewards={claimablePendingRewards}
          totalPendingRewards={totalPendingRewards}
          dollarEquivalent={dollarEquivalent}
          testId={pendingRewardAttributeTestId}
          amountDecimals={amountDecimals}
          currency={currency}
        />
        <div className={styles.userInfoContainer}>
          {children && <div className={childrenContainerClassName}>{children}</div>}
          <div className={buttonContainerClassName}>
            <ConnectWalletOrDoSomething>
              <Button
                testId={rewardButtonAttributeTestId}
                className={styles.button}
                onClick={onButtonClick}
                disabled={isButtonDisabled}
              >
                {buttonText}
              </Button>
            </ConnectWalletOrDoSomething>
          </div>

          {details && (
            <Button
              className={cx(styles.order3, styles.viewDetailsButton)}
              theme="inverse"
              icon={<ArrowSign rotate={toggles} />}
              onClick={() => setToggles(!toggles)}
            >
              {toggles ? t('common|lessDetails') : t('common|viewDetails')}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
