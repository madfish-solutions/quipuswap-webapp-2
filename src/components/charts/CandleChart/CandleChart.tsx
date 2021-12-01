import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {
  Card,
  Preloader,
  CardHeader,
  CardContent,
  PairChartInfo,
  ColorModes,
  ColorThemeContext,
} from '@quipuswap/ui-kit';
import { createChart, IChartApi } from 'lightweight-charts';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { CandlePlotPoint } from '@graphql';
import {
  prettyPrice,
  prepareTokenLogo,
  getWhitelistedTokenName,
  getWhitelistedTokenSymbol,
} from '@utils/helpers';
import { MAINNET_DEFAULT_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { WhitelistedToken } from '@utils/types';
import { usePrevious } from '@hooks/usePrevious';

import {
  CandleGraphOptions,
  GraphicColors,
  GraphicHeight,
  GraphOptions,
} from '../config';
import s from './CandleChart.module.sass';

type CandleChartProps = {
  data: CandlePlotPoint[]
  className?: string
  disabled?: boolean
  loading?: boolean
  token1?: WhitelistedToken
  token2?: WhitelistedToken
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const ChartInstance: React.FC<{ data:CandlePlotPoint[], token: WhitelistedToken }> = ({
  data,
  token,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { i18n } = useTranslation('home');
  const { t } = useTranslation(['common']);

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
    open: currenValue.open,
    high: currenValue.high,
    low: currenValue.low,
    close: currenValue.close,
    time: currenValue.time,
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

      // @ts-ignore
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
              open: currenValue.open,
              high: currenValue.high,
              low: currenValue.low,
              close: currenValue.close,
              time: currenValue.time,
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
          const time = param.time ?? currenValue.time;
          setValue({
            open,
            high,
            low,
            close,
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
        <span className={s.prices}>
          <h4 className={s.tokenPrice}>
            {prettyPrice(value.close, 2, 10)}
            {' '}
            {getWhitelistedTokenName(token)}
          </h4>
          <h4 className={cx(s.dollarPrice, { [s.down]: value.close < value.open })}>
            $
            {' '}
            {prettyPrice(value.close, 2, 10)}
          </h4>
        </span>
        <div className={s.details}>
          <div className={s.column}>
            <div className={s.item}>
              <span className={s.label}>
                {t('common|Open')}
              </span>
              <span className={s.value}>
                {value.open}
              </span>
            </div>
            <div className={s.item}>
              <span className={s.label}>
                {t('common|Close')}
              </span>
              <span className={s.value}>
                {value.close}
              </span>
            </div>
          </div>
          <div className={s.column}>
            <div className={s.item}>
              <span className={s.label}>
                {t('common|Max')}
              </span>
              <span className={s.value}>
                {value.high}
              </span>
            </div>
            <div className={s.item}>
              <span className={s.label}>
                {t('common|Min')}
              </span>
              <span className={s.value}>
                {value.low}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div ref={chartRef} className={s.chart} />
    </>
  );
};

export const CandleChart: React.FC<CandleChartProps> = ({
  data,
  className,
  loading = false,
  token1 = TEZOS_TOKEN,
  token2 = MAINNET_DEFAULT_TOKEN,
  disabled,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['common']);
  return (
    <Card className={className}>
      <CardHeader
        header={{
          content: (
            <PairChartInfo
              hidePeriods
              firstTokenIcon={prepareTokenLogo(token1.metadata?.thumbnailUri)}
              firstTokenSymbol={getWhitelistedTokenSymbol(token1)}
              secondTokenIcon={prepareTokenLogo(token2.metadata?.thumbnailUri)}
              secondTokenSymbol={getWhitelistedTokenSymbol(token2)}
            />
          ),
        }}
        className={s.cardHeader}
      />
      <CardContent className={cx(s.container, s.cardContent)}>
        {loading || !data || !token2 || data.length === 0
          ? (<Preloader style={{ minHeight: '360px' }} />)
          : (
            <ChartInstance token={token2} data={data} />
          )}
      </CardContent>
      {disabled && (
      <div className={cx(s.disabled, modeClass[colorThemeMode])}>
        <div className={s.disabledBg} />
        <h2 className={s.h1}>{t('common|Coming soon!')}</h2>
      </div>
      )}
    </Card>
  );
};
