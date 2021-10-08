import React, {
  useContext, useState, useMemo, useCallback,
} from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { batchify, fromOpOpts, withTokenApprove } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import useUpdateToast from '@hooks/useUpdateToast';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import {
  useFarmingContract, useTezos, useAccountPkh, useNetwork,
} from '@utils/dapp';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { FARM_CONTRACT, TEZOS_TOKEN } from '@utils/defaults';
import { WhitelistedFarm, SubmitType, FarmsType } from '@utils/types';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
import { LineChartSampleData } from '@components/charts/content';
import { ComplexBaker, ComplexInput } from '@components/ui/ComplexInput';
import { Tabs } from '@components/ui/Tabs';
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
  farm:FarmsType
  className?: string
  handleUnselect: () => void
  onClick?:(farm:WhitelistedFarm) => void
  amount?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const getHarvest = async ({
  tezos,
  fromAsset,
  accountPkh,
  farmContract,
  handleErrorToast,
  farmId,
}: SubmitType) => {
  try {
    const farmParams = await withTokenApprove(
      tezos,
      fromAsset,
      accountPkh,
      farmContract.address,
      0,
      [
        farmContract.methods
          .harvest(farmId, accountPkh)
          .toTransferParams(fromOpOpts(undefined, undefined)),
      ],
    );
    return farmParams;
  } catch (e) {
    handleErrorToast(e);
    return [];
  }
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
  const farmContract = useFarmingContract();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const network = useNetwork();
  const updateToast = useUpdateToast();
  const { t } = useTranslation(['common', 'swap']);
  const {
    openConnectWalletModal,
  } = useConnectModalsState();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [tabsState, setTabsState] = useState(TabsContent[0].id);

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  const handleLoader = useCallback(() => {
    updateToast({
      type: 'info',
      render: t('common|Loading'),
    });
  }, [updateToast, t]);

  const handleErrorToast = useCallback((err) => {
    updateToast({
      type: 'error',
      render: `${err.name}: ${err.message}`,
    });
  }, [updateToast]);

  const handleSuccessToast = useCallback(() => {
    updateToast({
      type: 'success',
      render: t('common|Proposal submitted!'),
    });
  }, [updateToast, t]);

  const handleHarvest = useCallback(async () => {
    if (!tezos) {
      updateToast({
        type: 'error',
        render: t('common|Tezos not loaded'),
      });
      return;
    }
    if (!farmContract) {
      updateToast({
        type: 'error',
        render: t('common|Contract not loaded'),
      });
      return;
    }
    if (!accountPkh) {
      openConnectWalletModal(); return;
    }
    if (!farm) return;

    handleLoader();

    const fromAsset = {
      contract: FARM_CONTRACT,
      id: new BigNumber(0),
    };
    const farmId = new BigNumber(farm.fid);

    const harvestInfo = getHarvest({
      tezos,
      accountPkh,
      fromAsset,
      farmContract,
      handleErrorToast,
      farmId,
    });

    try {
      const harvestInfoResolved = await Promise.resolve(harvestInfo);

      const op = await batchify(
        tezos.wallet.batch([]),
        harvestInfoResolved,
      ).send();
      await op.confirmation();
      handleSuccessToast();
    } catch (e) {
      handleErrorToast(e);
    }
  }, [
    tezos,
    accountPkh,
    network,
    farmContract,
    farm,
  ]);

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
              {t('common|Back to Vaults')}
            </Button>
          ),
        }}
      >
        <div className={cx(s.fullWidth, s.flex)}>
          <div className={s.reward}>
            <div className={s.rewardContent}>
              <span className={s.rewardHeader}>
                {t('common|Your Pending Reward')}
              </span>
              <span className={s.rewardAmount}>
                100,000,000
                <span className={s.rewardCurrency}>
                  {t('common|QUIPU')}
                </span>
              </span>
            </div>
            <VotingReward />
          </div>
          <div className={s.notRewards}>
            <div className={s.itemsRows}>
              <div className={s.item}>
                <header className={s.header}>
                  {t('common|Your Share')}
                </header>
                <span className={s.amount}>1,000,000.00(0.001$)</span>
              </div>
              <div className={s.item}>
                <span className={s.header}>
                  {t('common|Your Delegate')}
                </span>
                <Button theme="inverse" className={s.amount}>
                  {t('common|Everstake')}
                </Button>
              </div>
              <div className={s.item}>
                <span className={s.header}>
                  {t('common|Lock ends in')}
                </span>
                <div className={cx(s.govBlockLabel, s.amount)}>
                  <Timeleft remaining={remaining} />
                </div>
              </div>

            </div>
            <Button className={cx(s.statButton, s.button)} onClick={handleHarvest}>
              {t('common|Harvest')}
            </Button>
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
              {t('common|Trade')}
            </Button>
            {currentTab.id === 'stake' ? (
              <Button theme="underlined" className={s.tradeBtn}>
                {t('common|Invest')}
              </Button>
            ) : (
              <Button theme="underlined" className={s.tradeBtn}>
                {t('common|Divest')}
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
              {t('common|Bake&Bake')}
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
              {t('common|Everstake')}
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
              {t('common|Pair Analytics')}
            </Button>
            <Button
              className={s.detailsButton}
              theme="inverse"
              icon={
                <ExternalLink className={s.linkIcon} />
              }
            >
              {t('common|Farm Contract')}
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
              {t('common|Token Contract')}
            </Button>
            <Button
              className={s.detailsButton}
              theme="inverse"
              icon={
                <ExternalLink className={s.linkIcon} />
              }
            >
              {t('common|Project')}
            </Button>
          </div>
        </Card>
      </StickyBlock>
    </>
  );
};
