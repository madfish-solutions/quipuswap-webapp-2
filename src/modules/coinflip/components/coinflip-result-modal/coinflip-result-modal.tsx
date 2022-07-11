import { FC } from 'react';

import BigNumber from 'bignumber.js';

import CoinflipLostImage from '@images/coinflip-lost-modal-image.svg';
import CoinflipSuccesstImage from '@images/coinflip-success-modal-image.svg';
import { useGlobalModalsState } from '@providers/use-global-modals-state';
import { Button, StateCurrencyAmount } from '@shared/components';
import { Modal } from '@shared/modals';
import { useTranslation } from '@translation';

import styles from './coinflip-result-modal.module.scss';

interface Props {
  isResultSuccess: boolean;
  wonAmount?: BigNumber.Value;
  currency?: string;
}

export const CoinflipResultModal: FC<Props> = ({ isResultSuccess, wonAmount, currency }) => {
  const { t } = useTranslation();
  const { coinflipModalOpen, closeCoinflipsModal } = useGlobalModalsState();

  const title = isResultSuccess ? t('coinflip|congratulations') : t('coinflip|youLost');
  const imageSrc = isResultSuccess ? CoinflipSuccesstImage : CoinflipLostImage;
  const imageAlt = isResultSuccess ? 'Coinflip success result' : 'Coinflip lost result';
  const subTitle = isResultSuccess ? t('coinflip|wonRound') : t('coinflip|youLost');

  return (
    <Modal
      isOpen={coinflipModalOpen}
      title={title}
      className={styles.root}
      contentClassName={styles.contentClassName}
      modalClassName={styles.modalClassName}
      onRequestClose={closeCoinflipsModal}
    >
      <img className={styles.img} src={imageSrc} alt={imageAlt} />
      <div className={styles.bottomContent}>
        <span>{subTitle}</span>
        {isResultSuccess ? (
          <StateCurrencyAmount className={styles.h4} amount={wonAmount} currency={currency} />
        ) : (
          <h4 className={styles.h4}>{t('coinflip|oneMoreTime')}</h4>
        )}
        <Button className={styles.button} onClick={closeCoinflipsModal}>
          {t('coinflip|Ok')}
        </Button>
      </div>
    </Modal>
  );
};
