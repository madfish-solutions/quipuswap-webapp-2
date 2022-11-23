export class NotFoundPairError extends Error {
  constructor(fromTokenSlug: string, toTokenSlug: string) {
    super(`Pair ${fromTokenSlug}-${toTokenSlug} was not found`);
  }
}
