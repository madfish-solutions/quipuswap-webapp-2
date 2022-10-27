import { FC, useRef } from 'react';

import { Iterator } from '../iterator';

// const STEP = 10;

interface Props<T> {
  items: T[];
  /* eslint-disable @typescript-eslint/no-explicit-any */
  render: FC<any>;
  wrapperClassName?: string;
}

// TODO: https://madfish.atlassian.net/browse/QUIPU-458
export function VirtualList<T>({ items, render, wrapperClassName }: Props<T>) {
  const lastElementRef = useRef<HTMLDivElement>(null);

  // const [shownItems, setShownItems] = useState<Array<T>>([]);
  //
  // useEffect(() => {
  //   let itemsToShow = 0;
  //
  //   if (lastElementRef.current) {
  //     const infiniteObserver = new IntersectionObserver(([entry]) => {
  //       if (entry.isIntersecting) {
  //         setShownItems(items.splice(FISRT_INDEX, (itemsToShow += STEP)));
  //       }
  //     });
  //     infiniteObserver.observe(lastElementRef.current);
  //   }
  // }, [lastElementRef, items]);

  return (
    <>
      <Iterator render={render} data={items} wrapperClassName={wrapperClassName} isGrouped />
      <div ref={lastElementRef} style={{ height: 1, backgroundColor: 'transparent' }} />
    </>
  );
}
