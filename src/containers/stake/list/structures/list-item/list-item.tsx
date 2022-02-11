import { FC } from 'react';

import { Card } from '@quipuswap/ui-kit';

import { Tooltip } from '@components/ui/components/tooltip';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { useAccountPkh } from '@utils/dapp';
import { getTokenPairSlug, getTokenSlug, getTokensPairName, getTokenSymbol, isExist } from '@utils/helpers';
import { Token } from '@utils/types';

import { ListItemCardCell, RewardTarget, TokensLogosAndSymbols } from '../../elements';
import { eStakeStatus, StakeStatus } from '../../elements/stake-status';
import { getDollarEquivalent } from '../../helpers';
import styles from './list-item.module.scss';

const ICON_SIZE = 48;

const SELECT = 'Select';

const FULL_CARD_TOOLTIP_TEXT = 'This is text';

const TOKEN_CONTRACT = 'Token contract';
const STAKE_CONTRACT = 'Farm Contract';
const LINKS_THEME = 'underlined';

const TVL = 'TVL';
const TVL_TOOLTIP = 'tvl tooltip';

const APR = 'APR';
const APR_TOOLTIP = 'apr tooltip';

const APY = 'My Balance';
const APY_TOOLTIP = 'apy tooltip';

const MY_BALANCE = 'My Balance';
const MY_BALANCE_TOOLTIP = 'My Balance tooltip';

const MY_DEPOSIT = 'My Deposit';
const MY_DEPOSIT_TOOLTIP = 'My Deposit tooltip';

const MY_EARNED = 'My Earned';
const MY_EARNED_TOOLTIP = 'My Erned tooltip';

interface Props {
  tokenA: Token;
  tokenB: Token;
  stakeStatus: eStakeStatus;
  rewardToken: Token;
  tvl: string;
  apr: number;
  apy: number;
  myBalance: string;
  depositBalance: string;
  earnBalance: string;
  depositExhangeRate: string;
  earnExhangeRate: string;
  stakeUrl: string;
  depositTokenUrl: string;
}

export const StakeListItem: FC<Props> = ({
  tokenA,
  tokenB,
  stakeStatus,
  rewardToken,
  tvl,
  apr,
  apy,
  myBalance,
  depositBalance,
  earnBalance,
  depositExhangeRate,
  earnExhangeRate,
  stakeUrl,
  depositTokenUrl
}) => {
  const accountPkh = useAccountPkh();

  const isPairFull = isExist(tokenB);

  const depositTokenSymbol = isPairFull ? getTokensPairName(tokenA, tokenB) : getTokenSymbol(tokenA);

  const tvlDollarEquivalent = getDollarEquivalent(tvl, depositExhangeRate);

  const aprAmount = `${apr}%`;
  const apyAmount = `${apy}%`;

  const myBalanceDollarEquivalent = getDollarEquivalent(myBalance, depositExhangeRate);

  const myDepositDollarEquivalent = getDollarEquivalent(depositBalance, depositExhangeRate);

  const MyEarnTokenSymbol = getTokenSymbol(rewardToken);
  const myEarnDollarEquivalent = getDollarEquivalent(earnBalance, earnExhangeRate);

  const selectLink = isPairFull ? `stake/${getTokenPairSlug(tokenA, tokenB)}` : getTokenSlug(tokenA);

  return (
    <Card className={styles.card}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.itemLeftHeader}>
            <TokensLogosAndSymbols width={ICON_SIZE} tokenA={tokenA} tokenB={tokenB} />
            <StakeStatus status={stakeStatus} />
            <Tooltip className={styles.tooltip} content={FULL_CARD_TOOLTIP_TEXT} />
          </div>

          <div className={styles.rewardTarget}>
            <RewardTarget token={rewardToken} />
          </div>

          <div className={styles.stats}>
            <div className={styles.stakeStats}>
              <ListItemCardCell
                cellName={TVL}
                tooltip={TVL_TOOLTIP}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
              >
                <StateCurrencyAmount
                  balanceRule
                  amount={tvl}
                  currency={depositTokenSymbol}
                  dollarEquivalent={tvlDollarEquivalent}
                />
              </ListItemCardCell>

              <ListItemCardCell
                cellName={APR}
                tooltip={APR_TOOLTIP}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
              >
                {aprAmount}
              </ListItemCardCell>

              <ListItemCardCell
                cellName={APY}
                tooltip={APY_TOOLTIP}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
              >
                {apyAmount}
              </ListItemCardCell>
            </div>

            {accountPkh && (
              <div className={styles.userData}>
                <ListItemCardCell
                  cellName={MY_BALANCE}
                  tooltip={MY_BALANCE_TOOLTIP}
                  cellNameClassName={styles.CardCellHeader}
                  cardCellClassName={styles.cardCell}
                >
                  <StateCurrencyAmount
                    balanceRule
                    amount={myBalance}
                    currency={depositTokenSymbol}
                    dollarEquivalent={myBalanceDollarEquivalent}
                  />
                </ListItemCardCell>

                <ListItemCardCell
                  cellName={MY_DEPOSIT}
                  tooltip={MY_DEPOSIT_TOOLTIP}
                  cellNameClassName={styles.CardCellHeader}
                  cardCellClassName={styles.cardCell}
                >
                  <StateCurrencyAmount
                    balanceRule
                    amount={depositBalance}
                    currency={depositTokenSymbol}
                    dollarEquivalent={myDepositDollarEquivalent}
                  />
                </ListItemCardCell>

                <ListItemCardCell
                  cellName={MY_EARNED}
                  tooltip={MY_EARNED_TOOLTIP}
                  cellNameClassName={styles.CardCellHeader}
                  cardCellClassName={styles.cardCell}
                >
                  <StateCurrencyAmount
                    balanceRule
                    amount={earnBalance}
                    currency={MyEarnTokenSymbol}
                    dollarEquivalent={myEarnDollarEquivalent}
                  />
                </ListItemCardCell>
              </div>
            )}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.links}>
            <Button href={depositTokenUrl} external theme={LINKS_THEME} title={TOKEN_CONTRACT}>
              {TOKEN_CONTRACT}
            </Button>

            <Button href={stakeUrl} external theme={LINKS_THEME} title={STAKE_CONTRACT}>
              {STAKE_CONTRACT}
            </Button>
          </div>

          <Button className={styles.button} href={selectLink}>
            {SELECT}
          </Button>
        </div>
      </div>
    </Card>
  );
};
