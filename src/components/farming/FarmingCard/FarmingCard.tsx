import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import {
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
import { WhitelistedFarm } from '@utils/types';
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
};

export const FarmingCard: React.FC<FarmingCardProps> = ({
  farm,
  className,
  openModal,
}) => {
  const {
    farmId,
    tokenPair,
    totalValueLocked,
    apyDaily,
    tokenContract = '#',
    farmContract = '#',
    projectLink = '#',
    analyticsLink = '#',
    deposit,
    earned,
  } = farm;
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [balance, setBalance] = useState<number>();
  const balances = useBalance();

  useEffect(() => {
    if (balances && balances[+farmId]) {
      setBalance(+prettyPrice(balances[+farmId], 2, 6));
    } else {
      setBalance(undefined);
    }
  }, [balances, farmId]);

  const daily = apyDaily.dividedBy(365);

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
          <Button className={s.link} href={tokenContract} theme="underlined">
            {t('common|Token Contract')}
          </Button>
          <Button className={s.link} href={farmContract} theme="underlined">
            {t('common|Farm Contract')}
          </Button>
          <Button className={s.link} href={projectLink} theme="underlined">
            {t('common|Project Link')}
          </Button>
          <Button className={s.link} href={analyticsLink} theme="underlined">
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
            <CurrencyAmount amount={prettyPrice(+totalValueLocked.toString())} />
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
            {apyDaily.gte(100000) ? `${apyDaily.toExponential(2)}%` : `${apyDaily.toString()}%`}
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>
            {t('common|Daily')}
          </div>
          <div className={s.detailsValue}>
            {daily.lte(0.01) ? '0.01%' : `${daily.toExponential(2)}%`}
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>
            {t('common|Balance')}
          </div>
          <div className={s.detailsValue}>
            <FarmingUserMoney money={balance?.toString()} />
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>
            {t('common|Deposit')}
          </div>
          <div className={s.detailsValue}>
            <FarmingUserMoney money={deposit?.toString()} />
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>Earned</div>
          <div className={s.detailsValue}>
            <FarmingUserMoney money={earned?.toString()} />
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
            <Button href={projectLink} theme="underlined">
              {t('common|Project Link')}
            </Button>
          </div>
          <div className={s.link}>
            <Button href={analyticsLink} theme="underlined">
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
