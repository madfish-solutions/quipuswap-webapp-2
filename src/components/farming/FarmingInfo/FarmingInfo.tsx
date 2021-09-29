import React, {
  useContext, useState, useMemo,
} from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
import { LineChartSampleData } from '@components/charts/content';
import { ComplexBaker, ComplexInput } from '@components/ui/ComplexInput';
import { TEZOS_TOKEN } from '@utils/defaults';
import { Tabs } from '@components/ui/Tabs';
import { WhitelistedFarm } from '@utils/types';
import { StickyBlock } from '@components/common/StickyBlock';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Tooltip } from '@components/ui/Tooltip';
import { ExternalLink } from '@components/svg/ExternalLink';
import { Transactions } from '@components/svg/Transactions';
import { Back } from '@components/svg/Back';
import { VotingReward } from '@components/svg/VotingReward';

import { Timeleft } from '@components/ui/Timeleft';
import s from './FarmingInfo.module.sass';

const LineChart = dynamic(() => import('@components/charts/LineChart'), {
  ssr: false,
});

const TabsContent = [
  {
    id: 'stake',
    label: 'Stake',
  },
  {
    id: 'unstake',
    label: 'Unstake',
  },
];

type FarmingInfoProps = {
  farm:WhitelistedFarm
  className?: string
  handleUnselect: () => void
  onClick?:(farm:WhitelistedFarm) => void
  amount?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const timeDiffCalc = (dateFuture:number, dateNow:number) => {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  return { days, hours, minutes };
};

export const FarmingInfo: React.FC<FarmingInfoProps> = ({
  className,
  farm,
  amount = '1000000',
}) => {
  const {
    remaining,
    tokenPair,
  } = farm;
  const { t } = useTranslation(['common', 'swap']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { days, hours, minutes } = timeDiffCalc(Date.now(), remaining.getTime());
  const [tabsState, setTabsState] = useState(TabsContent[0].id);

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  const compountClassName = cx(
    modeClass[colorThemeMode],
    s.mb24i,
    className,
  );
  return (
    <>
      <Card
        className={compountClassName}
        contentClassName={s.topContent}
        header={{
          content: (
            <Button
              href="/farm"
              theme="quaternary"
              className={s.proposalHeader}
              control={
                <Back className={s.proposalBackIcon} />
            }
            >
              Back to Vaults
            </Button>
          ),
        }}
      >
        <div className={cx(s.fullWidth, s.flex)}>
          <div className={s.reward}>
            <div className={s.rewardContent}>
              <span className={s.rewardHeader}>
                Your Pending Reward
              </span>
              <span className={s.rewardAmount}>
                100,000,000
                <span className={s.rewardCurrency}>QUIPU</span>
              </span>
            </div>
            <VotingReward />
          </div>
          <div className={s.notRewards}>
            <div className={s.itemsRows}>
              <div className={s.item}>
                <header className={s.header}>
                  Your Share
                </header>
                <span className={s.amount}>1,000,000.00(0.001$)</span>
              </div>
              <div className={s.item}>
                <span className={s.header}>
                  Your Delegate
                </span>
                <Button theme="inverse" className={s.amount}>Everstake</Button>
              </div>
              <div className={s.item}>
                <span className={s.header}>
                  Lock ends in
                </span>
                <div className={cx(s.govBlockLabel, s.amount)}>
                  {days}
                  <span className={s.govBlockSpan}>D</span>
                  {' '}
                  {hours}
                  <span className={s.govBlockSpan}>H</span>
                  {' '}
                  {minutes}
                  <span className={s.govBlockSpan}>M</span>
                </div>
              </div>

            </div>
            <Button className={cx(s.statButton, s.button)}>Harvest</Button>
          </div>
        </div>
      </Card>
      <LineChart
        className={s.chart}
        data={LineChartSampleData}
        headerContent={(
          <div className={s.tokens}>
            <TokensLogos
              token1={tokenPair.token1}
              token2={tokenPair.token2}
              width={32}
              className={s.tokenLogos}
            />
            <h3 className={s.title}>
              {getWhitelistedTokenSymbol(tokenPair.token1)}
              {' '}
              /
              {' '}
              {getWhitelistedTokenSymbol(tokenPair.token1)}
            </h3>
          </div>
        )}
      />
      <StickyBlock>
        <Card
          header={{
            content: (
              <Tabs
                values={TabsContent}
                activeId={tabsState}
                setActiveId={(val) => setTabsState(val)}
                className={s.tabs}
              />
            ),
            button: (
              <Button
                theme="quaternary"
              >
                <Transactions />
              </Button>
            ),
            className: s.header,
          }}
          contentClassName={s.content}
        >
          <ComplexInput
            token1={TEZOS_TOKEN}
            value={100000}
            onChange={() => {}}
            handleBalance={() => {}}
            id="voting-input"
            label="Amount"
            className={cx(s.input, s.mb24)}
            mode="votes"
          />
          {currentTab.id === 'stake' && (
          <ComplexBaker
            className={s.baker}
            label="Baker"
            id="voting-baker"
          />
          )}
          <div className={s.tradeControls}>
            <Button theme="underlined" className={s.tradeBtn}>
              Trade
            </Button>
            {currentTab.id === 'stake' ? (
              <Button theme="underlined" className={s.tradeBtn}>
                Invest
              </Button>
            ) : (
              <Button theme="underlined" className={s.tradeBtn}>
                Divest
              </Button>
            )}

          </div>
          <div className={s.buttons}>
            <Button className={s.button}>
              {currentTab.label}
            </Button>
          </div>
        </Card>
        <Card
          header={{
            content: 'Farm Details',
          }}
          contentClassName={cx(modeClass[colorThemeMode], s.content)}
        >
          <CardCell
            header={(
              <>
                {t('common|Value Locked')}
                <Tooltip
                  sizeT="small"
                  content={t('common|TOOLTIP TODO')}
                />
              </>
            )}
            className={s.cell}
          >
            <div className={s.cellAmount}>
              $
              {' '}
              <span className={s.priceAmount}>
                <CurrencyAmount amount={amount} />
              </span>
            </div>
          </CardCell>
          <CardCell
            header={(
              <>
                {t('common|APR')}
                <Tooltip
                  sizeT="small"
                  content={t('common|TOOLTIP TODO')}
                />
              </>
            )}
            className={s.cell}
          >
            <div className={s.cellAmount}>
              <span className={s.priceAmount}>
                888 %
              </span>
            </div>
          </CardCell>
          <CardCell
            header={(
              <>
                {t('common|Daily')}
                <Tooltip
                  sizeT="small"
                  content={t('common|TOOLTIP TODO')}
                />
              </>
            )}
            className={s.cell}
          >
            <div className={s.cellAmount}>
              <span className={s.priceAmount}>
                0.008 %
              </span>
            </div>
          </CardCell>
          <CardCell
            header={(
              <>
                {t('common|Current Delegate')}
                <Tooltip
                  sizeT="small"
                  content={t('common|TOOLTIP TODO')}
                />
              </>
            )}
            className={s.cell}
          >
            <Button href="#" theme="underlined">
              Bake&Bake
            </Button>
          </CardCell>
          <CardCell
            header={(
              <>
                {t('common|Next Delegate')}
                <Tooltip
                  sizeT="small"
                  content={t('common|TOOLTIP TODO')}
                />
              </>
            )}
            className={s.cell}
          >
            <Button href="#" theme="underlined">
              Everstake
            </Button>
          </CardCell>
          <CardCell
            header={(
              <>
                {t('common|Ends in')}
                <Tooltip
                  sizeT="small"
                  content={t('common|TOOLTIP TODO')}
                />
              </>
            )}
            className={s.cell}
          >
            <Timeleft remaining={remaining} className={s.priceAmount} />
          </CardCell>
          <CardCell
            header={(
              <>
                {t('common|Lock Period')}
                <Tooltip
                  sizeT="small"
                  content={t('common|TOOLTIP TODO')}
                />
              </>
            )}
            className={s.cell}
          >
            <Timeleft remaining={remaining} className={s.priceAmount} />
          </CardCell>
          <CardCell
            header={(
              <>
                {t('common|Withdrawal Fee')}
                <Tooltip
                  sizeT="small"
                  content={t('common|TOOLTIP TODO')}
                />
              </>
            )}
            className={s.cell}
          >
            <div className={s.cellAmount}>
              <span className={s.priceAmount}>
                888 %
              </span>
            </div>
          </CardCell>
          <CardCell
            header={(
              <>
                {t('common|Interface Fee')}
                <Tooltip
                  sizeT="small"
                  content={t('common|TOOLTIP TODO')}
                />
              </>
            )}
            className={s.cell}
          >
            <div className={s.cellAmount}>
              <span className={s.priceAmount}>
                888 %
              </span>
            </div>
          </CardCell>
          <div className={s.detailsButtons}>
            <Button
              className={s.detailsButton}
              theme="inverse"
              icon={
                <ExternalLink className={s.linkIcon} />
              }
            >
              Pair Analytics
            </Button>
            <Button
              className={s.detailsButton}
              theme="inverse"
              icon={
                <ExternalLink className={s.linkIcon} />
              }
            >
              Farm Contract
            </Button>
          </div>
          <div className={s.detailsButtons}>
            <Button
              className={s.detailsButton}
              theme="inverse"
              icon={
                <ExternalLink className={s.linkIcon} />
              }
            >
              Token Contract
            </Button>
            <Button
              className={s.detailsButton}
              theme="inverse"
              icon={
                <ExternalLink className={s.linkIcon} />
              }
            >
              Project
            </Button>
          </div>
        </Card>
      </StickyBlock>
    </>
  );
};
