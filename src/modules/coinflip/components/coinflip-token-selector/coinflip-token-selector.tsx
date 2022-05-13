import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Card } from '@shared/components';
import { QuipuToken } from '@shared/svg';
import { XtzToken } from '@shared/svg/xtz-token';
import { useTranslation } from '@translation';

import { TokenToPlay } from '../../stores';
import { ButtonsSelector } from '../buttons-selector';
import styles from './coinflip-token-selector.module.scss';
import { useTokenSelectorViewModel } from './coinflip-token-selector.vm';

export const CoinflipTokenSelector: FC = observer(() => {
  const { t } = useTranslation(['coinflip']);
  const { tokenToPlay, handleSelectToken } = useTokenSelectorViewModel();

  return (
    <Card
      header={{
        content: t('coinflip|selectTokenToPlayWith')
      }}
      className={styles.root}
      data-test-id="CoinflipTokenSelector"
    >
      <div className={styles.content}>
        <ButtonsSelector
          buttons={[
            {
              id: TokenToPlay.Tezos,
              label: TokenToPlay.Tezos,
              Icon: XtzToken
            },
            {
              id: TokenToPlay.Quipu,
              label: TokenToPlay.Quipu,
              Icon: QuipuToken
            }
          ]}
          activeId={tokenToPlay}
          onChange={handleSelectToken}
        />
      </div>
    </Card>
  );
});
