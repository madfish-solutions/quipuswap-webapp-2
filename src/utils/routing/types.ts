import { DexPair } from '@utils/types';

export interface Vertex {
  edges: Record<string, DexPair>;
}

export type DexGraph = Record<string, Vertex>;

export interface CommonRouteProblemParams {
  startTokenSlug: string;
  endTokenSlug: string;
  graph: DexGraph;
  depth?: number;
}
