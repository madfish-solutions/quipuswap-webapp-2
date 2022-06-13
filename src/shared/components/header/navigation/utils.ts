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

  return pathname.startsWith(href);
};
