import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Button, Card } from '@shared/components';
import { useTranslation } from '@translation';

import { TokenToPlay } from '../../stores';
import styles from './coinflip-token-selector.module.scss';
import { useTokenSelectorViewModel } from './coinflip-token-selector.vm';

export const CoinflipTokenSelector: FC = observer(() => {
  const { t } = useTranslation(['coinflip']);
  const { tokenToPlay, token, handleSelectToken } = useTokenSelectorViewModel();
  // eslint-disable-next-line no-console
  console.log('q', tokenToPlay, token);

  const isTez = tokenToPlay === TokenToPlay.Tezos;
  const isQuipu = tokenToPlay === TokenToPlay.Quipu;

  return (
    <Card
      header={{
        content: t('coinflip|selectTokenToPlayWith')
      }}
      className={styles.root}
      data-test-id="CoinflipTokenSelector"
    >
      <div className={styles.content}>
        <Button onClick={() => handleSelectToken(TokenToPlay.Tezos)} theme={isTez ? 'primary' : 'secondary'}>
          Tezos
        </Button>
        <Button onClick={() => handleSelectToken(TokenToPlay.Quipu)} theme={isQuipu ? 'primary' : 'secondary'}>
          Quipu
        </Button>
      </div>
    </Card>
  );
});
