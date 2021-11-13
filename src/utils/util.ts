export const unPack = <T>(value: T | Promise<T>) => {
  if (value instanceof Promise) {
    return value;
  }
  if (value instanceof Error) {
    return Promise.reject(value);
  }
  return Promise.resolve(value);
};
