interface EntityLoading {
  loading: true;
  error: unknown;
  data: unknown;
}

interface EntityError {
  loading: false;
  error: Error;
  data: unknown;
}

interface EntityData<T> {
  loading: false;
  error: null;
  data: T;
}

export type Entity<T> = EntityLoading | EntityError | EntityData<T>;
