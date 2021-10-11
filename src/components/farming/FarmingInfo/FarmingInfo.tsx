import React, {
  useContext, useCallback, useState, useMemo,
} from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import {
  batchify, fromOpOpts, Token, withTokenApprove,
} from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import { withTypes } from 'react-final-form';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import useUpdateToast from '@hooks/useUpdateToast';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import {
  useFarmingContract, useTezos, useAccountPkh,
} from '@utils/dapp';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { FARM_CONTRACT } from '@utils/defaults';
import {
  WhitelistedFarm, SubmitType, FarmingFormValues,
} from '@utils/types';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { LineChartSampleData } from '@components/charts/content';
import { Timeleft } from '@components/ui/Timeleft';
import { FarmingForm, TabsContent } from '@components/farming/FarmingForm';
import { Back } from '@components/svg/Back';
import { VotingReward } from '@components/svg/VotingReward';

import s from './FarmingInfo.module.sass';
import { submitForm } from './farmingHelpers';

const LineChart = dynamic(() => import('@components/charts/LineChart'), {
  ssr: false,
});

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

const getHarvest = async ({
  accountPkh,
  farmContract,
  handleErrorToast,
  farmId,
}: SubmitType) => {
  try {
    const farmParams = [
      farmContract.methods
        .harvest(farmId, accountPkh)
        .toTransferParams(fromOpOpts(undefined, undefined))];
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
    remaining = new Date(),
    tokenPair,
  } = farm;
  const farmContract = useFarmingContract();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const updateToast = useUpdateToast();
  const { t } = useTranslation(['common', 'farms']);
  const { Form } = withTypes<FarmingFormValues>();
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
      render: currentTab.id === 'stake' ? t('common|Stake completed!') : t('common|Unstake completed!'),
    });
  }, [updateToast, t, currentTab]);

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
    const farmId = new BigNumber(farm.farmId);

    const harvestInfo = getHarvest({
      accountPkh,
      farmContract,
      handleErrorToast,
      farmId,
    });

    try {
      const harvestInfoResolved = await Promise.resolve(harvestInfo);

      const harvestParams = await withTokenApprove(
        tezos,
        fromAsset,
        accountPkh,
        farmContract.address,
        0,
        harvestInfoResolved,
      );

      const op = await batchify(
        tezos.wallet.batch([]),
        harvestParams,
      ).send();
      await op.confirmation();
      handleSuccessToast();
    } catch (e) {
      handleErrorToast(e);
    }
  }, [
    tezos,
    accountPkh,
    farmContract,
    farm,
    t,
    updateToast,
    handleErrorToast,
    handleLoader,
    handleSuccessToast,
    openConnectWalletModal,
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
      <Card className={compountClassName}>
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
        <div className={cx(s.disabled, modeClass[colorThemeMode])}>
          <div className={s.disabledBg} />
          <h2 className={s.h1}>{t('common|Coming soon!')}</h2>
        </div>
      </Card>
      <Form
        onSubmit={(values) => {
          if (!tezos) return;
          handleLoader();
          const fromAsset: Token = {
            contract: farm.stakedToken.contractAddress,
            id: farm.stakedToken.fa2TokenId ?? undefined,
          };
          submitForm(
            tezos,
            accountPkh!,
            handleErrorToast,
            handleSuccessToast,
            farmContract,
            currentTab.id,
            new BigNumber(farm.farmId),
            new BigNumber(values.balance3),
            values.selectedBaker,
            fromAsset,
          );
        }}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({ handleSubmit, form }) => (
          <FarmingForm
            form={form}
            handleSubmit={handleSubmit}
            debounce={100}
            save={() => {}}
            remaining={remaining}
            amount={amount}
            tokenPair={tokenPair}
            currentTab={currentTab}
            setTabsState={setTabsState}
            tabsState={tabsState}
          />
        )}
      />
    </>
  );
};
