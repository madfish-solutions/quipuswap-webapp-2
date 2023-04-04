import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { Button, Card, DetailsCardCell, StatePercentage, LabelComponent } from '@shared/components';
import { ExternalLink } from '@shared/svg';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { TokenLocked } from '../../../components';
import styles from './details.module.scss';
import { useDetailsVievModel } from './use-details.vm';

export const Details: FC = observer(() => {
  const { t } = useTranslation();
  const { tvl, apr, whitelistedTag, farmContractUrl, cardCellClassName, isLoading, dollarEquivalent, tokenSymbol } =
    useDetailsVievModel();

  return (
    <Card
      header={{
        content: t('common|stakeDetails')
      }}
      contentClassName={commonContainerStyles.content}
      data-test-id="stableswapDetails"
    >
      <DetailsCardCell cellName={t('stableswap|Tags')} className={cardCellClassName} data-test-id="tags">
        <div className={styles.tags}>
          {whitelistedTag && (
            <LabelComponent
              label={whitelistedTag?.label}
              status={whitelistedTag?.status}
              data-test-id="timeLockLabel"
            />
          )}
        </div>
      </DetailsCardCell>

      <TokenLocked
        className={cardCellClassName}
        tokenSymbol={tokenSymbol}
        amount={tvl}
        isLoading={isLoading}
        dollarEquivalent={dollarEquivalent}
      />

      <DetailsCardCell
        cellName={t('stableswap|aprSevenDays')}
        className={cardCellClassName}
        data-test-id="apr"
        tooltipContent={t('stableswap|aprSevenDaysTooltip')}
      >
        <StatePercentage isLoading={isLoading} value={apr} />
      </DetailsCardCell>

      <div className={cx(commonContainerStyles.detailsButtons, styles.detailsButtons)}>
        <Button
          className={cx(commonContainerStyles.detailsButton, styles.detailsButton)}
          theme="inverse"
          href={farmContractUrl}
          external
          icon={<ExternalLink className={commonContainerStyles.linkIcon} />}
          data-test-id="stableswapContractButton"
        >
          {t('stableswap|dexContract')}
        </Button>
      </div>
    </Card>
  );
});
