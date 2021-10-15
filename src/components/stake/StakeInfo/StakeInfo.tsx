import React, {
  useContext, useState, useMemo, useCallback, useEffect,
} from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { batchify, estimateTezInToken, withTokenApprove } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import { withTypes } from 'react-final-form';

import {
  FARM_CONTRACT_MAINNET, FARM_CONTRACT_TESTNET, FARM_PRECISION, TEZOS_TOKEN,
} from '@utils/defaults';
import { getHarvest } from '@utils/helpers/getHarvest';
import {
  FarmingFormValues, QSMainNet, VoterType, WhitelistedBaker, WhitelistedStake,
} from '@utils/types';
import {
  useAccountPkh, useBakers, useFarmingContract, useNetwork, useTezos,
} from '@utils/dapp';
import {
  fromDecimals, getWhitelistedBakerName, getWhitelistedTokenSymbol, parseDecimals, transformToken,
} from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { useUserInfoInAllStake } from '@hooks/useUserInfoInAllStake';
import useUpdateToast from '@hooks/useUpdateToast';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { submitForm } from '@components/farming/FarmingInfo/farmingHelpers';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Timeleft } from '@components/ui/Timeleft';
import { LineChartSampleData } from '@components/charts/content';
import { Back } from '@components/svg/Back';
import { VotingReward } from '@components/svg/VotingReward';

import { StakingForm } from '@components/farming/FarmingForm/StakingForm';
import s from './StakeInfo.module.sass';

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

