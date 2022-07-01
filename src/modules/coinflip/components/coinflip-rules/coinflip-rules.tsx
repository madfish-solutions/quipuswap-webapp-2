import { FC } from 'react';

import cx from 'classnames';

import { Card } from '@shared/components';

import styles from './coinflip-rules.module.scss';

export const CoinflipRules: FC = () => {
  return (
    <Card
      header={{ content: <>Play Coinflip - get a chance to double your bid!</> }}
      contentClassName={styles.content}
      className={styles.root}
    >
      <div>
        <h3 className={styles.h3}>How to play?</h3>
        <ol className={cx(styles.list, styles.ol)}>
          <li>Pick a token (Tez or QUIPU for now).</li>
          <li>Submit your bet.</li>
          <li>Wait for a few blocks (3 minutes on average) for the game results to be processed.</li>
          <li>
            If you win, you will get almost double your bid. Your winnings will be sent automatically. The rewards are
            calculated as bid_size * payout_coeficient.
          </li>
          <li>If you lose - your bid is gone and your tokens move to the Rewards pool.</li>
        </ol>
      </div>
      <div>
        <h3 className={styles.h3}>Rules of the Game</h3>
        <ul className={cx(styles.list, styles.ul)}>
          <li>
            All rewards are paid from the Rewards pool. All lost bets of users and tokens that are added by the project
            team fall into this pool. Note that you can not make a bid that is greater than XX% of the rewards pool for
            obvious reasons.
          </li>
          <li>
            We don't actually flip a coin. The flip's result is determined by an algorithm that derives a random number
            from the hash of the block that includes the bidder's transaction.
          </li>
          <li>
            The network fees for bids will be only marginally higher than the average transaction cost (around __), and
            a user will pay them. We need this to prevent DDoS attacks on Coin Flip.
          </li>
          <li>In the future, the team may change certain elements of the game as it sees fit.</li>
        </ul>
      </div>
    </Card>
  );
};
