import { TimeoutController } from '../src';

const controller = new TimeoutController(
  (count) => {
    console.log(`Tick: ${count}`);
  },
  1000,
  5,
);

controller.on('tick', (count) => {
  console.log('Tick event:', count);
});

controller.once('done', () => {
  console.log('Done!');
});

controller.start();
