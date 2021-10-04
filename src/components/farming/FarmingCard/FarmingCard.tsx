import React, { useContext, useEffect, useState } from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';

import { WhitelistedFarmOptional } from '@utils/types';
import {
  fromDecimals,
  getWhitelistedTokenSymbol,
  prettyPrice,
} from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { useUserInfoInAllFarms } from '@hooks/useUserInfoInAllFarms';
import { useBalance } from '@hooks/useBalance';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Tooltip } from '@components/ui/Tooltip';
import { Bage } from '@components/ui/Bage';
import { APY } from '@components/svg/APY';
import { FarmingUserMoney } from '../FarmingUserMoney/FarmingUserMoney';

import s from './FarmingCard.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export type FarmingCardProps = {
  farm:WhitelistedFarmOptional
  className?: string
  openModal?:() => void
};

export const FarmingCard: React.FC<FarmingCardProps> = ({
  farm,
  className,
  openModal,
}) => {
  const {
    id,
    tokenPair,
    totalValueLocked,
    apy,
    daily,
    multiplier,
    tokenContract,
    farmContract,
    projectLink,
    analyticsLink,
  } = farm;
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [deposit, setDeposit] = useState<BigNumber>();
  const [earned, setEarned] = useState<BigNumber>();
  const [balance, setBalance] = useState<number>();
  const userInfoInAllFarms = useUserInfoInAllFarms();
  const balances = useBalance();

  useEffect(() => {
    if (userInfoInAllFarms && userInfoInAllFarms[id]) {
      setDeposit(fromDecimals(userInfoInAllFarms[id].staked ?? new BigNumber(0), 6));
      setEarned(fromDecimals(userInfoInAllFarms[id].earned ?? new BigNumber(0), 6));
    } else {
      setDeposit(undefined);
      setEarned(undefined);
    }
  }, [userInfoInAllFarms, id]);

  useEffect(() => {
    if (balances && balances[id]) {
      setBalance(+prettyPrice(balances[id], 2, 6));
    } else {
      setBalance(undefined);
    }
  }, [balances, id]);

  console.log({ balances });

  return (
    <Card
      className={cx(className, s.card)}
      contentClassName={cx(s.content, modeClass[colorThemeMode])}
    >
      <div className={s.header}>
        <div className={s.tokens}>
          <TokensLogos
            token1={tokenPair.token1}
            token2={tokenPair.token2}
            width={32}
            className={s.tokenLogos}
          />
          <h5 className={s.title}>
            {getWhitelistedTokenSymbol(tokenPair.token1)}
            {' '}
            /
            {' '}
            {getWhitelistedTokenSymbol(tokenPair.token2 ?? tokenPair.token1)}
          </h5>
          <Tooltip sizeT="small" content="TVL (Total Value Locked) represents the total amount of a specific token locked on QuiuSwap across different pools." />

        </div>
        <div className={cx(s.links, s.onlyDesktop)}>
          <Button className={s.link} href={tokenContract} theme="underlined">
            Token Contract
          </Button>
          <Button className={s.link} href={farmContract} theme="underlined">
            Farm Contract
          </Button>
          <Button className={s.link} href={projectLink} theme="underlined">
            Project Link
          </Button>
          <Button className={s.link} href={analyticsLink} theme="underlined">
            Analytics
          </Button>
        </div>

      </div>
      <div className={s.footer}>
        <div className={s.row}>
          <Bage className={s.multiplierWrap} innerClassName={s.multiplier} text={`X ${multiplier}`} />

        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>TVL</div>
          <div className={cx(s.detailsValue, s.dollar)}>
            <CurrencyAmount className={s.farmingDigits} amount={totalValueLocked} />
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>
            APY
            {' '}
            <Button theme="quaternary" className={s.apyIcon} onClick={openModal}>
              <APY />
            </Button>
          </div>
          <div className={s.detailsValue}>
            {apy}
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>Daily</div>
          <div className={s.detailsValue}>
            {daily}
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>Balance</div>
          <div className={s.detailsValue}>
            <FarmingUserMoney money={balance?.toString()} />
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>Deposit</div>
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
              Token Contract
            </Button>
          </div>
          <div className={s.link}>
            <Button href={farmContract} theme="underlined">
              Farm Contract
            </Button>
          </div>
          <div className={s.link}>
            <Button href={projectLink} theme="underlined">
              Project Link
            </Button>
          </div>
          <div className={s.link}>
            <Button href={analyticsLink} theme="underlined">
              Analytics
            </Button>
          </div>
        </div>
        <Button href={`/farm/${id}`} className={s.button}>Select</Button>

      </div>
    </Card>
  );
};
