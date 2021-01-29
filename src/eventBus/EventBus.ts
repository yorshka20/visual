/*
 * @Author: yorshka
 * @Date: 2021-01-19 16:24:29
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 23:42:18
 *
 * EventBus 工具类
 * 需要从全局作用于立即执行函数重构为class，否则会导致无法追踪的匿名监听器残留
 */

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

  private defaultNamespace: string;

  private namespaceCache: Map<string, Namespace>;

  constructor() {
    if (EventBus._instance) {
      return EventBus._instance;
    }

    this.defaultNamespace = 'default';
    this.namespaceCache = new Map<string, Namespace>();

    EventBus._instance = this;
  }

  public clean(): void {
    this.namespaceCache = null;

    EventBus._instance = null;
  }

  public namespace(inputName: string): Namespace {
    const name = inputName || this.defaultNamespace; // 命名空间

    if (this.namespaceCache?.get(name)) {
      return this.namespaceCache.get(name);
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
  private on = function (name: string, key: string, fn: EventHandler): void {
    const namespace = this.namespaceCache?.get(name);
    if (!namespace) {
      return;
    }

    const cache = namespace.eventBucket;
    if (!cache[key]) {
      cache[key] = [];
    }
    cache[key].push(fn);
  };

  // 移除一个事件。如果fn为空，则清空该事件下的所有事件
  private remove = function (
    name: string,
    key: string,
    fn?: EventHandler
  ): void {
    const namespace = this.namespaceCache?.get(name);
    if (!namespace) {
      return;
    }

    const cache = namespace.eventBucket;
    if (cache[key]) {
      if (fn) {
        for (let i = cache[key].length; i >= 0; i--) {
          if (cache[key][i] === fn) {
            cache[key].splice(i, 1);
          }
        }
      } else {
        cache[key] = [];
      }
    }
  };
}
