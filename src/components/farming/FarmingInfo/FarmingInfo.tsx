import React, {
  useContext, useCallback,
} from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { batchify, fromOpOpts, withTokenApprove } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import { withTypes } from 'react-final-form';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import useUpdateToast from '@hooks/useUpdateToast';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import {
  useFarmingContract, useTezos, useAccountPkh, useNetwork,
} from '@utils/dapp';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { FARM_CONTRACT } from '@utils/defaults';
import {
  WhitelistedFarm, SubmitType, WhitelistedFarmOptional, FarmingFormValues,
} from '@utils/types';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { LineChartSampleData } from '@components/charts/content';
import { Timeleft } from '@components/ui/Timeleft';
import { FarmingForm } from '@components/farming/FarmingForm';
import { Back } from '@components/svg/Back';
import { VotingReward } from '@components/svg/VotingReward';

import s from './FarmingInfo.module.sass';

const LineChart = dynamic(() => import('@components/charts/LineChart'), {
  ssr: false,
});

type FarmingInfoProps = {
  farm:WhitelistedFarmOptional
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
  const { t } = useTranslation(['common', 'farms']);
  const { Form } = withTypes<FarmingFormValues>();
  const {
    openConnectWalletModal,
  } = useConnectModalsState();
  const { colorThemeMode } = useContext(ColorThemeContext);

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
    const farmId = new BigNumber(farm.id);

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
      <Form
        onSubmit={() => {
          // if (!tezos) return;
          // handleLoader();
          // submitForm(
          //   tezos,
          //   currentTab.id === 'remove'
          //     ? removeLiquidityParams
          //     : addLiquidityParams,
          //   handleErrorToast,
          //   handleSuccessToast,
          //   currentTab.id,
          // );
        }}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({ handleSubmit, form }) => (
          // <LiquidityForm
          //   form={form}
          //   handleSubmit={handleSubmit}
          //   debounce={100}
          //   save={() => {}}
          //   setTabsState={setTabsState}
          //   tabsState={tabsState}
          //   token1={token1}
          //   token2={token2}
          //   setTokens={setTokens}
          //   tokenPair={tokenPair}
          //   setTokenPair={setTokenPair}
          //   tokensData={tokensData}
          //   handleTokenChange={handleTokenChangeWrapper}
          //   currentTab={currentTab}
          //   setRemoveLiquidityParams={setRemoveLiquidityParams}
          //   removeLiquidityParams={removeLiquidityParams}
          //   setAddLiquidityParams={setAddLiquidityParams}
          //   addLiquidityParams={addLiquidityParams}
          // />

          <FarmingForm
            form={form}
            handleSubmit={handleSubmit}
            debounce={100}
            save={() => {}}
            remaining={remaining}
            amount={amount}
            token1={tokenPair.token1}
            token2={tokenPair.token2}
          />
        )}
      />
    </>
  );
};
