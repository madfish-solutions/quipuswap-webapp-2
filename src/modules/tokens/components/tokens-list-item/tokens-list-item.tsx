import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { useDollarEquivalent } from '@providers/use-dollar-equivalent';
import { Button, LabelComponent, StateCurrencyAmount, Switcher, TokensLogos } from '@shared/components';
import { FavoriteButton } from '@shared/elements';
import { getTokenName, getTokenSymbol } from '@shared/helpers';
import { useTokenBalance } from '@shared/hooks';
import { ActiveStatus, ManagedToken, Noop } from '@shared/types';

import styles from './tokens-list-item.module.scss';

interface Props {
  token: ManagedToken;
  onHideClick: Noop;
  onFavoriteClick: Noop;
}

const TOKEN_NAME_MAX_LENGTH = 100;

export const TokensListItem: FC<Props> = observer(({ token, onHideClick, onFavoriteClick }) => {
  const tokenBalance = useTokenBalance(token);
  const dollarEquivalent = useDollarEquivalent(token, tokenBalance);

  return (
    <div className={styles.item}>
      <TokensLogos width={48} tokens={token} />
      <div className={styles.tokenDescription}>
        <h6 className={styles.tokenSymbol}>{getTokenSymbol(token, TOKEN_NAME_MAX_LENGTH)}</h6>
        <div className={styles.tokenName}>{getTokenName(token, TOKEN_NAME_MAX_LENGTH)}</div>
      </div>
      <div className={styles.labels}>
        {token.categories?.map(category => (
          <LabelComponent label={category} status={ActiveStatus.ACTIVE} />
        ))}
      </div>
      <div className={styles.balance}>
        {tokenBalance && tokenBalance.gt('0') && (
          <StateCurrencyAmount
            amount={tokenBalance}
            dollarEquivalent={dollarEquivalent}
            amountClassName={styles.amountClassName}
          />
        )}
      </div>
      <div className={styles.buttonsBlock}>
        <div className={styles.buttons}>
          <Button className={styles.button} onClick={onFavoriteClick}>
            Swap
          </Button>
          <Button className={styles.button} onClick={onFavoriteClick}>
            Invest
          </Button>
          <Button className={styles.button} onClick={onFavoriteClick}>
            Farm
          </Button>
          <Button className={styles.button} onClick={onFavoriteClick}>
            Borrow
          </Button>
        </div>
        <Switcher onClick={onHideClick} value={!Boolean(token.isHidden)} />
        <FavoriteButton checked={Boolean(token.isFavorite)} onClick={onFavoriteClick} />
      </div>
    </div>
  );
});
