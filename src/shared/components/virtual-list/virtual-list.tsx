import { memo, useEffect, useRef, useState } from 'react';

import { isEmptyArray } from 'formik';

import { isExist, isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { Iterator, IteratorComponent } from '../iterator';

//TODO https://madfish.atlassian.net/browse/QUIPU-558

const START_INDEX = 0;
const STEP = 10;
let lastIndexOfShownItem = 10;

function useVirtualListViewModel<T>(items: Array<T>) {
  const lastElementRef = useRef<HTMLDivElement>(null);
  const lastElementIntersectionObserver = useRef<Nullable<IntersectionObserver>>(null);

  const [shownItems, setShownItems] = useState<typeof items>([]);
  const localItems = useRef<typeof items>(items);

  useEffect(() => {
    localItems.current = items;

    const newItems = localItems.current.slice(START_INDEX, lastIndexOfShownItem);

    setShownItems(newItems);

    if (
      isNull(lastElementRef.current) ||
      isExist(lastElementIntersectionObserver.current) ||
      isEmptyArray(localItems.current)
    ) {
      return;
    }

    lastElementIntersectionObserver.current = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || isNull(lastElementRef.current) || lastIndexOfShownItem > localItems.current.length) {
        return;
      }

      lastIndexOfShownItem = lastIndexOfShownItem + STEP;

      const newObserverItems = localItems.current.slice(START_INDEX, lastIndexOfShownItem);

      setShownItems(newObserverItems);
    });

    lastElementIntersectionObserver.current.observe(lastElementRef.current);
  }, [items, lastElementRef]);

  return {
    lastElementRef,
    shownItems
  };
}

export const VirtualList: IteratorComponent = memo(props => {
  const { lastElementRef, shownItems } = useVirtualListViewModel(props.data);

  return (
    <>
      <Iterator {...props} isGrouped data={shownItems} />
      <div ref={lastElementRef} style={{ height: 1, backgroundColor: 'transparent' }} />
    </>
  );
}) as IteratorComponent;
