import ObserverService from 'ObserverService';

const observerService = new ObserverService({
  event: {
    arg1: '',
    arg2: '',
  },
  event2: {
    arg3: '',
  },
});

observerService.subscribe('event', ({ arg1, arg2 }) => {
  console.log('event subscribe', { arg1, arg2 });
});

observerService.emit('event', { arg1: 'test', arg2: 'test2' });
observerService.emit('event', { arg1: 'test', arg2: 'test2' });
