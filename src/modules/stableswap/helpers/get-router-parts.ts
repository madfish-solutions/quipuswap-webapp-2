const SEPARATOR = '/';
export const getRouterParts = (routerPath: string) => routerPath.split(SEPARATOR).filter(part => part);
