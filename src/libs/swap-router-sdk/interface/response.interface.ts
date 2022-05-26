import { BlockInterface } from './block.interface';
import { RoutePair } from './route-pair.interface';

export interface ResponseInterface {
  block: BlockInterface;
  routePairs: RoutePair[];
}
