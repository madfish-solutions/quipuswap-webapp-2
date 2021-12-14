import { DexPair } from '@utils/types';

export type Vertex = {
  edges: Record<string, DexPair>;
};

export type DexGraph = Record<string, Vertex>;

export type CommonRouteProblemParams = {
  startTokenSlug: string;
  endTokenSlug: string;
  graph: DexGraph;
  depth?: number;
};
