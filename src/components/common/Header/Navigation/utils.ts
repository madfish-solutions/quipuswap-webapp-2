export const isActivePath = (pathname: string, href: string) => (pathname === '/'
  ? href === '/'
  : href !== '/' && pathname.includes(href));
