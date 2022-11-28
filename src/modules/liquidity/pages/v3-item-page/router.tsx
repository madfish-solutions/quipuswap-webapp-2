/* eslint-disable no-console */
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

export const V3ItemPageRouter: FC = observer(() => {
  const { isLoading, isNotFound, error } = useRouterViewModel();

  if (isNotFound) {
    return <PageNotFoundPage />;
  }

  console.log('V3ItemPageRouter');
  console.log(error);
  console.log(isLoading);

  return (
    <StateWrapper
      isLoading={isLoading}
      loaderFallback={<LoaderFallback />}
      isError={!!error}
      errorFallback={<ErrorFallback error={error} />}
    >
      <SentryRoutes>
        <Route path={`${LiquidityTabs.add}/:address`} element={<V3ItemPage />} />
        <Route path={`${LiquidityTabs.add}/:address${LiquidityRoutes.create}`} element={<CreateNewPositionPage />} />
      </SentryRoutes>
    </StateWrapper>
  );
});
