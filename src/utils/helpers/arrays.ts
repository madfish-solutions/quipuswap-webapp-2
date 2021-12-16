export const getUniqArray = <T>(list: T[], getKey: (el: T) => string): T[] => {
  const map: Record<string, boolean> = {};

  return list.filter(el => {
    const key = getKey(el);
    if (!(key in map)) {
      map[key] = true;

      return true;
    }

    return false;
  });
};
