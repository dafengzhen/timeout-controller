type EventName = 'done' | 'pause' | 'resume' | 'start' | 'stop' | 'tick';

type IdleDeadline = { didTimeout: boolean; timeRemaining: () => number };

type Listener = (...args: any[]) => void;

const isBrowser = typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function';

const requestIdle = (cb: (deadline: IdleDeadline) => void): number =>
  isBrowser ? window.requestIdleCallback(cb) : setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 1);

const cancelIdle = (id: number) =>
  isBrowser && typeof window.cancelIdleCallback === 'function' ? window.cancelIdleCallback(id) : clearTimeout(id);

/**
 * TimeoutController.
 *
 * @author dafengzhen
 */
export class TimeoutController {
  private readonly callback: (count: number) => void;

  private counter = 0;

  private eventListeners = new Map<EventName, Set<Listener>>();

  private interval: number;

  private loopMode: boolean;

  private maxCount: null | number;

  private nextScheduledTime = 0;

  private onceListeners = new Map<EventName, Set<Listener>>();

  private paused = false;

  private running = false;

  private timerId: null | number = null;

  private useIdleCallback = false;

  private readonly useSetTimeoutIntervalMode: boolean;

  constructor(
    callback: (count: number) => void,
    interval = 1000,
    maxCount: null | number = null,
    loopMode = false,
    useSetTimeoutIntervalMode = false,
  ) {
    this.callback = callback;
    this.interval = interval;
    this.maxCount = maxCount;
    this.loopMode = loopMode;
    this.useSetTimeoutIntervalMode = useSetTimeoutIntervalMode;
  }

  delayStart(ms: number): void {
    setTimeout(() => this.start(), ms);
  }

  destroy(): void {
    this.stop();
    this.eventListeners.clear();
    this.onceListeners.clear();
  }

  enableIdleCallbackMode(enable = true): void {
    this.useIdleCallback = enable;
  }

  getCount(): number {
    return this.counter;
  }

  isPaused(): boolean {
    return this.paused;
  }

  isRunning(): boolean {
    return this.running;
  }

  off(event: EventName, listener: Listener): this {
    this.eventListeners.get(event)?.delete(listener);
    this.onceListeners.get(event)?.delete(listener);
    return this;
  }

  on(event: EventName, listener: Listener): this {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(listener);
    return this;
  }

  once(event: EventName, listener: Listener): this {
    if (!this.onceListeners.has(event)) {
      this.onceListeners.set(event, new Set());
    }
    this.onceListeners.get(event)!.add(listener);
    return this;
  }

  pause(): void {
    if (!this.running || this.paused) {
      return;
    }
    this.paused = true;
    this.clearTimer();
    this.emit('pause');
  }

  resume(): void {
    if (!this.running || !this.paused) {
      return;
    }
    this.paused = false;
    this.emit('resume');
    this.nextScheduledTime = Date.now() + this.interval;
    this.scheduleNext();
  }

  setAutoPause(ms: number): void {
    setTimeout(() => this.running && this.pause(), ms);
  }

  setInterval(interval: number): void {
    this.interval = interval;
  }

  setLoopMode(loop: boolean): void {
    this.loopMode = loop;
  }

  setMaxCount(maxCount: null | number): void {
    this.maxCount = maxCount;
  }

  start(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    this.paused = false;
    this.counter = 0;
    this.nextScheduledTime = Date.now() + this.interval;
    this.emit('start');
    this.scheduleNext();
  }

  stop(): void {
    if (!this.running) {
      return;
    }
    this.clearTimer();
    this.running = false;
    this.paused = false;
    this.emit('stop');
  }

  private clearTimer(): void {
    if (this.timerId != null) {
      if (this.useIdleCallback) {
        cancelIdle(this.timerId);
      } else {
        clearTimeout(this.timerId);
      }
      this.timerId = null;
    }
  }

  private emit(event: EventName, ...args: any[]): void {
    this.eventListeners.get(event)?.forEach((fn) => fn(...args));
    const onceSet = this.onceListeners.get(event);
    if (onceSet) {
      onceSet.forEach((fn) => fn(...args));
      onceSet.clear();
    }
  }

  private loop = (): void => {
    if (!this.running || this.paused) {
      return;
    }

    this.callback(this.counter);
    this.emit('tick', this.counter);
    this.counter++;

    const done = this.maxCount !== null && this.counter >= this.maxCount;
    if (done) {
      this.emit('done');
      if (this.loopMode) {
        this.counter = 0;
        this.nextScheduledTime = Date.now() + this.interval;
        this.scheduleNext();
      } else {
        this.stop();
      }
      return;
    }

    if (this.useSetTimeoutIntervalMode) {
      this.nextScheduledTime += this.interval;
      const delay = Math.max(0, this.nextScheduledTime - Date.now());
      this.timerId = setTimeout(this.loop, delay) as unknown as number;
    } else {
      this.scheduleNext();
    }
  };

  private scheduleNext(): void {
    this.clearTimer();

    if (this.useIdleCallback) {
      this.timerId = requestIdle(() => this.loop());
    } else if (this.useSetTimeoutIntervalMode) {
      const delay = Math.max(0, this.nextScheduledTime - Date.now());
      this.timerId = setTimeout(this.loop, delay) as unknown as number;
    } else {
      this.timerId = setTimeout(this.loop, this.interval) as unknown as number;
    }
  }
}
