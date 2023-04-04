import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { AssetSwitcher } from '@shared/components';

import { useTokensOrderSwitcherViewModel } from './use-tokens-order-switcher.vm';

interface TokensOrderSwitcherProps {
  className?: string;
}

export const TokensOrderSwitcher: FC<TokensOrderSwitcherProps> = observer(({ className }) => {
  const { labels, activeIndex, handleButtonClick, isHidden } = useTokensOrderSwitcherViewModel();

  if (isHidden) {
    return null;
  }

  return (
    <AssetSwitcher
      className={className}
      labels={labels}
      activeIndex={activeIndex}
      handleButtonClick={handleButtonClick}
    />
  );
});
