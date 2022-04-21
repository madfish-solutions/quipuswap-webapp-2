import { isLoading } from './is-logging';

export const LCERROR = '\x1b[31m%s\x1b[0m'; //red
export const LCWARN = '\x1b[33m%s\x1b[0m'; //yellow
export const LCINFO = '\x1b[36m%s\x1b[0m'; //cyan
export const LCSUCCESS = '\x1b[32m%s\x1b[0m'; //green

export class Console {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  static log(...args) {
    if (!isLoading()) {
      return;
    }
    // eslint-disable-next-line
    console.log(...args);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  static success(...args) {
    if (!isLoading()) {
      return;
    }
    // eslint-disable-next-line
    console.log(LCSUCCESS, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  static warn(...args) {
    if (!isLoading()) {
      return;
    }
    // eslint-disable-next-line
    console.log(LCWARN, ...args);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  static info(...args) {
    if (!isLoading()) {
      return;
    }
    // eslint-disable-next-line
    console.log(LCINFO, ...args);
  }

  static error(error: Error | unknown) {
    if (!isLoading()) {
      return;
    }
    // eslint-disable-next-line
    console.error(LCERROR, '🛑_🛑 Error:', error);
  }
}
