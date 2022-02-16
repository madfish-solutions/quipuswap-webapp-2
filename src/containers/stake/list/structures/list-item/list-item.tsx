import { FC } from 'react';

import { Card } from '@quipuswap/ui-kit';

import { StakeItem } from '@api/staking';
import { Tooltip } from '@components/ui/components/tooltip';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { getTokensPairName, getTokenSymbol, isExist } from '@utils/helpers';

import { ListItemCardCell, RewardTarget, TokensLogosAndSymbols } from '../../components';
import { StakeStatus } from '../../components/stake-status';
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

const APY = 'APY';
const APY_TOOLTIP = 'apy tooltip';

export const StakeListItem: FC<StakeItem> = ({
  id,
  tokenA,
  tokenB,
  stakeStatus,
  rewardToken,
  tvl,
  apr,
  apy,
  depositExhangeRate
}) => {
  const isPairFull = isExist(tokenB);

  const depositTokenSymbol = isPairFull ? getTokensPairName(tokenA, tokenB) : getTokenSymbol(tokenA);

  const tvlDollarEquivalent = getDollarEquivalent(tvl, depositExhangeRate);

  const aprAmount = `${apr}%`;
  const apyAmount = `${apy}%`;

  const selectLink = `stake/${id}`;

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
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.links}>
            <Button href={'todo'} external theme={LINKS_THEME} title={TOKEN_CONTRACT}>
              {TOKEN_CONTRACT}
            </Button>

            <Button href={'todo'} external theme={LINKS_THEME} title={STAKE_CONTRACT}>
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
