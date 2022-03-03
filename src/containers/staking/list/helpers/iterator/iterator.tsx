import { FC, Fragment, ReactElement } from 'react';

import { isEmptyArray, isExist } from '@utils/helpers';

interface IteratorProps<T> {
  render: FC<T>;
  data: Array<T>;
  fallback?: ReactElement;
  isGrouped?: boolean;
  wrapperClassName?: string;
}

type IteratorComponent = <T>(props: IteratorProps<T>) => ReactElement<T> | ReactElement;

const Div: FC<{ className?: string }> = ({ children, className }) => <div className={className}>{children}</div>;

export const Iterator: IteratorComponent = ({ data, render, fallback, isGrouped, wrapperClassName }) => {
  if (isExist(fallback) && isEmptyArray(data)) {
    return fallback;
  }

  const Render = render;

  const Wrapper = isGrouped ? Div : Fragment;

  return (
    <Wrapper className={wrapperClassName}>
      {data.map(data => (
        <Render {...data} />
      ))}
    </Wrapper>
  );
};
