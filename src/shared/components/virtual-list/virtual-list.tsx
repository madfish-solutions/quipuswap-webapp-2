/* eslint-disable no-console */
import { memo, useEffect, useRef, useState } from 'react';

import { isEmptyArray } from 'formik';
import { nextTick } from 'process';

import { isExist, isNull } from '@shared/helpers';

import { Iterator, IteratorComponent } from '../iterator';

const START_INDEX = 0;
const STEP = 10;
const MAX_ITEMS = 50;

function useVirtualListViewModel<T>(items: Array<T>) {
  const lastElementRef = useRef<HTMLDivElement>(null);
  const lastElementIntersectionObserver = useRef<Nullable<IntersectionObserver>>(null);

  const tenLastItemsOffset = useRef(0);

  const [shownItems, setShownItems] = useState<typeof items>([]);

  useEffect(() => {
    let lastIndexOfShownItem = 10;

    if (isNull(lastElementRef.current) || isExist(lastElementIntersectionObserver.current) || isEmptyArray(items)) {
      return;
    }

    lastElementIntersectionObserver.current = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || isNull(lastElementRef.current) || lastIndexOfShownItem > items.length) {
        return;
      }

      lastIndexOfShownItem = lastIndexOfShownItem + STEP;

      const startIndex = Math.max(START_INDEX, lastIndexOfShownItem - MAX_ITEMS);

      const newItems = items.slice(startIndex, lastIndexOfShownItem);

      const isLastIterationBeforeFirstElementsWillBeHidden = MAX_ITEMS - lastIndexOfShownItem < STEP;
      const isEndOfItems = items.length - lastIndexOfShownItem < STEP;

      if (isLastIterationBeforeFirstElementsWillBeHidden && !isEndOfItems) {
        if (tenLastItemsOffset.current == 0) {
          tenLastItemsOffset.current = lastElementRef.current.offsetTop;
        }
        window.scrollTo({ top: tenLastItemsOffset.current });
      }

      console.log({ startIndex, lastIndexOfShownItem, newItems, originalLength: items.length });

      setShownItems(newItems);
      nextTick(() => console.log(lastElementRef.current?.offsetTop));
    });

    lastElementIntersectionObserver.current.observe(lastElementRef.current);
  }, [items, lastElementRef]);

  return {
    lastElementRef,
    shownItems
  };
}

// TODO: https://madfish.atlassian.net/browse/QUIPU-458
export const VirtualList: IteratorComponent = memo(props => {
  const { lastElementRef, shownItems } = useVirtualListViewModel(props.data);

  return (
    <>
      <Iterator {...props} isGrouped data={shownItems} />
      <div ref={lastElementRef} style={{ height: 1, backgroundColor: 'transparent' }} />
    </>
  );
}) as IteratorComponent;
