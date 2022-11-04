interface LedEntityLoading {
  loading: true;
  error: unknown;
  data: unknown;
}

interface LedEntityError {
  loading: false;
  error: Error;
  data: unknown;
}

interface LedEntityData<T> {
  loading: false;
  error: null;
  data: T;
}

export type LedEntity<T> = LedEntityLoading | LedEntityError | LedEntityData<T>;
