import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Card } from '@shared/components';
import { useTranslation } from '@translation';

import { CoinflipGameForm } from '../coinflip-game-form';
import { useCoinflipGameViewModel } from './coinflip-game.vm';

export const CoinflipGame: FC = observer(() => {
  const { t } = useTranslation(['coinflip']);
  const { tokenToPlay, tokenBalance, game, token, handleSelectCoinSide, handleAmountInputChange, handleFormSubmit } =
    useCoinflipGameViewModel();

  return (
    <Card
      header={{
        content: t('coinflip|selectCoinTitle')
      }}
      data-test-id="farmingDetails"
    >
      <CoinflipGameForm
        token={token}
        amountBalance={tokenBalance}
        tokenToPlay={tokenToPlay}
        coinSide={game.coinSide}
        onCoinSideSelect={handleSelectCoinSide}
        onAmountInputChange={handleAmountInputChange}
        handleSubmit={handleFormSubmit}
      />
    </Card>
  );
});
