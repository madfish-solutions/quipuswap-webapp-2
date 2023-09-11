import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Card } from '@shared/components';
import { useTranslation } from '@translation';

import { useCoinflipGameViewModel } from './coinflip-game.vm';
import { CoinflipGameForm } from '../coinflip-game-form';

export const CoinflipGame: FC = observer(() => {
  const { t } = useTranslation(['coinflip']);
  const {
    isLoading,
    tokenToPlay,
    tokenBalance,
    game,
    payout,
    token,
    handleSelectCoinSide,
    handleAmountInputChange,
    handleFormSubmit
  } = useCoinflipGameViewModel();

  return (
    <Card
      header={{
        content: t('coinflip|selectCoinTitle')
      }}
      data-test-id="coinflipDetails"
    >
      <CoinflipGameForm
        isLoading={isLoading}
        token={token}
        amountBalance={tokenBalance}
        payout={payout}
        tokenToPlay={tokenToPlay}
        coinSide={game.coinSide}
        onCoinSideSelect={handleSelectCoinSide}
        onAmountInputChange={handleAmountInputChange}
        handleSubmit={handleFormSubmit}
      />
    </Card>
  );
});
