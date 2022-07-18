import { observer } from 'mobx-react-lite';

import { TokensModalView } from './tokens-modal.view';
import { useTokensModalViewModel } from './tokens-modal.vm';

export const TokensModal = observer(() => {
  const params = useTokensModalViewModel();

  return <TokensModalView {...params} />;
});
