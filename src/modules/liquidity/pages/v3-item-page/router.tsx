import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { Route } from 'react-router-dom';

import { ErrorFallback, LoaderFallback, StateWrapper } from '@shared/components';
import { SentryRoutes } from '@shared/services';

import { PageNotFoundPage } from '../../../errors';
import { LiquidityRoutes, LiquidityTabs } from '../../liquidity-routes.enum';
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
        <Route path={`/:id`} element={<V3PositionsPage />} />
        <Route path={`${LiquidityTabs.add}/:id`} element={<V3ItemPage />} />
        <Route path={`${LiquidityTabs.add}/:id${LiquidityRoutes.create}`} element={<CreateNewPositionPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
});
