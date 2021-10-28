import React, { useContext, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { createChart, IChartApi } from 'lightweight-charts';
import { useTranslation } from 'next-i18next';

import { PlotPoint } from '@graphql';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { useClientHeight } from '@hooks/useClientHeight';
import { usePrevious } from '@hooks/usePrevious';
import { prettyPrice } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { PairChartInfo } from '@components/common/PairChartInfo';
import { Preloader } from '@components/common/Preloader';

import { GraphicColors, GraphicHeight, GraphOptions, LineGraphOptions } from '../config';
import s from './LineChart.module.sass';

type LineChartProps = {
  error?: any;
  data: PlotPoint[];
  token1?: WhitelistedToken;
  token2?: WhitelistedToken;
  loading?: boolean;
  headerContent?: React.ReactNode;
  className?: string;
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dt = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  let ampm = 'AM';

  let monString = `${month}`;
  let dayString = `${dt}`;
  let minString = `${minutes}`;

  if (month < 10) {
    monString = `0${month}`;
  }
  if (dt < 10) {
    dayString = `0${dt}`;
  }
  if (hours >= 12) {
    ampm = 'PM';
    hours -= 12;
  }
  let hourString = `${hours}`;
  if (hours < 10) {
    hourString = `0${hours}`;
  }
  if (minutes < 10) {
    minString = `0${minutes}`;
  }
  // dd.mm.yyyy HH:MM PM
  return `${dayString}.${monString}.${year} ${hourString}:${minString} ${ampm}`;
};

const ChartInstance: React.FC<{ data: PlotPoint[] }> = ({ data }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartCreated, setChart] = useState<IChartApi | undefined>();
  const prevColorThemeModeState = usePrevious(colorThemeMode);
  const { t } = useTranslation(['common']);
  const { i18n } = useTranslation('home');

  const height = GraphicHeight;

  // for reseting value on hover exit
  const currenValue = data[data.length - 1];

  const [value, setValue] = useState<{ price: number; time: number }>({
    price: currenValue.value,
    time: currenValue.time,
  });

  useClientHeight({ chartCreated, chartRef, height });

  // if chart not instantiated in canvas, create it
  useEffect(() => {
    if (prevColorThemeModeState !== colorThemeMode) {
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

      const series = chart.addAreaSeries({
        lineColor: GraphicColors[colorThemeMode].primary1,
        topColor: GraphicColors[colorThemeMode].accent,
        bottomColor: GraphicColors[colorThemeMode].background,
        crosshairMarkerBorderColor: GraphicColors[colorThemeMode].primary1,
        crosshairMarkerBackgroundColor:
          GraphicColors[colorThemeMode === ColorModes.Light ? ColorModes.Dark : ColorModes.Light]
            .primary1,
        ...LineGraphOptions,
      });

      // @ts-ignore
      series.setData(data);

      // update the title when hovering on the chart
      chart.subscribeCrosshairMove((param) => {
        if (
          chartRef?.current &&
          (param === undefined ||
            param.time === undefined ||
            (param && param.point && param.point.x < 0) ||
            (param && param.point && param.point.x > chartRef.current.clientWidth) ||
            (param && param.point && param.point.y < 0) ||
            (param && param.point && param.point.y > height))
        ) {
          if (setValue) {
            setValue({
              price: currenValue.value,
              time: currenValue.time,
            });
          }
        } else if (setValue) {
          const price = param.seriesPrices.get(series) ?? currenValue.value;
          const time = param.time ?? currenValue.time;
          setValue({
            price: price as number,
            time: time as number,
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
    i18n,
  ]);

  return (
    <>
      <div className={cx(s.info, modeClass[colorThemeMode])}>
        <h4>{t('common|Total liquidity:')}</h4>
        <span className={s.date}>{formatDate(new Date(value.time * 1000))}</span>
        <h4 className={s.value}>
          <span className={s.dollar}>$</span> {prettyPrice(value.price, 2, 22)}
        </h4>
      </div>
      <div ref={chartRef} className={s.chart} />
    </>
  );
};

export const LineChart: React.FC<LineChartProps> = ({
  data,
  error,
  className,
  loading = false,
  token1,
  token2,
}) => (
  <Card className={className}>
    <CardHeader
      header={{
        content: <PairChartInfo hidePeriods token1={token1} token2={token2} />,
      }}
      className={s.cardHeader}
    />
    <CardContent className={cx(s.container, s.cardContent)}>
      {loading || error || !data || data.length === 0 ? (
        <Preloader style={{ minHeight: '360px' }} />
      ) : (
        <ChartInstance data={data} />
      )}
    </CardContent>
  </Card>
);
