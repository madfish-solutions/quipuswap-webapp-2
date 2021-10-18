import { isClient } from '@utils/helpers';
import { IChartApi } from 'lightweight-charts';
import { useEffect, useCallback, RefObject } from 'react';

type ClientHeightProps = {
  chartCreated: IChartApi | undefined
  chartRef: RefObject<HTMLDivElement>
  height: number
};

export const useClientHeight = ({
  chartCreated,
  chartRef,
  height,
}: ClientHeightProps) => {
  const handleResize = useCallback(() => {
    if (chartCreated && chartRef?.current?.parentElement) {
      chartCreated.resize(chartRef.current.parentElement.clientWidth - 32, height);
      chartCreated.timeScale().fitContent();
      chartCreated.timeScale().scrollToPosition(0, false);
    }
  }, [chartCreated, chartRef, height]);

  // add event listener for resize
  useEffect(() => {
    if (!isClient) {
      return () => {};
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chartRef, handleResize]);
};
