import { DexPool } from '@modules/swap/types';

export interface Vertex {
  edges: Record<string, DexPool>;
}

export type DexGraph = Record<string, Vertex>;
