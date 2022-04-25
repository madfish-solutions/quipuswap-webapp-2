import { FC } from 'react';

import { PageTitle, TestnetAlert } from '@shared/components';

export const PageNotFoundPage: FC = () => (
  <>
    <TestnetAlert />
    <PageTitle>Page Not Found</PageTitle>
  </>
);
