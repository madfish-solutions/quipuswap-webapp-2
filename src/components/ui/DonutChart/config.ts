import { ChartOptions, DeepPartial } from 'lightweight-charts';

export const GraphicHeight = 300;

export const GraphicDimensions = {
  width: 256,
  height: 184,
};

export const GraphicColors = {
  light: {
    primary1: '#232735',
    primary2: '#F0F1F3',
    background: '#ffffff',
    accent: '#1770E4',
  },
  dark: {
    primary1: '#FFFFFF',
    primary2: '#14171E',
    background: '#070C12',
    accent: '#F9A305',
  },
};

export const GraphOptions: DeepPartial<ChartOptions> = {
  layout: {
    backgroundColor: 'transparent',
    textColor: '#8B90A0',
    fontFamily: 'IBM Plex Sans',
    fontSize: 12,
  },
  rightPriceScale: {
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
    borderVisible: false,
  },
  timeScale: {
    borderVisible: true,
    fixLeftEdge: true,
    timeVisible: true,
  },
  handleScale: {
    axisPressedMouseMove: false,
  },
  watermark: {
    color: 'transparent',
  },
  grid: {
    horzLines: {
      visible: false,
    },
    vertLines: {
      visible: false,
    },
  },
  crosshair: {
    horzLine: {
      visible: false,
      labelVisible: false,
    },
    vertLine: {
      visible: true,
      labelVisible: false,
      style: 3,
      width: 1,
    },
  },
};
