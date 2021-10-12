import React, { useCallback, useContext } from 'react';
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
import { SubmitType } from '@utils/types';
import { FARM_CONTRACT } from '@utils/defaults';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import useUpdateToast from '@hooks/useUpdateToast';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { VotingReward } from '@components/svg/VotingReward';

import s from './FarmingStats.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type FarmingStatsProps = {
  className?: string
};

const getAllHarvest = async ({
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
    if (!farms) return;
    handleLoader();
    const harvestInfo = farms.map((farm) => {
      const fromAsset = {
        contract: FARM_CONTRACT,
        id: new BigNumber(0),
      };

      const farmId = new BigNumber(farm.farmId);

      return getAllHarvest({
        tezos,
        accountPkh,
        fromAsset,
        farmContract,
        handleErrorToast,
        farmId,
      });
    });

    try {
      const harvestInfoResolved = await Promise.all(harvestInfo);

      const op = await batchify(
        tezos.wallet.batch([]),
        harvestInfoResolved.flat(),
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
    farms,
  ]);

  return (
    <Card className={className} contentClassName={cx(s.content, modeClass[colorThemeMode])}>
      <div className={s.flex}>
        <div className={s.reward}>
          <div className={s.rewardContent}>
            <span className={s.rewardHeader}>
              Your Pending QNOTs
            </span>
            <span className={s.rewardAmount}>
              100,000,000
            </span>
          </div>
          <VotingReward />
        </div>
        <div className={s.item}>
          <span className={s.header}>
            Your claimed QNOTs
          </span>
          <span className={s.amount}>1,000,000.00</span>
        </div>
      </div>
      <Button className={s.button} onClick={handleHarvest}>Harvest All</Button>
    </Card>
  );
};
