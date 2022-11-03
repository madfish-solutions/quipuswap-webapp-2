import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { eQuipuSwapVideo } from '@config/youtube';
import {
  Button,
  CandidateButton,
  Card,
  DetailsCardCell,
  StateCurrencyAmount,
  StatePercentage,
  LabelComponent,
  Tabs,
  YouTube,
  Iterator
} from '@shared/components';
import { useYoutubeTabs } from '@shared/hooks';
import { ExternalLink } from '@shared/svg/external-link';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { Countdown } from '../countdown';
import { DeprecatedStateData } from '../state-data';
import { TimespanView } from '../timespan-view';
import styles from './farming-details.module.scss';
import { useFarmingDetailsViewModel } from './use-farming-details.vm';

export const FarmingDetails: FC = observer(() => {
  const { t } = useTranslation();
  const { isDetails, tabsContent, activeId, setTabId } = useYoutubeTabs({
    detailsLabel: t('farm|Farming Details'),
    page: t('common|Farming')
  });

  const {
    endTime,
    tvlDollarEquivalent,
    dailyDistribution,
    distributionDollarEquivalent,
    apr,
    dailyApr,
    currentDelegate,
    nextDelegate,
    timelock,
    shouldShowLockPeriod,
    shouldShowWithdrawalFee,
    shouldShowTags,
    CardCellClassName,
    stakeUrl,
    stakedTokenSymbol,
    rewardTokenSymbol,
    tvl,
    withdrawalFee,
    harvestFee,
    depositTokenUrl,
    isLoading,
    isError,
    shouldShowDelegates,
    stakeStatus,
    labels
  } = useFarmingDetailsViewModel();

  return (
    <Card
      header={{
        content: (
          <Tabs tabs={tabsContent} activeId={activeId} setActiveId={setTabId} className={commonContainerStyles.tabs} />
        ),
        status: stakeStatus,
        className: commonContainerStyles.header
      }}
      contentClassName={commonContainerStyles.content}
      data-test-id="farmingDetails"
    >
      {isDetails ? (
        <>
          {shouldShowTags && (
            <DetailsCardCell cellName={t('farm|Tags')} className={CardCellClassName} data-test-id="tags">
              <div className={styles.tags}>
                <Iterator render={LabelComponent} data={labels} />
              </div>
            </DetailsCardCell>
          )}

          <DetailsCardCell
            cellName={t('farm|Value Locked')}
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
              dollarEquivalent={distributionDollarEquivalent}
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
            <StatePercentage isLoading={isLoading} value={dailyApr} />
          </DetailsCardCell>

          {shouldShowDelegates && (
            <>
              <DetailsCardCell
                cellName={t('farm|Current Delegate')}
                tooltipContent={t('farm|currentDelegateTooltip')}
                className={CardCellClassName}
                data-test-id="currentDelegate"
              >
                {/* TODO: https://madfish.atlassian.net/browse/QUIPU-622 */}
                <DeprecatedStateData isLoading={isLoading} data={currentDelegate}>
                  {delegate => <CandidateButton candidate={delegate} />}
                </DeprecatedStateData>
              </DetailsCardCell>

              <DetailsCardCell
                cellName={t('farm|Next Delegate')}
                tooltipContent={t('farm|nextDelegateTooltip')}
                className={CardCellClassName}
                data-test-id="nextDelegate"
              >
                <DeprecatedStateData isLoading={isLoading} data={nextDelegate}>
                  {delegate => <CandidateButton candidate={delegate} />}
                </DeprecatedStateData>
              </DetailsCardCell>
            </>
          )}

          <DetailsCardCell
            cellName={t('farm|farmingEndsIn')}
            tooltipContent={t('farm|farmingEndsInTooltip')}
            className={CardCellClassName}
            data-test-id="farmingEndsIn"
          >
            <DeprecatedStateData isLoading={isLoading} data={endTime}>
              {timestamp => <Countdown endTimestamp={timestamp} />}
            </DeprecatedStateData>
          </DetailsCardCell>

          {shouldShowLockPeriod && (
            <DetailsCardCell
              cellName={t('farm|Lock Period')}
              tooltipContent={t('farm|lockPeriodTooltip')}
              className={CardCellClassName}
              data-test-id="lockPeriod"
            >
              <DeprecatedStateData isLoading={isLoading} data={timelock}>
                {value => <TimespanView value={value} />}
              </DeprecatedStateData>
            </DetailsCardCell>
          )}

          {shouldShowWithdrawalFee && (
            <DetailsCardCell
              cellName={t('farm|Unlock Fee')}
              tooltipContent={t('farm|unlockFeeTooltip')}
              className={CardCellClassName}
              data-test-id="withdrawalFee"
            >
              <DeprecatedStateData isLoading={isLoading} data={withdrawalFee}>
                {_withdrawalFee => <StatePercentage isLoading={false} value={_withdrawalFee} />}
              </DeprecatedStateData>
            </DetailsCardCell>
          )}

          <DetailsCardCell
            cellName={t('farm|Interface Fee')}
            tooltipContent={t('farm|interfaceFeeTooltip')}
            className={CardCellClassName}
            data-test-id="interfaceFee"
          >
            <DeprecatedStateData isLoading={isLoading} data={harvestFee}>
              {_harvestFee => <StatePercentage isLoading={false} value={_harvestFee} />}
            </DeprecatedStateData>
          </DetailsCardCell>

          <div className={cx(commonContainerStyles.detailsButtons, styles.stakeDetailsButtons)}>
            <Button
              className={cx(commonContainerStyles.detailsButton, styles.stakeDetailsButton)}
              theme="inverse"
              href={depositTokenUrl}
              external
              icon={<ExternalLink className={commonContainerStyles.linkIcon} />}
              data-test-id="tokenContractButton"
            >
              {t('farm|Token Contract')}
            </Button>

            <Button
              className={cx(commonContainerStyles.detailsButton, styles.stakeDetailsButton)}
              theme="inverse"
              href={stakeUrl}
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
});
