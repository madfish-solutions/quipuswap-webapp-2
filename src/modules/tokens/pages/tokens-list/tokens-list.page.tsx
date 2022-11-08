import { observer } from 'mobx-react-lite';

import { PageTitle, TestnetAlert } from '@shared/components';
import { getTokenSlug } from '@shared/helpers';

import { TokensListItem } from '../../components';
import styles from './tokens-list.page.module.scss';
import { useTokensListPageViewModel } from './use-tokens-list-page.vm';

export const TokensListPage = observer(() => {
  const { tokens, onFavoriteClick, onHideClick } = useTokensListPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="tokensListPageTitle">Tokens</PageTitle>
      <div className={styles.list}>
        {tokens.map(token => (
          <TokensListItem
            key={getTokenSlug(token)}
            token={token}
            onFavoriteClick={() => onFavoriteClick(token)}
            onHideClick={() => onHideClick(token)}
          />
        ))}
      </div>
    </>
  );
});
