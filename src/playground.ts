import { z } from 'zod';
import ObserverService from 'ObserverService';

const observerService = new ObserverService({
  event: {
    arg1: z.string(),
    arg2: z.number(),
  },
  event2: {
    arg3: z.object({ arg4: z.string() }),
  },
});

observerService.subscribe('event', ({ arg1, arg2 }) => {
  console.log('event subscribe', { arg1, arg2 });
});

observerService.emit('event', { arg1: 'string', arg2: 0 });
observerService.emit('event2', {
  arg3: {
    arg4: 'string',
  },
});
