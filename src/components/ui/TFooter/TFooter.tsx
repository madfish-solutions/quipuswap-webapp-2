import React from 'react';

import { getUniqueKey } from '@utils/helpers';
import { Back } from '@components/svg/Back';
import DisabledBack from '@icons/DisabledBack.svg';

import s from '@components/ui/Table/Table.module.sass';

type TFooterProps = {
  isShowPagination: boolean
  previousPage: () => void
  canPreviousPage: boolean
  nextPage: () => void
  canNextPage: boolean
  pageIndex: number
  pageOptions: number[]
};

export const TFooter: React.FC<TFooterProps> = ({
  isShowPagination,
  previousPage,
  canPreviousPage,
  pageIndex,
  pageOptions,
  nextPage,
  canNextPage,
}) => (
  <>
    {isShowPagination && (
    <div className={s.pagination}>
      <button
        type="button"
        className={s.arrowLeft}
        onClick={previousPage}
        disabled={!canPreviousPage}
      >
        {canPreviousPage
          ? (<Back id={`Backward${getUniqueKey()}`} className={s.paginationArrow} />)
          : <DisabledBack className={s.paginationArrow} />}
      </button>
      Page
      &nbsp;
      <span className={s.page}>
        {pageIndex + 1}
      </span>
      &nbsp;
      of
      &nbsp;
      <span className={s.page}>
        {pageOptions.length}
      </span>
      <button
        type="button"
        className={s.arrowRight}
        onClick={nextPage}
        disabled={!canNextPage}
      >
        {canNextPage
          ? (<Back id={`Forward${getUniqueKey()}`} className={s.paginationArrow} />)
          : <DisabledBack className={s.paginationArrow} />}
      </button>
    </div>
    )}
  </>
);
