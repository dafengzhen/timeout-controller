# TimeoutController

[![GitHub License](https://img.shields.io/github/license/dafengzhen/timeout-controller?color=blue)](https://github.com/dafengzhen/timeout-controller)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dafengzhen/timeout-controller/pulls)

`TimeoutController` 是一个基于 `setTimeout` 的高精度定时控制器，支持暂停、恢复、最大次数控制、循环模式、空闲回调模式（
`requestIdleCallback`），并可运行于浏览器与
Node.js 环境。相比原生 `setTimeout` 或 `setInterval`，它更灵活且具备更强的控制能力

[English](./README.md)

# 💡 它是什么？

`TimeoutController` 是一个可配置、可扩展的高级定时器，适用于复杂的时间控制任务。它封装了以下能力：

- 支持暂停与恢复
- 可配置是否循环
- 可设置最大执行次数
- 支持 requestIdleCallback 空闲调度
- 兼容浏览器与 Node.js 环境
- 可选使用 `setTimeout` 模拟 `setInterval` 精准调度
- 提供事件机制（如 `start`、`pause`、`tick`、`done` 等）可订阅响应

# 🚀 使用场景

- 在 UI 渲染空闲时分批执行任务（`requestIdleCallback`）
- 可中断、恢复的数据处理流程
- 精准控制任务频率，避免因延迟累计误差
- 限制任务执行次数，如轮询数据
- 控制任务节奏，如动画、任务节流器等

# 📦 安装

```shell
npm install timeoutx
```

# 🛠 使用示例

```ts
import {TimeoutController} from 'timeout-controller';

const controller = new TimeoutController(
  (count) => {
    console.log(`Tick: ${count}`);
  },
  1000, // 每次间隔 1000ms
  5,    // 最多执行 5 次
);

controller.on('tick', (count) => {
  console.log('Tick event:', count);
});

controller.once('done', () => {
  console.log('Done!');
});

controller.start();
```

## 暂停与恢复

```ts
controller.pause();

setTimeout(() => {
  controller.resume();
}, 3000);
```

## 启用 requestIdleCallback 模式（适用于浏览器）

```ts
controller.enableIdleCallbackMode(true);
controller.start();
```

# 📚 API 参考

## 构造函数

```text
new TimeoutController(
  callback: (count: number) => void,
  interval?: number, // 默认 1000ms
  maxCount?: number | null, // 默认 null（无限）
  loopMode?: boolean, // 是否循环模式（默认 false）
  useSetTimeoutIntervalMode?: boolean // 是否模拟 setInterval（默认 false）
)
```

## 事件类型

```ts
type EventName = 'done' | 'pause' | 'resume' | 'start' | 'stop' | 'tick';
```

## 实例方法

| 方法名                                     | 描述                             |
|-----------------------------------------|--------------------------------|
| `start()`                               | 启动定时器                          |
| `stop()`                                | 停止定时器并清除状态                     |
| `pause()`                               | 暂停计时                           |
| `resume()`                              | 恢复计时                           |
| `destroy()`                             | 停止并清除所有事件监听                    |
| `delayStart(ms: number)`                | 延迟 `ms` 毫秒后自动启动                |
| `setAutoPause(ms: number)`              | 指定时间后自动暂停                      |
| `setInterval(interval: number)`         | 设置新的时间间隔                       |
| `setMaxCount(count: number \| null)`    | 设置最大计数                         |
| `setLoopMode(loop: boolean)`            | 设置是否循环模式                       |
| `enableIdleCallbackMode(enable = true)` | 启用或关闭 `requestIdleCallback` 模式 |
| `on(event, listener)`                   | 注册事件                           |
| `once(event, listener)`                 | 注册一次性事件                        |
| `off(event, listener)`                  | 移除事件监听器                        |
| `isPaused()`                            | 是否处于暂停状态                       |
| `isRunning()`                           | 是否正在运行                         |
| `getCount()`                            | 当前已执行次数                        |

## 类型定义补充

```ts
type IdleDeadline = {
  didTimeout: boolean;
  timeRemaining: () => number;
};

type Listener = (...args: any[]) => void;
```

# 🔄 与 IntervalController 的区别与使用建议

| 特性   | TimeoutController           | IntervalController       |
|------|-----------------------------|--------------------------|
| 精度   | 高，模拟 setInterval            | 高，使用 RAF 或 setInterval   |
| 控制   | 支持 pause/resume/done        | 同样支持                     |
| 特殊模式 | 支持 requestIdleCallback      | 支持 requestAnimationFrame |
| 使用场景 | 非视觉任务、节奏控制、空闲执行             | 适合视觉任务、动画帧控制             |
| 执行方式 | 基于 setTimeout（可模拟 interval） | 原生 interval/RAF 双模式      |


建议：

- 使用 TimeoutController 处理 数据轮询、节流、空闲任务
- 使用 IntervalController 更适合 高频定时任务/动画控制/帧渲染节奏管理


# 🧑‍💻 License

[MIT](https://opensource.org/licenses/MIT)

