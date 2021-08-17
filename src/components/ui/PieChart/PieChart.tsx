import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createChart, IChartApi } from 'lightweight-charts';

import { prettyPrice } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { usePrevious } from '@hooks/usePrevious';

import {
  GraphicColors,
  GraphicHeight,
  GraphOptions,
} from './config';
import s from './PieChart.module.sass';

type PieChartProps = {
  data: any[]
  className?: string
};

export const PieChart: React.FC<PieChartProps> = ({
  data,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const chartRef = useRef<HTMLDivElement>(null);
  const [chartCreated, setChart] = useState<IChartApi | undefined>();
  const prevColorThemeModeState = usePrevious(colorThemeMode);

  const height = GraphicHeight;

  // for reseting value on hover exit
  const currenValue = data[data.length - 1];

  const handleResize = useCallback(() => {
    if (chartCreated && chartRef?.current?.parentElement) {
      chartCreated.resize(chartRef.current.parentElement.clientWidth - 32, height);
      chartCreated.timeScale().fitContent();
      chartCreated.timeScale().scrollToPosition(0, false);
    }
  }, [chartCreated, chartRef, height]);

  // add event listener for resize
  const isClient = typeof window === 'object';
  useEffect(() => {
    if (!isClient) {
      return () => {};
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient, chartRef, handleResize]);

  // if chart not instantiated in canvas, create it
  useEffect(() => {
    if (
      prevColorThemeModeState !== colorThemeMode
    ) {
      chartCreated?.remove();
      setChart(undefined);
    }
    if (!chartCreated && data && !!chartRef?.current?.parentElement) {
      const chart = createChart(chartRef.current, {
        height,
        width: chartRef.current.parentElement.clientWidth - 40,
        layout: GraphOptions.layout,
        rightPriceScale: GraphOptions.rightPriceScale,
        timeScale: {
          ...GraphOptions.timeScale,
          borderColor: GraphicColors[colorThemeMode].primary2,
        },
        handleScale: GraphOptions.handleScale,
        watermark: GraphOptions.watermark,
        grid: GraphOptions.grid,
        crosshair: {
          horzLine: GraphOptions.crosshair?.horzLine,
          vertLine: {
            ...GraphOptions.crosshair?.vertLine,
            color: GraphicColors[colorThemeMode].primary1,
          },
        },
        localization: {
          priceFormatter: (price: number) => prettyPrice(price!, 3, 3),
        },
      });

      const series = chart.addAreaSeries({
        lineColor: GraphicColors[colorThemeMode].primary1,
        topColor: GraphicColors[colorThemeMode].accent,
        bottomColor: GraphicColors[colorThemeMode].background,
        lineWidth: 1,
        priceLineVisible: false,
        crosshairMarkerRadius: 6,
        crosshairMarkerBorderColor: GraphicColors[colorThemeMode].primary1,
        crosshairMarkerBackgroundColor: GraphicColors[
          colorThemeMode === ColorModes.Light ? ColorModes.Dark : ColorModes.Light
        ].primary1,
      });

      series.setData(data);
      chart.timeScale().fitContent();
      setChart(chart);
    }
  }, [
    chartCreated,
    colorThemeMode,
    currenValue,
    data,
    height,
    prevColorThemeModeState,
  ]);

  return (
    <div ref={chartRef} className={s.chart} />
  );
};
