import { FC } from 'react';

import { PageTitle, TestnetAlert } from '@shared/components';

import s from './page-not-found.module.scss';

export const PageNotFoundPage: FC = () => (
  <>
    <TestnetAlert />
    <PageTitle>Page Not Found</PageTitle>
    <div className={s.statusCode}>404</div>
  </>
);
