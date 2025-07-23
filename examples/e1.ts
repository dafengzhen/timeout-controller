import { TimeoutController } from '../src';

const controller = new TimeoutController((count) => console.log('tick', count), 1000, 5, false, false);

controller.on('tick', (count) => {
  if (count === 3) {
    controller.pause();
  }
});
controller.on('pause', () => {
  console.log('Paused, resume in 2s...');
  setTimeout(() => controller.resume(), 2000);
});
controller.on('done', () => {
  console.log('Finished!');
});

controller.start();
