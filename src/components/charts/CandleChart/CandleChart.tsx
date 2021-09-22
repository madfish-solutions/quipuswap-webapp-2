import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import { createChart, IChartApi } from 'lightweight-charts';
import { useTranslation } from 'next-i18next';

import { prettyPrice } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { usePrevious } from '@hooks/usePrevious';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { PairChartInfo } from '@components/common/PairChartInfo/PairChartInfo';
import {
  CandleGraphOptions,
  GraphicColors,
  GraphicHeight,
  GraphOptions,
} from '../config';
import s from './CandleChart.module.sass';

type LineChartProps = {
  data: any[]
  className?: string
  disabled?: boolean
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const CandleChart: React.FC<LineChartProps> = ({
  data,
  className,
  disabled = true,
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { i18n } = useTranslation('home');

  const chartRef = useRef<HTMLDivElement>(null);
  const [chartCreated, setChart] = useState<IChartApi | undefined>();
  const prevColorThemeModeState = usePrevious(colorThemeMode);

  const height = GraphicHeight;

  // for reseting value on hover exit
  const currenValue = data[data.length - 1];

  const [value, setValue] = useState<{
    open: number,
    high: number,
    low: number,
    close: number,
    time: number
  }>({
    open: parseFloat(currenValue.open),
    high: parseFloat(currenValue.high),
    low: parseFloat(currenValue.low),
    close: parseFloat(currenValue.close),
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
          locale: i18n.language,
          priceFormatter: (price: number) => prettyPrice(price!, 3, 3),
        },
      });

      const series = chart.addCandlestickSeries({
        priceLineVisible: false,
        ...CandleGraphOptions,
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
              open: parseFloat(currenValue.open),
              high: parseFloat(currenValue.high),
              low: parseFloat(currenValue.low),
              close: parseFloat(currenValue.close),
              time: parseFloat(currenValue.time),
            });
          }
        } else if (setValue) {
          const open = parseFloat(
            // @ts-ignore
            param.seriesPrices.get(series)?.open.toString()
            ?? currenValue.open,
          );
          const high = parseFloat(
            // @ts-ignore
            param.seriesPrices.get(series)?.high.toString()
            ?? currenValue.high,
          );
          const low = parseFloat(
            // @ts-ignore
            param.seriesPrices.get(series)?.low.toString()
            ?? currenValue.low,
          );
          const close = parseFloat(
            // @ts-ignore
            param.seriesPrices.get(series)?.close.toString()
            ?? currenValue.close,
          );
          const time = parseFloat(
            param.time
            ?? currenValue.time,
          );
          setValue({
            open,
            high,
            low,
            close,
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
      <CardHeader header={{ content: <PairChartInfo /> }} className={s.cardHeader} />
      <CardContent className={cx(s.container, s.cardContent)}>
        <div className={cx(s.info, modeClass[colorThemeMode])}>
          <span className={s.prices}>
            <span className={s.tokenPrice}>
              {prettyPrice(value.close, 2, 10)}
              {' '}
              TOKEN
            </span>
            <span className={cx(s.dollarPrice, { [s.down]: value.close < value.open })}>
              $
              {' '}
              {prettyPrice(value.close, 2, 10)}
            </span>
          </span>
          <div className={s.details}>
            <div className={s.column}>
              <div className={s.item}>
                <span className={s.label}>
                  Open
                </span>
                <span className={s.value}>
                  {value.open}
                </span>
              </div>
              <div className={s.item}>
                <span className={s.label}>
                  Close
                </span>
                <span className={s.value}>
                  {value.close}
                </span>
              </div>
            </div>
            <div className={s.column}>
              <div className={s.item}>
                <span className={s.label}>
                  Max
                </span>
                <span className={s.value}>
                  {value.high}
                </span>
              </div>
              <div className={s.item}>
                <span className={s.label}>
                  Min
                </span>
                <span className={s.value}>
                  {value.low}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div ref={chartRef} className={s.chart} />
      </CardContent>
      {disabled && (
      <div className={cx(s.disabled, modeClass[colorThemeMode])}>
        <div className={s.disabledBg} />
        <h2 className={s.h1}>{t('common:Coming soon!')}</h2>
      </div>
      )}
    </Card>
  );
};
