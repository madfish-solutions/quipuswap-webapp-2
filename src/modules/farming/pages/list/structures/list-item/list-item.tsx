import { FC, useContext } from 'react';

import cx from 'classnames';
import { Link } from 'react-router-dom';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Card, StateCurrencyAmount, StatusLabel } from '@shared/components';
import {
  getDollarEquivalent,
  getTimeLockDescription,
  getTokensPairName,
  getTokenSymbol,
  isExist
} from '@shared/helpers';

import { isNewFarming } from '../../../../helpers/is-new-farming';
import { FarmingItem } from '../../../../interfaces';
import { NewLabel } from '../../../item/components/new-label';
import { ListItemCardCell, RewardTarget, TokensLogosAndSymbols } from '../../components';
import styles from './list-item.module.scss';
import { useListItemViewModal } from './use-list-item.vm';

const ICON_SIZE = 48;
const ZERO = 0;

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const FarmingListItem: FC<FarmingItem> = ({
  id,
  tokenA,
  tokenB,
  stakeStatus,
  rewardToken,
  tvlInStakedToken: tvl,
  tvlInUsd: tvlDollarEquivalent,
  apr,
  apy,
  depositExchangeRate,
  earnExchangeRate,
  myBalance,
  depositBalance,
  earnBalance,
  timelock,
  withdrawalFee
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { translation } = useListItemViewModal();

  const {
    tvlTranslation,
    tvlTooltipTranslation,
    aprTranslation,
    aprTooltipTranslation,
    apyTranslation,
    apyTooltipTranslation,
    yourDepositTranslation,
    yourDepositTooltipTranslation,
    yourEarnedTranslation,
    yourEarnedTooltipTranslation
  } = translation;

  const isPairFull = isExist(tokenB);
  const depositTokenSymbol = isPairFull ? getTokensPairName(tokenA, tokenB) : getTokenSymbol(tokenA);

  const selectLink = `${id}`;

  const isNew = isNewFarming(id);

  const myDepositDollarEquivalent = getDollarEquivalent(depositBalance, depositExchangeRate);
  const MyEarnTokenSymbol = getTokenSymbol(rewardToken);
  const myEarnDollarEquivalent = getDollarEquivalent(earnBalance, earnExchangeRate);

  const isAllowUserData = Boolean(
    (myBalance && !myBalance.isZero()) ||
      (depositBalance && !depositBalance.isZero) ||
      (earnBalance && !earnBalance.isZero())
  );

  const timeLockLabel = getTimeLockDescription(timelock);
  const shouldShowLockPeriod = !!Number(timelock);

  const withdrawalFeeLabel = withdrawalFee.toFixed();
  const shouldShowWithdrawalFee = !withdrawalFee.eq(ZERO);

  return (
    <Link to={selectLink}>
      <Card className={cx(styles.card, themeClass[colorThemeMode])}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.tokensLogosAndSymbolsWrapper}>
              <TokensLogosAndSymbols width={ICON_SIZE} tokenA={tokenA} tokenB={tokenB} />
            </div>

            <div className={styles.rewardTarget}>
              <RewardTarget token={rewardToken} />
            </div>

            <div className={styles.tags}>
              <div className={styles.tagsWithTooltip}>
                {shouldShowLockPeriod && <StatusLabel label={`${timeLockLabel} LOCK`} status={stakeStatus} />}
                {shouldShowWithdrawalFee && (
                  <StatusLabel label={`${withdrawalFeeLabel}% UNLOCK FEE`} status={stakeStatus} />
                )}
              </div>

              <StatusLabel status={stakeStatus} filled />

              {isNew && <NewLabel />}
            </div>
          </div>

          <div className={styles.bottom}>
            <div className={styles.stats}>
              <div className={styles.stakeStats}>
                <ListItemCardCell
                  cellName={tvlTranslation}
                  tooltip={tvlTooltipTranslation}
                  cellNameClassName={styles.CardCellHeader}
                  cardCellClassName={styles.cardCell}
                >
                  <StateCurrencyAmount
                    amount={tvl}
                    currency={depositTokenSymbol}
                    dollarEquivalent={tvlDollarEquivalent}
                    dollarEquivalentOnly
                  />
                </ListItemCardCell>

                <ListItemCardCell
                  cellName={aprTranslation}
                  tooltip={aprTooltipTranslation}
                  cellNameClassName={styles.CardCellHeader}
                  cardCellClassName={styles.cardCell}
                >
                  <StateCurrencyAmount amount={apr} currency="%" isError={!apr} amountDecimals={2} />
                </ListItemCardCell>

                <ListItemCardCell
                  cellName={apyTranslation}
                  tooltip={apyTooltipTranslation}
                  cellNameClassName={styles.CardCellHeader}
                  cardCellClassName={styles.cardCell}
                >
                  <StateCurrencyAmount amount={apy} currency="%" isError={!apr} amountDecimals={2} />
                </ListItemCardCell>
              </div>
              {isAllowUserData && (
                <div className={styles.userData}>
                  <ListItemCardCell
                    cellName={yourDepositTranslation}
                    tooltip={yourDepositTooltipTranslation}
                    cellNameClassName={styles.CardCellHeader}
                    cardCellClassName={styles.cardCell}
                  >
                    <StateCurrencyAmount
                      amount={depositBalance}
                      currency={depositTokenSymbol}
                      dollarEquivalent={myDepositDollarEquivalent}
                      isError={!depositBalance}
                      dollarEquivalentOnly
                    />
                  </ListItemCardCell>

                  <ListItemCardCell
                    cellName={yourEarnedTranslation}
                    tooltip={yourEarnedTooltipTranslation}
                    cellNameClassName={styles.CardCellHeader}
                    cardCellClassName={styles.cardCell}
                  >
                    <StateCurrencyAmount
                      amount={earnBalance}
                      currency={MyEarnTokenSymbol}
                      dollarEquivalent={myEarnDollarEquivalent}
                      isError={!earnBalance}
                      dollarEquivalentOnly
                    />
                  </ListItemCardCell>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
