import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Route } from 'react-router-dom';

import { ErrorFallback, LoaderFallback, StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { PageNotFoundPage } from '../../../errors';
import {
  CREATE_POOL_RELATIVE_PATH,
  CREATE_POSITION_RELATIVE_PATH,
  POSITIONS_RELATIVE_PATH,
  POSITION_RELATIVE_PATH
} from './constants';
import { CreateNewPoolPage } from './create-new-pool.page';
import { CreateNewPositionPage } from './create-new-position.page';
import { useRouterViewModel } from './use-router.vm';
import { V3ItemPage } from './v3-item-page';
import { V3PositionsPage } from './v3-positions-page';

export const V3ItemPageRouter: FC = observer(() => {
  const { isLoading, isNotFound, error } = useRouterViewModel();

  if (isNotFound) {
    return <PageNotFoundPage />;
  }

  return (
    <StateWrapper
      isLoading={isLoading}
      loaderFallback={<LoaderFallback />}
      isError={!!error}
      errorFallback={<ErrorFallback error={error} />}
    >
      <SentryRoutes>
        <Route path={CREATE_POOL_RELATIVE_PATH} element={<CreateNewPoolPage />} />
        <Route path={POSITIONS_RELATIVE_PATH} element={<V3PositionsPage />} />
        <Route path={POSITION_RELATIVE_PATH} element={<V3ItemPage />} />
        <Route path={CREATE_POSITION_RELATIVE_PATH} element={<CreateNewPositionPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
});
