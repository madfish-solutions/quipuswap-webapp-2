import React, { useContext } from 'react';
import { Button, Card, CurrencyAmount } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { WhitelistedStake } from '@utils/types';
import { TEZOS_TOKEN } from '@utils/defaults';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Tooltip } from '@components/ui/Tooltip';
import { APY } from '@components/svg/APY';
import { ArrowDown } from '@components/svg/ArrowDown';

import s from './StakeCard.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export type StakeCardProps = {
  stake:WhitelistedStake
  openModal: () => void
  className?: string
};

export const StakeCard: React.FC<StakeCardProps> = ({
  stake,
  openModal,
  className,
}) => {
  const {
    tokenPair,
    totalValueLocked,
    apy,
    daily,
    balance,
    deposit,
    earned,
    earn,
    tokenContract,
    farmContract,
    projectLink,
    analyticsLink,
  } = stake;
  const { colorThemeMode } = useContext(ColorThemeContext);

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
            token1={tokenPair.token1}
            token2={tokenPair.token2}
            width={48}
          />
          <h3 className={s.title}>
            {getWhitelistedTokenSymbol(tokenPair.token1)}
            {' '}
            /
            {' '}
            {getWhitelistedTokenSymbol(tokenPair.token1)}
          </h3>
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
        <div className={s.firstBlock}>
          <ArrowDown className={s.arrow} />
          <div className={s.tokenItem}>
            <TokensLogos token1={TEZOS_TOKEN} className={s.tokens} />
            <span className={s.bold600}>Earn</span>
            {' '}
            <span className={s.earn}>{earn}</span>
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>TVL</div>
          <div className={s.detailsValue}>
            <CurrencyAmount
              amount={totalValueLocked}
              currency="$"
              isLeftCurrency
            />
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
            <CurrencyAmount amount={balance} />
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>Deposit</div>
          <div className={s.detailsValue}>
            <CurrencyAmount
              amount={deposit}
              currency="$"
              isLeftCurrency
            />
          </div>
        </div>
        <div className={s.detailsBlock}>
          <div className={s.detailsHeader}>Earned</div>
          <div className={s.detailsValue}>
            <CurrencyAmount
              amount={earned}
              currency="$"
              isLeftCurrency
            />
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
        <Button href={`/stake/${stake.id}`} className={s.button}>Select</Button>
      </div>
    </Card>
  );
};
