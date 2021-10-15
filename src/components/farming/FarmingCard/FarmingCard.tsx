import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';
import BigNumber from 'bignumber.js';

import {
  fromDecimals,
  getWhitelistedTokenSymbol,
  prettyPrice,
} from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { useBalance } from '@hooks/useBalance';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Tooltip } from '@components/ui/Tooltip';
import { APY } from '@components/svg/APY';
import { QSMainNet, WhitelistedFarm } from '@utils/types';
import { prettyPercentage } from '@utils/helpers/prettyPercentage';
import {
  estimateTezInShares, estimateTezInToken, findDex, FoundDex,
} from '@quipuswap/sdk';
import { useNetwork, useTezos } from '@utils/dapp';
import { Skeleton } from '@components/ui/Skeleton';
import { FACTORIES } from '@utils/defaults';
import { FarmingUserMoney } from '../FarmingUserMoney/FarmingUserMoney';

import s from './FarmingCard.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export type FarmingCardProps = {
  farm:WhitelistedFarm
  className?: string
  openModal?:() => void
  tezPrice: BigNumber
};

export const FarmingCard: React.FC<FarmingCardProps> = ({
  farm,
  className,
  tezPrice,
  openModal,
}) => {
  const {
    farmId,
    tokenPair,
    totalValueLocked,
    apyDaily,
    tokenContract,
    farmContract,
    analyticsLink,
    deposit,
    earned,
    dexStorage,
    rewardToken,
  } = farm;
  const tezos = useTezos();
  const { t } = useTranslation(['common', 'farms']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [balance, setBalance] = useState<string>();
  const balanceFromWallet = useBalance(farm);
  const network = useNetwork().id as QSMainNet;
  const [rewardDex, setRewardDex] = useState<FoundDex>();

  useEffect(() => {
    const loadDexes = async () => {
      if (!tezos) return;

      const rewardAsset = {
        contract: rewardToken.contractAddress,
        id: rewardToken.fa2TokenId ?? undefined,
      };
      const dex2 = await findDex(tezos, FACTORIES[network], rewardAsset);
      setRewardDex(dex2.storage);
    };
    setBalance(prettyPrice(+balanceFromWallet.toString(), 2, 6));
    loadDexes();
  }, [
    balanceFromWallet,
    farmId,
    network,
    tezos,
    rewardToken.contractAddress,
    rewardToken.fa2TokenId,
  ]);

  return (
    <Card
      className={cx(className, s.card)}
      contentClassName={cx(s.content, modeClass[colorThemeMode])}
    >
      <div className={s.header}>
        <div className={s.tokens}>
          <TokensLogos
            imageClassName={s.image}
            token1={tokenPair.token1}
            token2={tokenPair.token2}
            width={48}
          />
          <h3 className={s.title}>
            {getWhitelistedTokenSymbol(tokenPair.token1)}
            {' '}
            /
            {' '}
            {tokenPair.token2 && getWhitelistedTokenSymbol(tokenPair.token2)}
          </h3>
          <Tooltip sizeT="small" content="TVL (Total Value Locked) represents the total amount of a specific token locked on QuiuSwap across different pools." />

        </div>
        <div className={cx(s.links, s.onlyDesktop)}>
          <Button className={s.link} external href={tokenContract} theme="underlined">
            {t('common|Token Contract')}
          </Button>
          <Button className={s.link} external href={farmContract} theme="underlined">
            {t('common|Farm Contract')}
          </Button>
          <Button className={s.link} external href={analyticsLink} theme="underlined">
            {t('common|Analytics')}
          </Button>
        </div>

      </div>
      <div className={s.footer}>
        <div className={s.detailsBlock}>

          <div className={s.detailsHeader}>
            {t('common|TVL')}
          </div>
          <div className={s.detailsValue}>
            <span className={s.tvl}>$</span>
            {' '}
            <CurrencyAmount amount={prettyPrice(
              +(fromDecimals(estimateTezInShares(dexStorage, new BigNumber(totalValueLocked)), 6)
                .multipliedBy(tezPrice)
                .toFixed(2)),
              3, 3,
            )}
            />
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>
            {t('common|APY')}
            {' '}
            <Button theme="quaternary" className={s.apyIcon} onClick={openModal}>
              <APY />
            </Button>
          </div>
          <div className={s.detailsValue}>
            {prettyPercentage(apyDaily)}
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>
            {t('common|Daily')}
          </div>
          <div className={s.detailsValue}>
            {prettyPercentage(apyDaily.dividedBy(365))}
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>
            {t('common|Balance')}
          </div>
          <div className={s.detailsValue}>
            <FarmingUserMoney money={balance} />
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>
            {t('common|Deposit')}
          </div>
          <div className={s.detailsValue}>
            {dexStorage ? (
              <>
                <span className={s.tvl}>$</span>
                {' '}
                <CurrencyAmount amount={fromDecimals(estimateTezInToken(dexStorage, deposit), 6)
                  .multipliedBy(tezPrice)
                  .multipliedBy(2)
                  .toFixed(2)}
                />
              </>
            ) : <Skeleton className={s.skeletonSmallText} />}
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>{t('farms|Earned')}</div>
          <div className={s.detailsValue}>
            {rewardDex ? (
              <>
                <span className={s.tvl}>$</span>
                {' '}
                <CurrencyAmount amount={fromDecimals(
                  estimateTezInToken(rewardDex, earned), 6,
                )
                  .multipliedBy(tezPrice)
                  .toFixed(2)}
                />
              </>
            ) : <Skeleton className={s.skeletonSmallText} />}
          </div>
        </div>
        <div className={cx(s.links, s.onlyMobile)}>
          <div className={s.link}>
            <Button href={tokenContract} external theme="underlined">
              {t('common|Token Contract')}
            </Button>
          </div>
          <div className={s.link}>
            <Button href={farmContract} external theme="underlined">
              {t('common|Farm Contract')}
            </Button>
          </div>
          <div className={s.link}>
            <Button href={analyticsLink} external theme="underlined">
              {t('common|Analytics')}
            </Button>
          </div>
        </div>
        <Button href={`/farm/${farmId}`} className={s.button}>
          {t('common|Select')}
        </Button>
      </div>
    </Card>
  );
};
