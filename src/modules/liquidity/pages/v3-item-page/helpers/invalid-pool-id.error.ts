export class InvalidPoolIdError extends Error {
  constructor(poolId: string) {
    super(`Pool id ${poolId} is invalid`);
  }
}
