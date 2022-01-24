export const NETWORK_SELECTOR_VALUE_CONTAINER = '.customSelect__value-container';
const INDEX_OF_SIDEBAR_NETWORK_SELECTOR_VALUE_CONTAINER = 1;
const WIDTH = 'width';
const PX = 'px';
const NORMAL_WIDTH = 163;
const WIDTH_WHEN_SIDEBAR_SCROLLABLE = 155;

const handleNetworkSelectorDecrease = (networkSelector: HTMLDivElement, width: number) => {
  networkSelector.style.setProperty(WIDTH, `${NORMAL_WIDTH - width}${PX}`);
};

const handleNetworkSelectorIncrease = (networkSelector: HTMLDivElement) => {
  networkSelector.style.setProperty(WIDTH, `${NORMAL_WIDTH}${PX}`);
};

const isElementScrolable = (element: HTMLElement) => element.scrollHeight > element.clientHeight;
const changingWidth = (element: HTMLElement) => element.offsetWidth - element.clientWidth

export const fixNetworkSelector = (sidebar: HTMLDivElement, networkSelector: HTMLDivElement) => {
  if (isElementScrolable(sidebar)) {
    handleNetworkSelectorDecrease(networkSelector, changingWidth(sidebar));
  } else {
    handleNetworkSelectorIncrease(networkSelector);
  }
};

export const getSecondElement = (selector: string): HTMLDivElement =>
  document.querySelectorAll<HTMLDivElement>(selector)[INDEX_OF_SIDEBAR_NETWORK_SELECTOR_VALUE_CONTAINER];
