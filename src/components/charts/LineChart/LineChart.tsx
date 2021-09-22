import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import { createChart, IChartApi } from 'lightweight-charts';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { usePrevious } from '@hooks/usePrevious';
import { prettyPrice } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { PairChartInfo } from '@components/common/PairChartInfo';

import { Preloader } from '@components/common/Preloader';
import {
  GraphicColors,
  GraphicHeight,
  GraphOptions,
  LineGraphOptions,
} from '../config';
import s from './LineChart.module.sass';

type LineChartProps = {
  data: any[]
  token1?: WhitelistedToken
  token2?: WhitelistedToken
  loading?: boolean
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const LineChart: React.FC<LineChartProps> = ({
  data,
  className,
  loading = false,
  token1,
  token2,
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
          horzLine: {
            ...GraphOptions.crosshair?.horzLine,
            color: GraphicColors[colorThemeMode].primary1,
            labelBackgroundColor: GraphicColors[colorThemeMode].labelBackground,
          },
          vertLine: {
            ...GraphOptions.crosshair?.vertLine,
            color: GraphicColors[colorThemeMode].primary1,
            labelBackgroundColor: GraphicColors[colorThemeMode].labelBackground,
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
        crosshairMarkerBorderColor: GraphicColors[colorThemeMode].primary1,
        crosshairMarkerBackgroundColor: GraphicColors[
          colorThemeMode === ColorModes.Light ? ColorModes.Dark : ColorModes.Light
        ].primary1,
        ...LineGraphOptions,
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
    <Card className={className}>
      <CardHeader
        header={{
          content: (
            <PairChartInfo hidePeriods token1={token1} token2={token2} />
          ),
        }}
        className={s.cardHeader}
      />
      <CardContent className={cx(s.container, s.cardContent)}>
        <div className={cx(s.info, modeClass[colorThemeMode])}>
          <h4>
            Total Liquidity:
          </h4>
          <span className={s.date}>
            {new Date(value.time * 1000).toISOString()}
          </span>
          <h4 className={s.value}>
            <span className={s.dollar}>
              $
            </span>
            {' '}
            {prettyPrice(value.price, 2, 22)}
          </h4>
        </div>
        {loading || !data || data.length === 0
          ? (<Preloader style={{ minHeight: '315px' }} />)
          : (<div ref={chartRef} className={s.chart} />)}
      </CardContent>
    </Card>
  );
};
