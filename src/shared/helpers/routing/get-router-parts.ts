const SEPARATOR = '/';

export const getRouterParts = (routerPath: string) => routerPath.split(SEPARATOR).filter(part => Boolean(part));
