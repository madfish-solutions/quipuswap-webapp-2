// TODO: Remove this solution by change architecture of Voting page

export interface BakerCleaner {
  set: (key: string, inner: () => void) => void;
  inners: Record<string, () => void>;
  run: () => void;
}

export const bakerCleaner: BakerCleaner = {
  set: (key: string, inner: () => void) => {
    bakerCleaner.inners[key] = inner;
  },
  inners: {},
  run: () => {
    for (const key in bakerCleaner.inners) {
      bakerCleaner.inners[key]();
    }
  }
};
