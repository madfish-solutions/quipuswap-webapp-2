import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import { createChart, IChartApi } from 'lightweight-charts';

import { prettyPrice } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { usePrevious } from '@hooks/usePrevious';
import { Card, CardContent, CardHeader } from '@components/ui/Card';

import {
  GraphicColors,
  GraphicHeight,
  GraphOptions,
} from './config';
import s from './LineChart.module.sass';

type LineChartProps = {
  data: any[]
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const LineChart: React.FC<LineChartProps> = ({
  data,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const chartRef = useRef<HTMLDivElement>(null);
  const [chartCreated, setChart] = useState<IChartApi | undefined>();
  const prevColorThemeModeState = usePrevious(colorThemeMode);

  const height = GraphicHeight;

  // for reseting value on hover exit
  const currenValue = data[data.length - 1];

  const [value, setValue] = useState<{ price: number, time: number }>({
    price: parseFloat(currenValue.value),
    time: parseFloat(currenValue.time),
  });

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

      // update the title when hovering on the chart
      chart.subscribeCrosshairMove((param) => {
        if (
          chartRef?.current
          && (param === undefined
            || param.time === undefined
            || (param && param.point && param.point.x < 0)
            || (param && param.point && param.point.x > chartRef.current.clientWidth)
            || (param && param.point && param.point.y < 0)
            || (param && param.point && param.point.y > height))
        ) {
          if (setValue) {
            setValue({
              price: parseFloat(currenValue.value),
              time: parseFloat(currenValue.time),
            });
          }
        } else if (setValue) {
          const price = parseFloat(param.seriesPrices.get(series)?.toString() ?? currenValue.value);
          const time = parseFloat(param.time ?? currenValue.time);
          setValue({
            price,
            time,
          });
        }
      });
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
    setValue,
  ]);

  return (
    <Card
      className={className}
    >
      <CardHeader header={{ content: 'Graphic' }} />
      <CardContent className={s.container}>
        <div className={cx(s.info, modeClass[colorThemeMode])}>
          <p className={s.caption}>
            Price:
          </p>
          <p className={s.token}>
            {prettyPrice(value.price, 3)}
            {' '}
            TOKEN
          </p>
          <p className={s.dollar}>
            $
            {' '}
            {prettyPrice(value.price, 3)}
          </p>
          <p className={s.date}>
            {new Date(value.time * 1000).toISOString()}
          </p>
        </div>
        <div ref={chartRef} className={s.chart} />

      </CardContent>
    </Card>
  );
};
