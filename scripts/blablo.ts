import ora, { Options } from "ora";
import { Color, Ora } from "ora";
import { SpinnerName } from "cli-spinners";
/**
 * Helper functions
 */
const noop = {
  log: () => {
    /* stub */
  },
  debug: () => {
    /* stub */
  },
  info: () => {
    /* stub */
  },
  warn: () => {
    /* stub */
  },
  error: () => {
    /* stub */
  },
};

/**
 * console log wrapper with some logging magic
 */
class Blablo {
  argsQueue: any[] = [];
  nativeConsole: any;
  logFn: Function;
  warnFn: Function;
  errFn: Function;
  currSpinner: any;
  ora: Ora;
  defaultSpinnerName: string = "dots";
  defaultSpinnerColor: string = "yellow";

  constructor(options: { ora: (options?: string | Options) => Ora }) {
    // @ts-ignore
    this.ora = options.ora;
    this.resetSpinner();

    this.nativeConsole = console || window.console || noop;
    this.logFn = this.nativeConsole.log;
    this.warnFn = this.nativeConsole.warn;
    this.errFn = this.nativeConsole.error;
  }
  log(...args: any) {
    if (this.currSpinner.isSpinning) {
      // need to check whether it is new log or the same just updating
      // assume that first 20 chars will remain the same for same sequence
      const currPayload = this.argsQueue.join("");
      const nextPayload = args.join("");
      if (currPayload.slice(0, 40) !== nextPayload.slice(0, 40)) {
        this.currSpinner.succeed();
      }
    }

    this.argsQueue = [...args];
    const payload = this.argsQueue.join("");

    this.currSpinner.text = payload;
    !this.currSpinner.isSpinning && this.currSpinner.start();
    return this; // in order to be able to call clear()
  }

  error(...args: any) {
    this.errFn.apply(this.nativeConsole, args);
  }
  warn(...args: any) {
    this.warnFn.apply(this.nativeConsole, args);
  }

  cleanLog(...args: any) {
    const payload = args.join("") + "\n";
    // process.stdout.write(payload);
    this.logFn.apply(this.nativeConsole, args);
  }
  chainLog(...args: any) {
    this.argsQueue = this.argsQueue.concat(args);
    const payload = this.argsQueue.join("");

    !this.currSpinner.isSpinning && this.currSpinner.start();

    this.currSpinner.text = payload;

    return this; // in order to be able to call clear()
  }
  finish() {
    this.argsQueue = [];
    this.currSpinner.succeed();
    this.resetSpinner();
  }

  resetSpinner() {
    this.currSpinner = ora({
      spinner: this.defaultSpinnerName as SpinnerName,
      color: this.defaultSpinnerColor as Color,
    });
  }
  useSpinner(name: string) {
    this.currSpinner = ora({
      spinner: name as SpinnerName,
      color: this.defaultSpinnerColor as Color,
    });
    return this;
  }
}

export const blablo = new Blablo({ ora });
