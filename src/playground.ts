import { z } from 'zod';
import ObserverService from 'ObserverService';

const observerService = new ObserverService({
  event: {
    arg1: z.string().min(5),
    arg2: z.number().max(0),
  },
  event2: {
    arg3: z.object({ arg4: z.string() }),
  },
});

observerService.subscribe('event', ({ arg1, arg2 }) => {
  console.log('event subscribe', { arg1, arg2 });
});

observerService.emit('event', { arg1: 'wrng', arg2: 1 });
observerService.emit('event2', {
  arg3: {
    arg4: 'string',
  },
});
