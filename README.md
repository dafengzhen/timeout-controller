# TimeoutController

[![GitHub License](https://img.shields.io/github/license/dafengzhen/timeout-controller?color=blue)](https://github.com/dafengzhen/timeout-controller)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dafengzhen/timeout-controller/pulls)

`TimeoutController` is a high-precision timer controller based on setTimeout. It supports pause/resume, max execution
count, loop mode, idle callback mode (`requestIdleCallback`), and is compatible with both browsers and Node.js
environments. Compared to native `setTimeout` or `setInterval`, it offers greater flexibility and more powerful control
features.

[简体中文](./README.zh.md)

# What is it?

`TimeoutController` is a configurable and extensible advanced timer utility designed for complex timing tasks. It
provides the following capabilities:

- Supports pause and resume
- Optional loop mode
- Max execution count configuration
- `requestIdleCallback` support
- Cross-environment support: browser & Node.js
- Optional interval emulation using `setTimeout`
- Event system (e.g., `start`, `pause`, `tick`, `done`) for reactive control

# 🚀 Use Cases

- Batch processing during UI idle time (`requestIdleCallback`)
- Interruptible and resumable data workflows
- Precise control over task frequency, avoiding cumulative delay errors
- Limited execution tasks (e.g., data polling)
- Controlled pacing for animations, throttlers, or background tasks

# 📦 Installation

```shell
npm install timeoutx
```

# 🛠 Usage Example

```ts
import {TimeoutController} from 'timeout-controller';

const controller = new TimeoutController(
  (count) => {
    console.log(`Tick: ${count}`);
  },
  1000, // Interval in milliseconds
  5     // Maximum executions
);

controller.on('tick', (count) => {
  console.log('Tick event:', count);
});

controller.once('done', () => {
  console.log('Done!');
});

controller.start();
```

## Pause & Resume

```shell
controller.pause();

setTimeout(() => {
  controller.resume();
}, 3000);
```

## Enable requestIdleCallback Mode (Browser Only)

```ts
controller.enableIdleCallbackMode(true);
controller.start();
```

# 📚 API Reference

## Constructor

```text
new TimeoutController(
  callback: (count: number) => void,
  interval?: number, // default: 1000ms
  maxCount?: number | null, // default: null (infinite)
  loopMode?: boolean, // default: false
  useSetTimeoutIntervalMode?: boolean // emulate setInterval, default: false
)
```

## Event Types

```ts
type EventName = 'done' | 'pause' | 'resume' | 'start' | 'stop' | 'tick';
```

## Instance Methods

| Method                                  | Description                                   |
|-----------------------------------------|-----------------------------------------------|
| `start()`                               | Start the timer                               |
| `stop()`                                | Stop and reset timer                          |
| `pause()`                               | Pause the timer                               |
| `resume()`                              | Resume the timer                              |
| `destroy()`                             | Stop and remove all listeners                 |
| `delayStart(ms: number)`                | Start automatically after a delay (in ms)     |
| `setAutoPause(ms: number)`              | Auto-pause after a specified duration (in ms) |
| `setInterval(interval: number)`         | Set a new interval duration                   |
| `setMaxCount(count: number \| null)`    | Set the maximum execution count               |
| `setLoopMode(loop: boolean)`            | Enable or disable loop mode                   |
| `enableIdleCallbackMode(enable = true)` | Enable/disable `requestIdleCallback` mode     |
| `on(event, listener)`                   | Register event listener                       |
| `once(event, listener)`                 | Register a one-time event listener            |
| `off(event, listener)`                  | Remove an event listener                      |
| `isPaused()`                            | Check if the timer is currently paused        |
| `isRunning()`                           | Check if the timer is running                 |
| `getCount()`                            | Get current execution count                   |

## Type Definitions

```ts
type IdleDeadline = {
  didTimeout: boolean;
  timeRemaining: () => number;
};

type Listener = (...args: any[]) => void;
```

# 🔄 Comparison with IntervalController

| Feature      | TimeoutController                             | IntervalController                    |
|--------------|-----------------------------------------------|---------------------------------------|
| Precision    | High (emulates `setInterval`)                 | High (via RAF or `setInterval`)       |
| Control      | Supports pause/resume/done                    | Same                                  |
| Special Mode | `requestIdleCallback` supported               | `requestAnimationFrame` supported     |
| Use Cases    | Non-visual tasks, throttling, idle tasks      | Visual tasks, animation, frame pacing |
| Execution    | Based on `setTimeout` (can simulate interval) | Native `setInterval`/RAF              |

Recommendation:

- Use TimeoutController for data polling, throttling, and idle-time execution.
- Use IntervalController for high-frequency tasks, animation control, or frame synchronization.

# 🧑‍💻 License

[MIT](https://opensource.org/licenses/MIT)

