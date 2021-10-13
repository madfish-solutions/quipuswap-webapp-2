import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import cx from 'classnames';
import {
  batchify, fromOpOpts, withTokenApprove,
} from '@quipuswap/sdk';
import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';

import {
  useAccountPkh,
  useFarmingContract,
  useFarms,
  useNetwork,
  useTezos,
} from '@utils/dapp';
import { FarmingUsersInfo, SubmitType } from '@utils/types';
import { FARM_CONTRACT, FARM_PRECISION, STABLE_TOKEN } from '@utils/defaults';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import useUpdateToast from '@hooks/useUpdateToast';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { useUserInfoInAllFarms } from '@hooks/useUserInfoInAllFarms';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { VotingReward } from '@components/svg/VotingReward';

import { fromDecimals, parseDecimals } from '@utils/helpers';
import s from './FarmingStats.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type FarmingStatsProps = {
  className?: string
};

const getAllHarvest = async ({
  accountPkh,
  farmContract,
  handleErrorToast,
  farmId,
}: SubmitType) => {
  try {
    const farmParams = farmContract.methods
      .harvest(farmId, accountPkh)
      .toTransferParams(fromOpOpts(undefined, undefined));
    return farmParams;
  } catch (e) {
    handleErrorToast(e);
    return undefined;
  }
};

export const FarmingStats: React.FC<FarmingStatsProps> = ({
  className,
}) => {
  const { data: farms } = useFarms();
  const farmContract = useFarmingContract();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const updateToast = useUpdateToast();
  const network = useNetwork();
  const { t } = useTranslation(['common']);
  const {
    openConnectWalletModal,
  } = useConnectModalsState();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const {
    userInfoInFarms: userInfoInAllFarms,
    loadAmountOfTokensInFarms,
  } = useUserInfoInAllFarms();
  const [claimed, setClaimed] = useState<string>('0');
  const [pending, setPending] = useState<string>('0');

  const calculatePendingReward = useCallback(() => {
    if (!userInfoInAllFarms) return;
    if (!accountPkh) return;

    const generalTotal = Object
      .values(userInfoInAllFarms)
      .reduce((userData, cur:FarmingUsersInfo | undefined, index) => (cur ? {
        claimed: userData.claimed.plus(cur.claimed),
        pending: userData.pending.plus(new BigNumber(cur.earned
          .plus(new BigNumber(cur.staked)
            .multipliedBy(
              farms[index].totalValueLocked === '0' ? 0
                : new BigNumber(Date.now() - new Date(farms[index].upd).getTime())
                  .dividedBy(1000)
                  .multipliedBy(new BigNumber(farms[index].rewardPerSecond))
                  .dividedBy(new BigNumber(farms[index].totalValueLocked))
                  .plus(new BigNumber(farms[index].rewardPerShare)),
            )
            .minus(cur.prev_earned)))
          .dividedBy(+FARM_PRECISION)),
      } : userData),
      { claimed: new BigNumber(0), pending: new BigNumber(0) });

    setClaimed(fromDecimals(generalTotal.claimed, 6).toString());
    setPending(parseDecimals(fromDecimals(generalTotal.pending, 6).toString(), 0, Infinity, 6));
  }, [userInfoInAllFarms, accountPkh, farms]);

  useEffect(() => {
    calculatePendingReward();
  }, [calculatePendingReward]);

  const handleErrorToast = useCallback((err) => {
    updateToast({
      type: 'error',
      render: `${err.name}: ${err.message}`,
    });
  }, [updateToast]);

  const handleLoader = useCallback(() => {
    updateToast({
      type: 'info',
      render: t('common|Loading'),
    });
  }, [updateToast, t]);

  const handleSuccessToast = useCallback(() => {
    updateToast({
      type: 'success',
      render: t('common|Harvested!'),
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
    if (!farms) return;
    handleLoader();
    const fromAsset = {
      contract: FARM_CONTRACT,
      id: new BigNumber(0),
    };
    const harvestInfo = farms.map((farm) => {
      const farmId = new BigNumber(farm.farmId);

      return getAllHarvest({
        accountPkh,
        farmContract,
        handleErrorToast,
        farmId,
      });
    });

    try {
      const harvestInfoResolved = await Promise.all(harvestInfo);

      const harvestParams = await withTokenApprove(
        tezos,
        fromAsset,
        accountPkh,
        farmContract.address,
        0,
        [...harvestInfoResolved],
      );

      const op = await batchify(
        tezos.wallet.batch([]),
        harvestParams.flat(),
      ).send();
      await op.confirmation();
      handleSuccessToast();
      // TODO: re- calculatePendingReward(), which based on userInfo update
      loadAmountOfTokensInFarms();
    } catch (e) {
      handleErrorToast(e);
    }
  }, [
    tezos,
    accountPkh,
    network,
    farmContract,
    farms,
  ]);

  return (
    <Card className={className} contentClassName={cx(s.content, modeClass[colorThemeMode])}>
      <div className={s.flex}>
        <div className={s.reward}>
          <div className={s.rewardContent}>
            <span className={s.rewardHeader}>
              {t('farms|Your Pending {{token}}', { token: STABLE_TOKEN.metadata.symbol })}
            </span>
            <span className={s.rewardAmount}>{pending}</span>
          </div>
          <VotingReward />
        </div>
        <div className={s.item}>
          <span className={s.header}>
            {t('farms|Your claimed {{token}}', { token: STABLE_TOKEN.metadata.symbol })}
          </span>
          <span className={s.amount}>{claimed}</span>
        </div>
      </div>
      <Button className={s.button} onClick={handleHarvest}>{t('farms|Harvest All')}</Button>
    </Card>
  );
};
