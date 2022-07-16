import EventBus from './EventBus';
import { EventTypes, Namespace } from './EventTypes';

const bus = new EventBus();

export { bus as EventBus, EventTypes, Namespace };
