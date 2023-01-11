export const isActivePath = (pathname: string, href: string) => {
  if (!href) {
    return false;
  }

  if (href === '/') {
    return pathname === '/';
  }

  if (pathname.startsWith('/send/')) {
    return pathname.replace('/send/', '/swap/').startsWith(href);
  }

  if (pathname.startsWith('/stableswap/liquidity')) {
    return pathname.replace('/stableswap/liquidity', '/liquidity/stableswap').startsWith(href);
  }

  return pathname.startsWith(href);
};
