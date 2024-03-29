interface Namespace {
  on: (...args: any) => void;
  remove: (...args: any) => void;
  emit: (...args: any) => void;
  eventBucket: NamespaceEventBucket;
}

interface NamespaceEventBucket {
  [eventName: string]: EventHandler[];
}

interface EventHandler {
  (...args: any): void;
}

export default class EventBus {
  private static _instance: EventBus;

  static get instance(): EventBus {
    if (!this._instance) {
      this._instance = new EventBus();
    }

    return this._instance;
  }

  private defaultNamespace: string = '';

  private namespaceCache: Map<string, Namespace> = new Map();

  constructor() {
    if (EventBus._instance) {
      return EventBus._instance;
    }

    this.defaultNamespace = 'default';
    this.namespaceCache = new Map<string, Namespace>();

    EventBus._instance = this;
  }

  public clean(): void {
    this.namespaceCache.clear();
  }

  public namespace(inputName: string): Namespace {
    const name = inputName || this.defaultNamespace; // 命名空间

    if (this.namespaceCache?.get(name)) {
      return this.namespaceCache.get(name)!;
    }

    const namespace: Namespace = {
      on: (key: string, fn: EventHandler) => {
        this.on(name, key, fn);
      },
      remove: (key: string, fn: EventHandler) => {
        this.remove(name, key, fn);
      },
      emit(...args: any) {
        const [event, params] = args;
        const eventHandlers = this.eventBucket?.[event];
        if (eventHandlers?.length) {
          eventHandlers.forEach((handler: EventHandler) => {
            handler(params);
          });
        }
      },
      eventBucket: {}, // 闭包中的事件缓存
    };

    this.namespaceCache.set(name, namespace);

    return namespace;
  }

  // 监听一个事件
  private on = (name: string, key: string, fn: EventHandler) => {
    const namespace = this.namespaceCache?.get(name);
    if (!namespace) {
      return;
    }

    const cache = namespace.eventBucket;
    if (!cache[key]) {
      cache[key] = [];
    }
    cache[key]!.push(fn);
  };

  // 移除一个事件。如果fn为空，则清空该事件下的所有事件
  private remove = (name: string, key: string, fn?: EventHandler) => {
    const namespace = this.namespaceCache?.get(name);
    if (!namespace) {
      return;
    }

    const cache = namespace.eventBucket;
    if (!cache[key]) {
      return;
    }
    if (!fn) {
      cache[key] = [];
      return;
    }
    for (let i = cache[key]!.length; i >= 0; i--) {
      if (cache[key]![i] === fn) {
        cache[key]!.splice(i, 1);
      }
    }
  };
}
