export class InvalidTokensListError extends Error {
  constructor(json: unknown) {
    super(`Invalid response for tokens list was received: ${JSON.stringify(json)}`);
  }
}
