import React from 'react';
import cx from 'classnames';

import { getUniqueKey } from '@utils/helpers';
import s from '@components/ui/Table/Table.module.sass';
import { Back } from '@components/svg/Back';
import DisabledBack from '@icons/DisabledBack.svg';

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
    <div className={cx(s.pagination)}>
      <button
        type="button"
        className={cx(s.arrowLeft)}
        onClick={previousPage}
        disabled={!canPreviousPage}
      >
        {canPreviousPage
          ? (<Back id={`Backward${getUniqueKey()}`} className={s.paginationArrow} />)
          : <DisabledBack className={s.paginationArrow} />}
      </button>
      Page
      &nbsp;
      <span className={cx(s.page)}>
        {pageIndex + 1}
      </span>
      &nbsp;
      of
      &nbsp;
      <span className={cx(s.page)}>
        {pageOptions.length}
      </span>
      <button
        type="button"
        className={cx(s.arrowRight)}
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
