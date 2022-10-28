import { FC, Fragment, ReactElement } from 'react';

import { isEmptyArray, isExist, isLastElementIndex } from '@shared/helpers';
import { Undefined } from '@shared/types';

interface IteratorProps<T> {
  render: FC<T>;
  data: Array<T>;
  fallback?: ReactElement;
  separator?: ReactElement;
  isGrouped?: boolean;
  wrapperClassName?: string;
  DTI?: string;
  keyFn?: (item: T) => Undefined<string | number>;
}

export type IteratorComponent = <T>(props: IteratorProps<T>) => ReactElement<T> | ReactElement;

export const Iterator: IteratorComponent = ({
  data,
  keyFn,
  render,
  fallback,
  separator,
  isGrouped,
  wrapperClassName,
  DTI
}) => {
  if (isExist(fallback) && isEmptyArray(data)) {
    return fallback;
  }

  const Render = render;

  const content = data.map((_data, index) => {
    if (isLastElementIndex(index, data)) {
      return <Render key={keyFn ? keyFn(_data) : index} {..._data} data-test-id={`hello${index}`} />;
    }

    return (
      <Fragment key={keyFn ? keyFn(_data) : index}>
        <Render {..._data} data-test-id={`hello${index}`} />
        {separator}
      </Fragment>
    );
  });

  return (
    <Fragment>
      {isGrouped ? (
        <div className={wrapperClassName} data-test-id={DTI}>
          {content}
        </div>
      ) : (
        content
      )}
    </Fragment>
  );
};
