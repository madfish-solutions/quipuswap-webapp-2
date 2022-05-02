import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button, Card, ListItemCardCell, StateCurrencyAmount, StatusLabel, Tooltip } from '@shared/components';
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
import { RewardTarget, TokensLogosAndSymbols } from '../../components';
import styles from './list-item.module.scss';
import { useListItemViewModal } from './use-list-item.vm';

const ICON_SIZE = 48;
const ZERO = 0;
const LINKS_THEME = 'underlined';

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
  stakeUrl,
  depositTokenUrl,
  myBalance,
  depositBalance,
  earnBalance,
  timelock,
  withdrawalFee
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { translation } = useListItemViewModal();

  const {
    selectTranslation,
    fullCardTooltipTranslation,
    tokenContractTranslation,
    farmingContractTranslation,
    tvlTranslation,
    tvlTooltipTranslation,
    aprTranslation,
    aprTooltipTranslation,
    apyTranslation,
    apyTooltipTranslation,
    yourBalanceTranslation,
    yourBalanceTooltipTranslation,
    yourDepositTranslation,
    yourDepositTooltipTranslation,
    yourEarnedTranslation,
    yourEarnedTooltipTranslation
  } = translation;

  const isPairFull = isExist(tokenB);
  const depositTokenSymbol = isPairFull ? getTokensPairName(tokenA, tokenB) : getTokenSymbol(tokenA);

  const selectLink = `${id}`;

  const isNew = isNewFarming(id);

  const myBalanceDollarEquivalent = getDollarEquivalent(myBalance, depositExchangeRate);
  const myDepositDollarEquivalent = getDollarEquivalent(depositBalance, depositExchangeRate);
  const MyEarnTokenSymbol = getTokenSymbol(rewardToken);
  const myEarnDollarEquivalent = getDollarEquivalent(earnBalance, earnExchangeRate);

  const isAllowUserData = Boolean(myBalance || depositBalance || earnBalance);

  const timeLockLabel = getTimeLockDescription(timelock);
  const shouldShowLockPeriod = !!Number(timelock);

  const withdrawalFeeLabel = withdrawalFee.toFixed();
  const shouldShowWithdrawalFee = !withdrawalFee.eq(ZERO);

  return (
    <Card className={cx(styles.card, themeClass[colorThemeMode])} data-test-id={`farming-item-${id}`}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.itemLeftHeader}>
            <div className={styles.iconWithStatusLabel}>
              <TokensLogosAndSymbols width={ICON_SIZE} tokenA={tokenA} tokenB={tokenB} />
              <StatusLabel status={stakeStatus} filled data-test-id="stakeStatus" />
            </div>
            <div className={styles.tagsWithTooltip}>
              {shouldShowLockPeriod && (
                <StatusLabel label={`${timeLockLabel} LOCK`} status={stakeStatus} data-test-id="timeLockLabel" />
              )}
              {shouldShowWithdrawalFee && (
                <StatusLabel
                  label={`${withdrawalFeeLabel}% UNLOCK FEE`}
                  status={stakeStatus}
                  data-test-id="withdrawalFeeLabel"
                />
              )}
              <Tooltip className={styles.tooltip} content={fullCardTooltipTranslation} />
            </div>
          </div>

          <div className={styles.rewardTarget}>
            <RewardTarget token={rewardToken} />
          </div>

          <div className={styles.stats}>
            <div className={styles.stakeStats}>
              <ListItemCardCell
                cellName={tvlTranslation}
                tooltip={tvlTooltipTranslation}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
                data-test-id="TVL"
              >
                <StateCurrencyAmount
                  amount={tvl}
                  currency={depositTokenSymbol}
                  dollarEquivalent={tvlDollarEquivalent}
                />
              </ListItemCardCell>

              <ListItemCardCell
                cellName={aprTranslation}
                tooltip={aprTooltipTranslation}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
                data-test-id="APR"
              >
                <StateCurrencyAmount amount={apr} currency="%" isError={!apr} />
              </ListItemCardCell>

              <ListItemCardCell
                cellName={apyTranslation}
                tooltip={apyTooltipTranslation}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
                data-test-id="APY"
              >
                <StateCurrencyAmount amount={apy} currency="%" isError={!apr} />
              </ListItemCardCell>
            </div>
            {isAllowUserData && (
              <div className={styles.userData}>
                <ListItemCardCell
                  cellName={yourBalanceTranslation}
                  tooltip={yourBalanceTooltipTranslation}
                  cellNameClassName={styles.CardCellHeader}
                  cardCellClassName={styles.cardCell}
                  data-test-id="yourBalance"
                >
                  <StateCurrencyAmount
                    amount={myBalance}
                    currency={depositTokenSymbol}
                    dollarEquivalent={myBalanceDollarEquivalent}
                    isError={!myBalance}
                  />
                </ListItemCardCell>

                <ListItemCardCell
                  cellName={yourDepositTranslation}
                  tooltip={yourDepositTooltipTranslation}
                  cellNameClassName={styles.CardCellHeader}
                  cardCellClassName={styles.cardCell}
                  data-test-id="yourDeposit"
                >
                  <StateCurrencyAmount
                    amount={depositBalance}
                    currency={depositTokenSymbol}
                    dollarEquivalent={myDepositDollarEquivalent}
                    isError={!depositBalance}
                  />
                </ListItemCardCell>

                <ListItemCardCell
                  cellName={yourEarnedTranslation}
                  tooltip={yourEarnedTooltipTranslation}
                  cellNameClassName={styles.CardCellHeader}
                  cardCellClassName={styles.cardCell}
                  data-test-id="yourEarned"
                >
                  <StateCurrencyAmount
                    amount={earnBalance}
                    currency={MyEarnTokenSymbol}
                    dollarEquivalent={myEarnDollarEquivalent}
                    isError={!earnBalance}
                  />
                </ListItemCardCell>
              </div>
            )}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.links}>
            <Button
              href={depositTokenUrl}
              external
              theme={LINKS_THEME}
              title={tokenContractTranslation}
              data-test-id="tokenContractButton"
            >
              {tokenContractTranslation}
            </Button>

            <Button
              href={stakeUrl}
              external
              theme={LINKS_THEME}
              title={farmingContractTranslation}
              data-test-id="farmingContractButton"
            >
              {farmingContractTranslation}
            </Button>

            {isNew && <NewLabel />}
          </div>

          <Button className={styles.button} href={selectLink} data-test-id="selectButton">
            {selectTranslation}
          </Button>
        </div>
      </div>
    </Card>
  );
};
