import { FC } from 'react';

import { AppRootRoutes } from '@app.router';
import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { Button } from '@shared/components';
import { getTokenPairSlug } from '@shared/helpers';
import { useTranslation } from '@translation';

interface NotEnoughQuipuErrorToastProps {
  cost: string;
  balance: string;
}

const LINK_SUBSTITUTION_STRING = '%E';

export const NotEnoughQuipuErrorToast: FC<NotEnoughQuipuErrorToastProps> = ({ cost, balance }) => {
  const { t } = useTranslation();
  const [leftMessagePart, rightMessagePart] = t('stableswap|notEnoughQuipuError', {
    cost,
    balance
  }).split(LINK_SUBSTITUTION_STRING);

  return (
    <div>
      {leftMessagePart}
      <Button href={`${AppRootRoutes.Swap}/${getTokenPairSlug(TEZOS_TOKEN, QUIPU_TOKEN)}`} theme="underlined">
        {t('stableswap|tezQuipuSwapLinkText')}
      </Button>
      {rightMessagePart}
    </div>
  );
};
