import { FC, Fragment, ReactElement } from 'react';

interface IteratorProps<T> {
  render: FC<T>;
  data: Array<T>;
  isGrouped?: boolean;
  wrapperClassName?: string;
}

type IteratorComponent = <T>(props: IteratorProps<T>) => ReactElement<T>;

const Div: FC<{ className?: string }> = ({ children, className }) => <div className={className}>{children}</div>;

export const Iterator: IteratorComponent = ({ data, render, isGrouped, wrapperClassName }) => {
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
