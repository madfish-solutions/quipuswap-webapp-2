import React, { useContext } from 'react';
import {
  APY,
  Bage,
  Card,
  Button,
  Tooltip,
  ColorModes,
  TokensLogos,
  CurrencyAmount,
  ColorThemeContext,
} from '@quipuswap/ui-kit';
import cx from 'classnames';

import { getWhitelistedTokenSymbol, prepareTokenLogo } from '@utils/helpers';
import { WhitelistedFarm } from '@utils/types';

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
    id,
    tokenPair,
    totalValueLocked,
    apy,
    daily,
    balance,
    deposit,
    earned,
    multiplier,
    tokenContract,
    farmContract,
    projectLink,
    analyticsLink,
  } = farm;
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Card
      className={cx(className, s.card)}
      contentClassName={cx(s.content, modeClass[colorThemeMode])}
    >
      <div className={s.header}>
        <div className={s.tokens}>
          <TokensLogos
            imageClassName={s.image}
            firstTokenIcon={prepareTokenLogo(tokenPair.token1.metadata.thumbnailUri)}
            firstTokenSymbol={getWhitelistedTokenSymbol(tokenPair.token1)}
            secondTokenIcon={prepareTokenLogo(tokenPair.token2.metadata.thumbnailUri)}
            secondTokenSymbol={getWhitelistedTokenSymbol(tokenPair.token2)}
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
        <Bage className={s.multiplierWrap} innerClassName={s.multiplier} text={`X ${multiplier}`} />
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
        <Button href={`/farm/${id}`} className={s.button}>Select</Button>
      </div>
    </Card>
  );
};
