import React, {
  useContext, useState, useMemo,
} from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
import { LineChartSampleData } from '@components/ui/LineChart/content';
import { ComplexBaker, ComplexInput } from '@components/ui/ComplexInput';
import { TEZOS_TOKEN } from '@utils/defaults';
import { Tabs } from '@components/ui/Tabs';
import { WhitelistedFarm } from '@utils/types';
import { StickyBlock } from '@components/common/StickyBlock';
import { Tooltip } from '@components/ui/Tooltip';
import { Route } from '@components/common/Route';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { ExternalLink } from '@components/svg/ExternalLink';
import { Transactions } from '@components/svg/Transactions';
import { Back } from '@components/svg/Back';
import VotingReward from '@icons/VotingReward.svg';

import s from './FarmingInfo.module.sass';

const LineChart = dynamic(() => import('@components/ui/LineChart'), {
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
  handleUnselect,
}) => {
  const {
    remaining,
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
            <Button onClick={() => (handleUnselect ? handleUnselect() : null)} theme="quaternary" className={s.proposalHeader}>
              <Back className={s.proposalBackIcon} />
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
                <span className={s.header}>
                  Your Share
                </span>
                <span className={s.amount}>1,000,000.00(0.001$)</span>
              </div>
              <div className={s.item}>
                <span className={s.header}>
                  Your Delegate
                </span>
                <Button theme="quaternary" className={s.amount}>Everstake</Button>
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
      <LineChart className={s.chart} data={LineChartSampleData} />
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
          contentClassName={s.content}
        >
          <CardCell
            header={(
              <>
                {t('common:Sell Price')}
                <Tooltip
                  sizeT="small"
                  content={t('common:The amount of token B you receive for 1 token A, according to the current exchange rate.')}
                />
              </>
            )}
            className={s.cell}
          >
            <div className={s.cellAmount}>
              <CurrencyAmount amount="1" currency="tez" />
              <span className={s.equal}>=</span>
              <CurrencyAmount amount="100000.11" currency="QPSP" dollarEquivalent="400" />
            </div>
          </CardCell>
          <CardCell
            header={(
              <>
                {t('common:Buy Price')}
                <Tooltip
                  sizeT="small"
                  content={t('common:The amount of token A you receive for 1 token B, according to the current exchange rate.')}
                />
              </>
             )}
            className={s.cell}
          >
            <div className={s.cellAmount}>
              <CurrencyAmount amount="1" currency="QPSP" />
              <span className={s.equal}>=</span>
              <CurrencyAmount amount="1000000000.000011" currency="tez" dollarEquivalent="0.00004" />
            </div>
          </CardCell>
          <CardCell
            header={(
              <>
                {t('common:Price impact')}
                <Tooltip
                  sizeT="small"
                  content={t('swap:The impact your transaction is expected to make on the exchange rate.')}
                />
              </>
            )}
            className={s.cell}
          >
            <CurrencyAmount amount="<0.01" currency="%" />
          </CardCell>
          <CardCell
            header={(
              <>
                {t('common:Fee')}
                <Tooltip
                  sizeT="small"
                  content={t('swap:Expected fee for this transaction charged by the Tezos blockchain.')}
                />
              </>
            )}
            className={s.cell}
          >
            <CurrencyAmount amount="0.001" currency="XTZ" />
          </CardCell>
          <CardCell
            header={(
              <>
                {t('common:Route')}
                <Tooltip
                  sizeT="small"
                  content={t("swap:When a direct swap is impossible (no liquidity pool for the pair exists yet) QuipuSwap's algorithm will conduct the swap in several transactions, picking the most beneficial chain of trades.")}
                />
              </>
            )}
            className={s.cell}
          >
            <Route
              routes={['qpsp', 'usd', 'xtz']}
            />
          </CardCell>
          <Button
            className={s.detailsButton}
            theme="inverse"
          >
            View Pair Analytics
            <ExternalLink className={s.linkIcon} />
          </Button>
        </Card>
      </StickyBlock>
    </>
  );
};
