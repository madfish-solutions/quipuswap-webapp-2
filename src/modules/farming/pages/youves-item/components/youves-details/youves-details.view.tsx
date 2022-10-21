import { FC } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { eQuipuSwapVideo } from '@config/youtube';
import {
  Button,
  Card,
  DetailsCardCell,
  StateCurrencyAmount,
  StatePercentage,
  LabelComponent,
  Tabs,
  YouTube,
  Iterator,
  LabelComponentProps
} from '@shared/components';
import { Tabs as DetailsTabs } from '@shared/hooks';
import { ExternalLink } from '@shared/svg/external-link';
import { ActiveStatus } from '@shared/types';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { StateData } from '../state-data';
import { TimespanView } from '../timespan-view';
import styles from './youves-details.module.scss';

interface Props {
  labels: Array<LabelComponentProps>;
  tvl: BigNumber;
  tvlDollarEquivalent: BigNumber;
  apr: BigNumber;
  daily: BigNumber;
  dailyDistribution: BigNumber;
  dailyDistributionDollarEquivalent: BigNumber;
  vestingPeriod: number;
  stakeStatus: ActiveStatus;
  shouldShowTags: boolean;
  stakedTokenSymbol: string;
  rewardTokenSymbol: string;
  isLoading: boolean;
  isError: boolean;
  isDetails: boolean;
  tabsContent: Array<{ id: DetailsTabs; label: string }>;
  activeId: DetailsTabs;
  setTabId: (id: string) => void;
  currentStakeId: string;
}

export const YouvesDetailsView: FC<Props> = observer(
  ({
    labels,
    tvl,
    tvlDollarEquivalent,
    apr,
    daily,
    dailyDistribution,
    dailyDistributionDollarEquivalent,
    vestingPeriod,
    stakeStatus,
    shouldShowTags,
    stakedTokenSymbol,
    rewardTokenSymbol,
    isLoading,
    isError,
    isDetails,
    tabsContent,
    activeId,
    setTabId,
    currentStakeId
  }) => {
    const { t } = useTranslation();
    const CardCellClassName = cx(commonContainerStyles.cellCenter, commonContainerStyles.cell, styles.vertical);

    return (
      <Card
        header={{
          content: (
            <Tabs
              tabs={tabsContent}
              activeId={activeId}
              setActiveId={setTabId}
              className={commonContainerStyles.tabs}
            />
          ),
          status: stakeStatus,
          className: commonContainerStyles.header
        }}
        contentClassName={commonContainerStyles.content}
        data-test-id="farmingDetails"
      >
        {isDetails ? (
          <>
            <DetailsCardCell cellName="Stake ID" className={CardCellClassName} data-test-id="stake-id">
              <StateCurrencyAmount amount={currentStakeId} />
            </DetailsCardCell>

            {shouldShowTags && (
              <DetailsCardCell cellName={t('farm|Tags')} className={CardCellClassName} data-test-id="tags">
                <div className={styles.tags}>
                  <Iterator render={LabelComponent} data={labels} />
                </div>
              </DetailsCardCell>
            )}
            <DetailsCardCell
              cellName={t('farm|tvl')}
              className={CardCellClassName}
              tooltipContent={t('farm|valueLockedTooltip')}
              data-test-id="valueLocked"
            >
              <StateCurrencyAmount
                dollarEquivalent={tvlDollarEquivalent}
                currency={stakedTokenSymbol}
                amount={tvl}
                isError={isError}
              />
            </DetailsCardCell>

            <DetailsCardCell
              cellName={t('farm|Daily Distribution')}
              tooltipContent={t('farm|dailyDistributionTooltip')}
              className={CardCellClassName}
              data-test-id="dailyDistribution"
            >
              <StateCurrencyAmount
                dollarEquivalent={dailyDistributionDollarEquivalent}
                currency={rewardTokenSymbol}
                amount={dailyDistribution}
                isError={isError}
              />
            </DetailsCardCell>
            <DetailsCardCell
              cellName={t('farm|APR')}
              tooltipContent={t('farm|aprTooltip')}
              className={CardCellClassName}
              data-test-id="APR"
            >
              <StatePercentage value={apr} isLoading={isLoading} />
            </DetailsCardCell>

            <DetailsCardCell
              cellName={t('farm|dailyApr')}
              tooltipContent={t('farm|dailyAprTooltip')}
              className={CardCellClassName}
              data-test-id="dailyApr"
            >
              <StatePercentage isLoading={isLoading} value={daily} />
            </DetailsCardCell>

            <DetailsCardCell
              cellName={t('farm|Lock Period')}
              tooltipContent={t('farm|lockPeriodTooltip')}
              className={CardCellClassName}
              data-test-id="lockPeriod"
            >
              <StateData isLoading={isLoading} data={vestingPeriod}>
                {value => <TimespanView value={value} />}
              </StateData>
            </DetailsCardCell>

            <div className={cx(commonContainerStyles.detailsButtons, styles.stakeDetailsButtons)}>
              <Button
                className={cx(commonContainerStyles.detailsButton, styles.stakeDetailsButton)}
                theme="inverse"
                href={'/'}
                external
                icon={<ExternalLink className={commonContainerStyles.linkIcon} />}
                data-test-id="tokenContractButton"
              >
                {t('farm|Token Contract')}
              </Button>

              <Button
                className={cx(commonContainerStyles.detailsButton, styles.stakeDetailsButton)}
                theme="inverse"
                href={'/'}
                external
                icon={<ExternalLink className={commonContainerStyles.linkIcon} />}
                data-test-id="farmingContractButton"
              >
                {t('farm|Farming Contract')}
              </Button>
            </div>
          </>
        ) : (
          <YouTube video={eQuipuSwapVideo.HowDoIStartFarmingOnQuipuSwap} />
        )}
      </Card>
    );
  }
);
