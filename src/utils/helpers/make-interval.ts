import { Nullable } from '../types';
import { isExist } from './type-checks';

export class MakeInterval<T extends () => void> {
  private interval: Nullable<NodeJS.Timeout> = null;

  constructor(private readonly job: T, private readonly ms: number) {}

  start() {
    this.stop();
    this.interval = setInterval(this.job, this.ms);
  }

  stop() {
    if (isExist(this.interval)) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
