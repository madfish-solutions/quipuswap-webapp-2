import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { getGameResult, Statuses } from '@modules/coinflip/helpers';
import { Status } from '@modules/coinflip/interfaces';
import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { Button, StateCurrencyAmount } from '@shared/components';
import { isNull } from '@shared/helpers';
import { Modal } from '@shared/modals';
import { CoinflipFailResultSvg, CoinflipSuccessResultSvg } from '@shared/svg';
import { useTranslation } from '@translation';

import styles from './coinflip-result-modal.module.scss';

interface Props {
  result: Nullable<Status>;
  wonAmount?: Nullable<BigNumber.Value>;
  currency?: string;
}

export const CoinflipResultModal: FC<Props> = ({ result, wonAmount, currency }) => {
  const { t } = useTranslation();
  const { coinflipModalOpen, closeCoinflipModal } = useGlobalModalsState();

  if (isNull(result)) {
    return null;
  }

  const gameResult = getGameResult(result);
  const isResultSuccess = gameResult === Statuses.won;

  const title = isResultSuccess ? t('coinflip|congratulations') : t('coinflip|youLost');
  const subTitle = isResultSuccess ? t('coinflip|wonRound') : t('coinflip|youLost');

  return (
    <Modal
      isOpen={coinflipModalOpen}
      title={title}
      className={styles.root}
      contentClassName={styles.contentClassName}
      modalClassName={styles.modalClassName}
      onRequestClose={closeCoinflipModal}
    >
      {isResultSuccess ? (
        <CoinflipSuccessResultSvg className={styles.img} />
      ) : (
        <CoinflipFailResultSvg className={styles.img} />
      )}
      <div className={styles.bottomContent}>
        <span>{subTitle}</span>
        {isResultSuccess ? (
          <StateCurrencyAmount className={styles.h4} amount={wonAmount} currency={currency} />
        ) : (
          <h4 className={styles.h4}>{t('coinflip|oneMoreTime')}</h4>
        )}
        <Button className={styles.button} onClick={closeCoinflipModal}>
          {t('coinflip|Ok')}
        </Button>
      </div>
    </Modal>
  );
};
