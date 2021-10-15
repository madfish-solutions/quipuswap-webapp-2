import React, { useContext, useState, useEffect } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';
import { estimateTezInToken, findDex, FoundDex } from '@quipuswap/sdk';

import { prettyPercentage } from '@utils/helpers/prettyPercentage';
import { QSMainNet, WhitelistedStake } from '@utils/types';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import {
  getUserBalance, useAccountPkh, useNetwork, useTezos,
} from '@utils/dapp';
import {
  fromDecimals, getWhitelistedTokenSymbol, prettyPrice, transformToken,
} from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Tooltip } from '@components/ui/Tooltip';
import { FarmingUserMoney } from '@components/farming/FarmingUserMoney/FarmingUserMoney';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { APY } from '@components/svg/APY';
import { ArrowDown } from '@components/svg/ArrowDown';

import { Skeleton } from '@components/ui/Skeleton';
import s from './StakeCard.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export type StakeCardProps = {
  stake:WhitelistedStake
  openModal: () => void
  className?: string
  tezPrice: BigNumber
};

export const StakeCard: React.FC<StakeCardProps> = ({
  stake,
  openModal,
  className,
  tezPrice,
}) => {
  const {
    farmId,
    stakedToken,
    totalValueLocked,
    apyDaily,
    deposit,
    earned,
    rewardToken,
    tokenContract,
    farmContract,
    analyticsLink,
    dexStorage,
  } = stake;
  const { t } = useTranslation(['common', 'farms']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [balance, setBalance] = useState<string>();
  const tezos = useTezos();
  const network = useNetwork().id as QSMainNet;
  const accountPkh = useAccountPkh();
  const [rewardDex, setRewardDex] = useState<FoundDex>();

  useEffect(() => {
    const loadBalance = async () => {
      if (!tezos) return;
      if (!accountPkh) return;
      const amount = await getUserBalance(
        tezos,
        accountPkh,
        stakedToken.contractAddress,
        stakedToken.fa2TokenId !== undefined ? 'fa1.2' : 'fa2',
        +stakedToken.fa2TokenId ?? undefined,
      );
      const share = estimateTezInToken(dexStorage, new BigNumber(amount ?? '0'));

      const balanceCalculated = share
        .dividedBy(1_000_000)
        .multipliedBy(tezPrice);

      setBalance(prettyPrice(+balanceCalculated.toString(), 2, 6));

      const rewardAsset = {
        contract: rewardToken.contractAddress,
        id: rewardToken.fa2TokenId ?? undefined,
      };

      const dex2 = await findDex(tezos, FACTORIES[network], rewardAsset);
      setRewardDex(dex2.storage);
    };
    loadBalance();
  },
  [tezos,
    accountPkh,
    stakedToken.fa2TokenId,
    stakedToken.contractAddress,
    tezPrice,
    network,
    rewardToken.fa2TokenId,
    rewardToken.contractAddress,
    dexStorage,
  ]);

  return (
    <Card
      className={cx(className, s.card)}
      contentClassName={cx(s.content, modeClass[colorThemeMode])}
    >
      <div className={s.header}>
        <div className={s.tokenLogos}>
          <TokensLogos
            imageClassName={s.image}
            layout="fill"
            token1={transformToken(stakedToken)}
            width={48}
          />
          <h3 className={s.title}>
            {getWhitelistedTokenSymbol(transformToken(stakedToken))}
          </h3>
          <Tooltip sizeT="small" content="TVL (Total Value Locked) represents the total amount of a specific token locked on QuiuSwap across different pools." />

        </div>
        <div className={cx(s.links, s.onlyDesktop)}>
          <Button className={s.link} href={tokenContract} theme="underlined">
            {t('common|Token Contract')}
          </Button>
          <Button className={s.link} href={farmContract} theme="underlined">
            {t('common|Farm Contract')}
          </Button>
          <Button className={s.link} href={analyticsLink} theme="underlined">
            {t('common|Analytics')}
          </Button>
        </div>

      </div>
      <div className={s.footer}>
        <div className={s.firstBlock}>
          <ArrowDown className={s.arrow} />
          <div className={s.tokenItem}>
            <TokensLogos token1={TEZOS_TOKEN} className={s.tokens} />
            <span className={s.bold600}>{t('farms|Earn')}</span>
            {' '}
            <span className={s.earn}>{getWhitelistedTokenSymbol(transformToken(rewardToken))}</span>
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>{t('common|TVL')}</div>
          <div className={s.detailsValue}>
            <span className={s.tvl}>$</span>
            {' '}
            <CurrencyAmount amount={prettyPrice(
              +estimateTezInToken(dexStorage, new BigNumber(totalValueLocked))
                .multipliedBy(tezPrice)
                .toFixed(2), 3, 3,
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
          <div className={s.detailsHeader}>{t('common|Daily')}</div>
          <div className={s.detailsValue}>
            {prettyPercentage(apyDaily.dividedBy(365))}
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>{t('common|Balance')}</div>
          <div className={s.detailsValue}>
            <FarmingUserMoney money={balance} />
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>{t('common|Deposit')}</div>
          <div className={s.detailsValue}>
            {dexStorage ? (
              <>
                <span className={s.tvl}>$</span>
                {' '}
                <CurrencyAmount amount={fromDecimals(
                  estimateTezInToken(dexStorage, deposit), 6,
                )
                  .multipliedBy(tezPrice)
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
            <Button href={tokenContract} theme="underlined">
              {t('common|Token Contract')}
            </Button>
          </div>
          <div className={s.link}>
            <Button href={farmContract} theme="underlined">
              {t('common|Farm Contract')}
            </Button>
          </div>
          <div className={s.link}>
            <Button href={analyticsLink} theme="underlined">
              {t('common|Analytics')}
            </Button>
          </div>
        </div>
        <Button href={`/stake/${farmId}`} className={s.button}>
          {t('common|Select')}
        </Button>
      </div>
    </Card>
  );
};
