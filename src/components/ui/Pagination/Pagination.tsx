import React from 'react';

import { getUniqueKey } from '@utils/helpers';
import { Back } from '@components/svg/Back';
import DisabledBack from '@icons/DisabledBack.svg';

import { Button } from '../Button';
import s from './Pagination.module.sass';

type PaginationProps = {
  page: number,
  pageMax: number,
  setPage: (page:number) => void
  className?: string
};

export const Pagination: React.FC<PaginationProps> = ({
  page,
  pageMax,
  setPage,
}) => (
  <div className={s.cardCellSmall}>
    <div className={s.footer}>
      <Button
        onClick={() => setPage(page - 1)}
        theme="quaternary"
        disabled={page < 2}
      >
        {page !== 1 ? (<Back id={`Back${getUniqueKey()}`} />) : <DisabledBack />}
      </Button>
      <div className={s.pagination}>
        Page
        <span className={s.paginationPage}>{page}</span>
        of
        <span className={s.paginationPage}>{pageMax}</span>
      </div>
      <Button
        onClick={() => setPage(page + 1)}
        theme="quaternary"
        disabled={page > pageMax - 1}
      >
        {page < (pageMax)
          ? (<Back id={`Forward${getUniqueKey()}`} className={s.forward} />)
          : <DisabledBack className={s.forward} />}
      </Button>

    </div>
  </div>
);
