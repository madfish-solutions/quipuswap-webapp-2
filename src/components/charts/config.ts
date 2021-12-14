import { AreaSeriesOptions, CandlestickSeriesOptions, ChartOptions, DeepPartial } from 'lightweight-charts';

export const GraphicHeight = 300;

export const GraphicColors = {
  light: {
    primary1: '#232735',
    primary2: '#F0F1F3',
    background: '#ffffff',
    labelBackground: '#14171E',
    accent: '#1770E4'
  },
  dark: {
    primary1: '#FFFFFF',
    primary2: '#14171E',
    background: '#070C12',
    labelBackground: '#FAFAFC',
    accent: '#F9A305'
  }
};

export const GraphOptions: DeepPartial<ChartOptions> = {
  layout: {
    backgroundColor: 'transparent',
    textColor: '#8B90A0',
    fontFamily: 'IBM Plex Sans',
    fontSize: 12
  },
  rightPriceScale: {
    scaleMargins: {
      top: 0.1,
      bottom: 0.1
    },
    borderVisible: false
  },
  timeScale: {
    borderVisible: true,
    fixLeftEdge: true,
    timeVisible: true
  },
  handleScale: {
    axisPressedMouseMove: false
  },
  watermark: {
    color: 'transparent'
  },
  grid: {
    horzLines: {
      visible: false
    },
    vertLines: {
      visible: false
    }
  },
  crosshair: {
    horzLine: {
      visible: true,
      labelVisible: true,
      style: 3,
      width: 1
    },
    vertLine: {
      visible: true,
      labelVisible: true,
      style: 3,
      width: 1
    }
  }
};

export const LineGraphOptions: DeepPartial<AreaSeriesOptions> = {
  lineWidth: 1,
  priceLineVisible: false,
  crosshairMarkerRadius: 6
};

export const CandleGraphOptions: DeepPartial<CandlestickSeriesOptions> = {
  upColor: '#2ED33E',
  wickUpColor: '#2ED33E',
  borderUpColor: '#2ED33E',
  downColor: '#EA2424',
  wickDownColor: '#EA2424',
  borderDownColor: '#EA2424'
};
