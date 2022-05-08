import { FC } from 'react';

import { Card } from '@shared/components';
import { useTranslation } from '@translation';

import { CoinflipGameForm } from '../coinflip-game-form';
import { CoinflipGameSelect } from '../coinflip-game-select';

export const CoinflipGame: FC = () => {
  const { t } = useTranslation(['coinflip']);

  return (
    <Card
      header={{
        content: t('coinflip|selectCoinTitle')
      }}
      data-test-id="farmingDetails"
    >
      <CoinflipGameSelect />
      <CoinflipGameForm />
    </Card>
  );
};