type StakeInfoProps = {
  stake:WhitelistedStake
  className?: string
  onClick?:(stake:WhitelistedStake) => void
  tezPrice: BigNumber
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const StakeInfo: React.FC<StakeInfoProps> = ({
  className,
  stake,
  tezPrice,
}) => {
  const {
    farmId,
    startTime,
    timelock,
    dexStorage,
    totalValueLocked,
    rewardPerSecond,
    rewardPerShare,
    upd,
    deposit,
    stakedToken,
    rewardToken,
    fees,
  } = stake;
  const farmContract = useFarmingContract();
  const { data: bakers } = useBakers();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const updateToast = useUpdateToast();
  const network = useNetwork().id as QSMainNet;
  const { t } = useTranslation(['common', 'farms']);
  const { Form } = withTypes<FarmingFormValues>();

  const {
    openConnectWalletModal,
  } = useConnectModalsState();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const {
    userInfoInStakes: userInfoInAllStake,
    loadAmountOfTokensInStakes,
  } = useUserInfoInAllStake();
  const [pending, setPending] = useState<string>('0');
  const [voter, setVoter] = useState<VoterType>();

  const [tabsState, setTabsState] = useState(TabsContent[0].id);

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  const remaining:Date = useMemo(() => new Date(
    new Date(startTime).getTime() + new Date(timelock).getTime(),
  ), [startTime, timelock]);

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

  const handleSuccessHarvest = useCallback(() => {
    updateToast({
      type: 'success',
      render: t('common|Harvest completed!'),
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
    if (!stake) return;

    handleLoader();

    const fromAsset = {
      contract: network === 'granadanet' ? FARM_CONTRACT_TESTNET : FARM_CONTRACT_MAINNET,
      id: new BigNumber(0),
    };

    const harvestInfo = getHarvest({
      accountPkh,
      farmContract,
      handleErrorToast,
      farmId: new BigNumber(farmId),
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
      handleSuccessHarvest();
      loadAmountOfTokensInStakes();
    } catch (e) {
      handleErrorToast(e);
    }
  }, [
    tezos,
    accountPkh,
    farmContract,
    stake,
    t,
    updateToast,
    handleErrorToast,
    handleLoader,
    handleSuccessHarvest,
    openConnectWalletModal,
    farmId,
    loadAmountOfTokensInStakes,
  ]);

  const myCandidate: WhitelistedBaker | undefined = useMemo(() => {
    if (voter?.candidate) {
      return bakers.find((x) => x.address === voter?.candidate);
    }
    return undefined;
  }, [voter, bakers]);

  useEffect(() => {
    const asyncVoter = async () => {
      if (!accountPkh) return;
      const tempVoter = await dexStorage.storage.voters.get(accountPkh);
      if (tempVoter) {
        setVoter({
          veto: fromDecimals(tempVoter.veto, TEZOS_TOKEN.metadata.decimals).toString(),
          candidate: tempVoter.candidate,
          vote: fromDecimals(tempVoter.vote, TEZOS_TOKEN.metadata.decimals).toString(),
        });
      } else setVoter({} as VoterType);
    };
    asyncVoter();
  }, [accountPkh, dexStorage]);

  const calculatePendingReward = useCallback(() => {
    if (!userInfoInAllStake) return;
    if (!accountPkh) return;

    const userData = userInfoInAllStake[Number(farmId)];

    if (!userData) return;

    const userClaimed = new BigNumber(userData.earned
      .plus(new BigNumber(userData.staked)
        .multipliedBy(
          totalValueLocked === '0' ? 0
            : new BigNumber(Date.now() - new Date(upd).getTime())
              .dividedBy(1000)
              .multipliedBy(new BigNumber(rewardPerSecond))
              .dividedBy(new BigNumber(totalValueLocked))
              .plus(new BigNumber(rewardPerShare)),
        )
        .minus(userData.prev_earned)))
      .dividedBy(new BigNumber(FARM_PRECISION))
      .multipliedBy(new BigNumber(fees.harvest_fee)
        .minus(new BigNumber(FARM_PRECISION))
        .abs()
        .dividedBy(new BigNumber(FARM_PRECISION)));

    setPending(parseDecimals(fromDecimals(userClaimed, 6).toString(), 0, Infinity, 6));
  }, [
    userInfoInAllStake,
    accountPkh,
    farmId,
    upd,
    rewardPerSecond,
    rewardPerShare,
    totalValueLocked,
    fees,
  ]);

  const transformedReward = useMemo(() => transformToken(rewardToken), [rewardToken]);

  useEffect(() => {
    calculatePendingReward();
  }, [calculatePendingReward]);

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
                {pending}
                <span className={s.rewardCurrency}>
                  {getWhitelistedTokenSymbol(transformedReward)}
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
                <span className={s.amount}>
                  {fromDecimals(deposit, rewardToken.decimals).toString()}
                  (
                  {fromDecimals(estimateTezInToken(dexStorage, deposit), 6)
                    .multipliedBy(tezPrice)
                    .toFixed(2)}
                  $)
                </span>
              </div>
              <div className={s.item}>
                <span className={s.header}>
                  {t('common|Your Delegate')}
                </span>
                {myCandidate ? (
                  <Button
                    href={`https://tzkt.io/${myCandidate.address}`}
                    external
                    theme="underlined"
                    title={getWhitelistedBakerName(myCandidate)}
                    className={s.amount}
                  >
                    {getWhitelistedBakerName(myCandidate)}
                  </Button>
                ) : '—'}
              </div>
              <div className={s.item}>
                <span className={s.header}>
                  {t('common|Lock ends in')}
                </span>
                <div className={cx(s.govBlockLabel, s.amount)}>
                  {timelock === '0' ? '—' : (
                    <Timeleft
                      remaining={remaining}
                      disabled
                      className={s.priceAmount}
                    />
                  )}
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
                token1={transformedReward}
                width={32}
                className={s.tokenLogos}
              />
              <h3 className={s.title}>
                {getWhitelistedTokenSymbol(transformedReward)}
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
          const fromAsset = {
            contract: stakedToken.contractAddress,
            id: stakedToken.fa2TokenId ?? undefined,
          };
          submitForm(
            tezos,
            accountPkh!,
            handleErrorToast,
            handleSuccessToast,
            farmContract,
            currentTab.id,
            new BigNumber(farmId),
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
          <StakingForm
            form={form}
            handleSubmit={handleSubmit}
            debounce={100}
            save={() => {}}
            stake={stake}
            token={transformedReward}
            currentTab={currentTab}
            setTabsState={setTabsState}
            tabsState={tabsState}
            tezPrice={tezPrice}
          />
        )}
      />
    </>
  );
};
