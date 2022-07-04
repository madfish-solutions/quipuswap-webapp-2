import { DexPair } from '@shared/types';

export interface Vertex {
  edges: Record<string, DexPair>;
}

export type DexGraph = Record<string, Vertex>;
