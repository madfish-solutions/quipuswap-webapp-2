export class NoPoolIdError extends Error {
  constructor() {
    super('Failed to get nullable poolId');
  }
}
