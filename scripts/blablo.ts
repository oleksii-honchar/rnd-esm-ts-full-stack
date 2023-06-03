import ora from 'ora';
/**
 * Helper functions
 */
const noop = {
  log: () => { /* stub */ },
  debug: () => { /* stub */ },
  info: () => { /* stub */ },
  warn: () => { /* stub */ },
  error: () => { /* stub */ },
};

/**
 * console log wrapper with some logging magic
 */
class Blablo {
  argsQueue: any[] = [];
  nativeConsole: any;
  logFn: Function;
  errFn: Function;
  spinner: any;
  constructor(options:{spinner:any}) {
    this.spinner = options?.spinner ?? undefined;
    this.nativeConsole = console || window.console || noop;
    this.logFn = this.nativeConsole.log;
    this.errFn = this.nativeConsole.error;
  }
  log (...args: any) {
    if (this.spinner.isSpinning) {
      // need to check whether it is new log or the same just updating
      // assume that first 20 chars will remain the same for same sequence
      const currPayload = this.argsQueue.join('');
      const nextPayload = args.join('');
      if (currPayload.slice(0, 40) !== nextPayload.slice(0, 40)) {
        this.spinner.succeed();
      }
    }

    this.argsQueue = [...args];
    const payload = this.argsQueue.join('');

    this.spinner.text = payload;
    !this.spinner.isSpinning && this.spinner.start();
    return this; // in order to be able to call clear()
  }

  error(...args: any) {
    this.errFn.apply(this.nativeConsole, args);
  }

  cleanLog (...args:any) {
    const payload = args.join('') + '\n';
    // process.stdout.write(payload);
    this.logFn.apply(this.nativeConsole, args);
  }
  chainLog (...args: any) {
    this.argsQueue = this.argsQueue.concat(args);
    const payload = this.argsQueue.join('');

    !this.spinner.isSpinning && this.spinner.start();

    this.spinner.text = payload;

    return this; // in order to be able to call clear()
  }
  finish () {
    this.argsQueue = [];
    this.spinner.succeed();
    // process.stdout.write('\n');
  }
}

const spinner = ora({ color:'yellow' });

export const blablo = new Blablo({ spinner });
