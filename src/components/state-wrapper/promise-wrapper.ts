enum PromiseStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export function wrapPromise<T>(promise: Promise<T>) {
  let status = PromiseStatus.PENDING;
  let result: T;
  const suspender = promise.then(
    res => {
      status = PromiseStatus.SUCCESS;
      result = res;
    },
    error => {
      status = PromiseStatus.ERROR;
      result = error;
    }
  );

  return {
    read(): T {
      switch (status) {
        case PromiseStatus.PENDING:
          throw suspender;
        case PromiseStatus.ERROR:
          throw result;
        case PromiseStatus.SUCCESS:
          return result;
      }
    }
  };
}
