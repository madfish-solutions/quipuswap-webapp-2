export const resolveOrNull = async <T>(value: Promise<T>): Promise<T | null> => {
  try {
    return await value;
  } catch (e) {
    return null;
  }
};
