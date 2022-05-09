import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Card } from '@shared/components';
import { useTranslation } from '@translation';

import { CoinflipGameForm } from '../coinflip-game-form';
import { CoinflipGameSelect } from '../coinflip-game-select';
import { useCoinflipGameViewModel } from './coinflip-game.vm';

export const CoinflipGame: FC = observer(() => {
  const { t } = useTranslation(['coinflip']);
  const { tokenToPlay, tokenBalance, game, handleSelectCoinSide } = useCoinflipGameViewModel();
  // eslint-disable-next-line no-console
  console.log('x', tokenToPlay, tokenBalance, { ...game });

  return (
    <Card
      header={{
        content: t('coinflip|selectCoinTitle')
      }}
      data-test-id="farmingDetails"
    >
      <CoinflipGameSelect
        tokenToPlay={tokenToPlay}
        coinSide={game.coinSide}
        handleSelectCoinSide={handleSelectCoinSide}
      />
      <CoinflipGameForm />
    </Card>
  );
});
