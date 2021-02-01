'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:43:14
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 17:26:28
 *
 * 自定义canvas类型，大小与容器一致
 */
var Canvas = /** @class */ (function () {
    function Canvas(options) {
        var container = options.container, zIndex = options.zIndex, hide = options.hide, id = options.id;
        //   保存canvas挂载容器
        this.container = container;
        //   创建canvas元素
        var canvas = document.createElement('canvas');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        // 设置id
        canvas.setAttribute('id', id);
        //   set absolute position for multiple-layer canvas layout.
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        // 设置z层级
        canvas.style.zIndex = zIndex + '';
        //   store canvas element
        this.canvasEle = canvas;
        this.ctx = canvas.getContext('2d');
        // 设置层叠顺序
        this.ctx.globalCompositeOperation = 'source-over';
        // 初始化stroke样式(default)
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#000';
        //   mount canvas element
        if (!hide) {
            this.container.appendChild(canvas);
        }
    }
    return Canvas;
}());

// mesh格子大小
var GRIDSIZE = 10;
// 点击变色色列
var COLOR_SET = ['#FF0000', '#EE0000', '#CD0000', '#8B0000'];

/*
 * @Author: yorshka
 * @Date: 2021-01-19 16:24:29
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 23:52:35
 *
 * EventBus 工具类
 * 需要从全局作用域iife重构为class，否则会导致无法追踪的匿名监听器残留
 */
var EventBus = /** @class */ (function () {
    function EventBus() {
        // 监听一个事件
        this.on = function (name, key, fn) {
            var _a;
            var namespace = (_a = this.namespaceCache) === null || _a === void 0 ? void 0 : _a.get(name);
            if (!namespace) {
                return;
            }
            var cache = namespace.eventBucket;
            if (!cache[key]) {
                cache[key] = [];
            }
            cache[key].push(fn);
        };
        // 移除一个事件。如果fn为空，则清空该事件下的所有事件
        this.remove = function (name, key, fn) {
            var _a;
            var namespace = (_a = this.namespaceCache) === null || _a === void 0 ? void 0 : _a.get(name);
            if (!namespace) {
                return;
            }
            var cache = namespace.eventBucket;
            if (cache[key]) {
                if (fn) {
                    for (var i = cache[key].length; i >= 0; i--) {
                        if (cache[key][i] === fn) {
                            cache[key].splice(i, 1);
                        }
                    }
                }
                else {
                    cache[key] = [];
                }
            }
        };
        if (EventBus._instance) {
            return EventBus._instance;
        }
        this.defaultNamespace = 'default';
        this.namespaceCache = new Map();
        EventBus._instance = this;
    }
    Object.defineProperty(EventBus, "instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new EventBus();
            }
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    EventBus.prototype.clean = function () {
        this.namespaceCache = null;
        EventBus._instance = null;
    };
    EventBus.prototype.namespace = function (inputName) {
        var _this = this;
        var _a;
        var name = inputName || this.defaultNamespace; // 命名空间
        if ((_a = this.namespaceCache) === null || _a === void 0 ? void 0 : _a.get(name)) {
            return this.namespaceCache.get(name);
        }
        var namespace = {
            on: function (key, fn) {
                _this.on(name, key, fn);
            },
            remove: function (key, fn) {
                _this.remove(name, key, fn);
            },
            emit: function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _b = __read(args, 2), event = _b[0], params = _b[1];
                var eventHandlers = (_a = this.eventBucket) === null || _a === void 0 ? void 0 : _a[event];
                if (eventHandlers === null || eventHandlers === void 0 ? void 0 : eventHandlers.length) {
                    eventHandlers.forEach(function (handler) {
                        handler(params);
                    });
                }
            },
            eventBucket: {},
        };
        this.namespaceCache.set(name, namespace);
        return namespace;
    };
    return EventBus;
}());

/**
 * 消息类型
 */
var EventTypes;
(function (EventTypes) {
    EventTypes["MOVE"] = "move";
    EventTypes["MOUSEDOWN"] = "mousedown";
    EventTypes["HOVER"] = "hover";
    EventTypes["CLICK"] = "click";
    EventTypes["SHAPE"] = "shape";
})(EventTypes || (EventTypes = {}));
/**
 * 消息命名空间
 */
var Namespace;
(function (Namespace) {
    Namespace["INTERACTION"] = "interaction";
    Namespace["INIT"] = "init";
})(Namespace || (Namespace = {}));

var bus = new EventBus();

/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:35:02
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 18:56:51
 */
// 包围盒
var BoundingBox = /** @class */ (function () {
    function BoundingBox(data) {
        var x = data.x, y = data.y, width = data.width, height = data.height;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return BoundingBox;
}());

/*
 * @Author: yorshka
 * @Date: 2021-01-30 13:13:02
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-31 14:56:49
 */
// 返回一个矩形
function computeBoundingBox(shape) {
    return new BoundingBox({
        x: shape.x - shape.radius,
        y: shape.y - shape.radius,
        width: 2 * shape.radius,
        height: 2 * shape.radius,
    });
}
// 两点之间距离
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

/*
 * @Author: yorshka
 * @Date: 2021-01-30 17:18:10
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 20:31:48
 *
 * 高亮层，绘制鼠标感知状态
 */
/** @class */ ((function (_super) {
    __extends(Highlight, _super);
    function Highlight(options) {
        var _this = _super.call(this, options) || this;
        _this.hoverHandler = function (shape) {
            _this.hoverTarget = shape;
        };
        //   设置高亮stroke颜色
        _this.ctx.strokeStyle = '#00FF00';
        _this._target = null;
        //   初始化监听器
        _this.init();
        return _this;
    }
    Object.defineProperty(Highlight.prototype, "hoverTarget", {
        get: function () {
            return this._target;
        },
        set: function (val) {
            var _a;
            if (!val) {
                this.clean();
                return;
            }
            if (val.id !== ((_a = this._target) === null || _a === void 0 ? void 0 : _a.id) || !this._target) {
                this._target = val;
                this.clean();
                this.drawHighlight(val);
            }
        },
        enumerable: false,
        configurable: true
    });
    Highlight.prototype.destroy = function () {
        this.uninit();
    };
    Highlight.prototype.init = function () {
        bus.namespace(Namespace.INTERACTION).on(EventTypes.HOVER, this.hoverHandler);
    };
    Highlight.prototype.uninit = function () {
        bus.namespace(Namespace.INTERACTION).remove(EventTypes.HOVER);
    };
    // 绘制高亮框
    Highlight.prototype.drawHighlight = function (shape) {
        var rect = computeBoundingBox(shape);
        this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    };
    Highlight.prototype.clean = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
    };
    return Highlight;
}(Canvas)));

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return _root.Date.now();
};

var now_1 = now;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol_1(value)) {
    return NAN;
  }
  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber_1(wait) || 0;
  if (isObject_1(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber_1(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now_1();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now_1());
  }

  function debounced() {
    var time = now_1(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

var debounce_1 = debounce;

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  if (isObject_1(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce_1(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

var throttle_1 = throttle;

/*
 * @Author: yorshka
 * @Date: 2021-01-29 23:38:02
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 20:52:58
 *
 * 交互感知层
 */
var Interaction = /** @class */ (function () {
    function Interaction(options) {
        this.mouseMoveHandler = function (e) {
            return throttle_1(function (e) {
                var offsetX = e.offsetX, offsetY = e.offsetY;
                // 发送事件
                bus.namespace(Namespace.INTERACTION).emit(EventTypes.MOVE, {
                    x: offsetX,
                    y: offsetY,
                });
            }, 20)(e);
        };
        this.mouseDownHandler = function (e) {
            var offsetX = e.offsetX, offsetY = e.offsetY;
            // 发送事件
            bus.namespace(Namespace.INTERACTION).emit(EventTypes.MOUSEDOWN, {
                x: offsetX,
                y: offsetY,
            });
        };
        this.target = options.target.canvasEle;
        this.init();
    }
    // 销毁
    Interaction.prototype.destroy = function () {
        this.target.removeEventListener('mousedown', this.mouseDownHandler);
        this.target.removeEventListener('mousemove', this.mouseMoveHandler);
    };
    // 挂载监听器
    Interaction.prototype.init = function () {
        this.target.addEventListener('mousedown', this.mouseDownHandler);
        this.target.addEventListener('mousemove', this.mouseMoveHandler);
    };
    return Interaction;
}());

/*
 * @Author: yorshka
 * @Date: 2021-01-30 15:08:51
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 22:00:05
 */
// 获得shape cover的格子
function getCoveredGrid(x, y, radius, gridSize) {
    var list = [];
    // boundingBox三顶点： 左上，右上，左下
    var lt = [x - radius < 0 ? 0 : x - radius, y - radius < 0 ? 0 : y - radius];
    var rt = [x + radius, y - radius < 0 ? 0 : y - radius];
    var lb = [x - radius < 0 ? 0 : x - radius, y + radius];
    // console.log('x,y,radius', x, y, radius);
    // console.log('lt,rt,lb', lt, rt, lb);
    var xAxis = [Math.floor(lt[0] / gridSize), Math.floor(rt[0] / gridSize)];
    var yAxis = [Math.floor(lt[1] / gridSize), Math.floor(lb[1] / gridSize)];
    // console.log('xAxis,yAxis', xAxis, yAxis);
    for (var x_1 = xAxis[0]; x_1 <= xAxis[1]; x_1++) {
        for (var y_1 = yAxis[0]; y_1 <= yAxis[1]; y_1++) {
            list.push(x_1 + ":" + y_1);
        }
    }
    // console.log('list', list);
    return list;
}
// 获取point在mesh中最近的grid位置
function getMeshGrid(x, y, gridSize) {
    var gx = Math.floor(x / gridSize);
    var gy = Math.floor(y / gridSize);
    return [gx, gy];
}
// 计算cover区域
function getCoverArea(x, y, radius, gridSize) {
    var area = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };
    // boundingBox三顶点： 左上，右上，左下
    var lt = [x - radius < 0 ? 0 : x - radius, y - radius < 0 ? 0 : y - radius];
    var rt = [x + radius, y - radius < 0 ? 0 : y - radius];
    var lb = [x - radius < 0 ? 0 : x - radius, y + radius];
    var xAxis = [Math.floor(lt[0] / gridSize), Math.floor(rt[0] / gridSize)];
    var yAxis = [Math.floor(lt[1] / gridSize), Math.floor(lb[1] / gridSize)];
    area.x = xAxis[0] * gridSize;
    area.y = yAxis[0] * gridSize;
    area.width = xAxis[1] * gridSize + gridSize - area.x;
    area.height = yAxis[1] * gridSize + gridSize - area.y;
    return area;
}

/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:34:19
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-31 16:08:25
 *
 * mesh实例，用来作为网格坐标层
 */
var Mesh = /** @class */ (function (_super) {
    __extends(Mesh, _super);
    function Mesh(options) {
        var _this = _super.call(this, options) || this;
        // 监听鼠标移动，计算当前hover shape
        _this.handleMouseMove = function (point) {
            var _a;
            var grid = getMeshGrid(point.x, point.y, _this.gridSize).join(':');
            var cache = _this.gridCache.get(grid);
            if (cache) {
                if ((_a = cache === null || cache === void 0 ? void 0 : cache.list) === null || _a === void 0 ? void 0 : _a.length) {
                    var shape = _this.shapeBucket.get(cache.list[0]);
                    bus.namespace(Namespace.INTERACTION).emit(EventTypes.HOVER, shape);
                    return;
                }
            }
            bus.namespace(Namespace.INTERACTION).emit(EventTypes.HOVER, null);
        };
        // 鼠标点击
        _this.handleMouseDown = function (point) {
            var _a;
            var grid = getMeshGrid(point.x, point.y, _this.gridSize).join(':');
            // console.log('grid', grid);
            var cache = _this.gridCache.get(grid);
            if (cache) {
                if ((_a = cache === null || cache === void 0 ? void 0 : cache.list) === null || _a === void 0 ? void 0 : _a.length) {
                    // 此处可精细化处理：
                    // 1. 缩小搜索范围，将list中shape重新按照zindex排序
                    var shapeList = cache.list.map(function (i) { return _this.shapeBucket.get(i); });
                    shapeList.sort(function (a, b) { return b.zIndex - a.zIndex; });
                    // 2. 精确计算被点击元素
                    var len = shapeList.length;
                    var target = shapeList[0];
                    for (var i = 0; i < len; i++) {
                        var shape = shapeList[i];
                        var radius = getDistance(point.x, point.y, shape.x, shape.y);
                        if (radius <= shape.radius) {
                            target = shape;
                            break;
                        }
                    }
                    target.zIndex = shapeList[0].zIndex + 1;
                    // 直接修改，不好吗？
                    _this.gridCache.get(grid).list = shapeList.map(function (i) { return i.id; });
                    bus.namespace(Namespace.INTERACTION).emit(EventTypes.CLICK, target);
                    return;
                }
            }
        };
        _this.handleShapeReady = function (shape) {
            console.log('shape ready', shape);
            _this.recordShape(shape);
        };
        if (Mesh.instance) {
            return Mesh.instance;
        }
        // 初始化缓存
        _this.shapeBucket = new Map();
        _this.gridCache = new Map();
        // 记录格点大小
        _this.gridSize = options.gridSize;
        // 初始化监听器
        _this.initListener();
        Mesh.instance = _this;
        return _this;
    }
    Mesh.prototype.destroy = function () {
        bus.namespace(Namespace.INTERACTION).remove(EventTypes.MOVE);
        bus.namespace(Namespace.INIT).remove(EventTypes.SHAPE);
        bus.namespace(Namespace.INTERACTION).remove(EventTypes.MOUSEDOWN);
    };
    Mesh.prototype.initListener = function () {
        // shape初始化事件
        bus.namespace(Namespace.INIT).on(EventTypes.SHAPE, this.handleShapeReady);
        // 鼠标移动事件
        bus.namespace(Namespace.INTERACTION).on(EventTypes.MOVE, this.handleMouseMove);
        // 鼠标点击事件
        bus.namespace(Namespace.INTERACTION).on(EventTypes.MOUSEDOWN, this.handleMouseDown);
    };
    // 录入图形，形成坐标
    Mesh.prototype.recordShape = function (shape) {
        var id = shape.id;
        // 记录原始数据
        this.shapeBucket.set(id, shape);
        // 更新格点缓存
        this.updateGridCache(shape);
    };
    // 删除图形
    // TODO: 优化性能
    Mesh.prototype.removeShape = function (shape) {
        var _this = this;
        var id = shape.id, meshGridList = shape.meshGridList, zIndex = shape.zIndex;
        this.shapeBucket.delete(id);
        meshGridList.forEach(function (grid) {
            var cache = _this.gridCache.get(grid);
            if (cache) {
                cache.list = cache.list.filter(function (i) { return i != id; });
                if (cache.topIndex == zIndex && cache.list.length) {
                    var topShape = _this.shapeBucket.get(cache.list[0]);
                    cache.topIndex = topShape.zIndex;
                }
                _this.gridCache.set(grid, cache);
            }
        });
    };
    // 格点缓存
    // 此处并未实现真实的zindex倒序排列，因此最终效果有偏差
    Mesh.prototype.updateGridCache = function (shape) {
        var _this = this;
        var id = shape.id, meshGridList = shape.meshGridList, zIndex = shape.zIndex;
        meshGridList.forEach(function (grid) {
            var cache = _this.gridCache.get(grid);
            if (!cache) {
                cache = {
                    list: [],
                    topIndex: 0,
                };
            }
            var topIndex = cache.topIndex, list = cache.list;
            // 更新最大zindex
            if (zIndex > topIndex) {
                topIndex = zIndex;
                list.unshift(id);
            }
            else {
                list.push(id);
            }
            // 更新缓存
            _this.gridCache.set(grid, { topIndex: topIndex, list: list });
        });
    };
    // 辅助方法：渲染格子
    Mesh.prototype.fillGrid = function (grid) {
        var _a = __read(grid.split(':').map(function (i) { return Number(i); }), 2), x = _a[0], y = _a[1];
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
    };
    // 渲染网格坐标
    Mesh.prototype.renderGrid = function () {
        var ctx = this.ctx;
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#d2e2f7';
        var gridSize = this.gridSize;
        var xStart = 0;
        var xEnd = this.container.clientWidth;
        var yStart = 0;
        var yEnd = this.container.clientHeight;
        ctx.beginPath();
        // 画网格, x axios
        for (var x = xStart; x <= xEnd + gridSize; x += gridSize) {
            // 超出坐标系绘制，防止有空隙
            ctx.moveTo(x, yStart - gridSize);
            ctx.lineTo(x, yEnd + gridSize);
        }
        // 画网格, y axios
        for (var y = yStart; y <= yEnd + gridSize; y += gridSize) {
            // 超出坐标系绘制，防止有空隙
            ctx.moveTo(xStart - gridSize, y);
            ctx.lineTo(xEnd + gridSize, y);
        }
        var xOffset = 0;
        var yOffset = 0;
        // 画格线交点
        for (var x = xStart - gridSize; x <= xEnd; x += gridSize) {
            for (var y = yStart - gridSize; y <= yEnd; y += gridSize) {
                if (Math.abs(x + xOffset) % 100 == 0 &&
                    Math.abs(y + yOffset) % 100 == 0) {
                    ctx.strokeStyle = '#000';
                    ctx.strokeText("(" + (x + xOffset) / gridSize + "," + (y + yOffset) / gridSize + ")", x + 1, y - 1);
                }
            }
        }
        ctx.closePath();
        ctx.stroke();
    };
    return Mesh;
}(Canvas));

/*
 * @Author: yorshka
 * @Date: 2021-01-29 23:04:21
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-31 13:28:16
 *
 * shape类型，用来储存需要被绘制的数据
 */
var Shape = /** @class */ (function () {
    function Shape(options) {
        var x = options.x, y = options.y, radius = options.radius, zIndex = options.zIndex;
        //   保存原始数据
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.zIndex = zIndex;
        this.coverArea = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
        this.fillColor = '#00BFFF';
        //   生成随机id
        this.id = Math.random().toString(36).substring(2);
        // shape晚于mesh实例化，所以此时mesh必定已经实例化完成
        this.gridSize = Mesh.instance.gridSize;
        // 初始化缓存
        this.initCache();
    }
    // 初始化缓存
    // 1. 找出所有覆盖到的grid
    // 2. 记录每个grid的id
    Shape.prototype.initCache = function () {
        var _this = this;
        setTimeout(function () {
            var gridList = getCoveredGrid(_this.x, _this.y, _this.radius, _this.gridSize);
            // 记录cover区域，用于局部擦除
            _this.coverArea = getCoverArea(_this.x, _this.y, _this.radius, _this.gridSize);
            _this.meshGridList = gridList;
            console.log('finish cache: ', _this.zIndex, _this.id);
            bus.namespace(Namespace.INIT).emit(EventTypes.SHAPE, _this);
        }, 0);
    };
    Shape.prototype.setColor = function (color) {
        this.fillColor = color;
    };
    Shape.prototype.levelUp = function () {
        this.zIndex += 1;
    };
    // 自身渲染
    Shape.prototype.render = function (ctx) {
        if (!ctx) {
            return;
        }
        // 描边
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        // 填充
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.fillColor;
        ctx.fill();
        ctx.closePath();
    };
    return Shape;
}());

/*
 * @Author: yorshka
 * @Date: 2021-01-30 20:58:08
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 21:00:28
 */
function getNextColor(color) {
    var index = COLOR_SET.indexOf(color);
    if (index >= 0) {
        if (index + 1 < COLOR_SET.length) {
            return COLOR_SET[index + 1];
        }
    }
    return COLOR_SET[0];
}

/*
 * @Author: yorshka
 * @Date: 2021-01-29 10:25:35
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-02-01 11:33:30
 *
 * canvas demo.
 *
 */
var Demo = /** @class */ (function () {
    function Demo(options) {
        var _this = this;
        // 粗粒化格子大小
        this.gridSize = GRIDSIZE;
        // 缓存层
        this.cacheLayer = null;
        // 点击元素
        this.clickHandler = function (shape) {
            console.log('click', shape);
            var fillColor = shape.fillColor, meshGridList = shape.meshGridList;
            // 更新颜色
            shape.setColor(getNextColor(fillColor));
            // 更新位置
            shape.levelUp();
            // 1. 局部擦除
            // 2. 按照zindex重绘被擦除的元素
            // 建立局部刷新区域
            // 待重绘shape
            var reRenderShape = [];
            // 记录待重绘元素
            meshGridList.forEach(function (grid) {
                var cache = _this.meshLayer.gridCache.get(grid);
                if (cache) {
                    reRenderShape = __spread(reRenderShape, cache.list);
                }
            });
            console.log('clearArea', shape.coverArea);
            reRenderShape = __spread(new Set(__spread(reRenderShape)));
            console.log('reRenderShape', reRenderShape);
            // 擦除
            _this.clearGrid(shape.coverArea);
            // 重绘
            _this.reRender(reRenderShape, shape);
        };
        var name = options.container;
        var container = document.getElementById(name || 'container');
        // 保存容器
        this.container = container;
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        // 鼠标动作感知图层
        this.interactionLayer = new Canvas({
            id: 'interaction',
            container: container,
            zIndex: 4,
        });
        // 主画布
        this.displayLayer = new Canvas({
            id: 'main',
            container: container,
            zIndex: 2,
        });
        // 网格画布，用作坐标感知
        this.meshLayer = new Mesh({
            id: 'mesh',
            container: container,
            zIndex: 1,
            // hide: true,
            gridSize: this.gridSize,
        });
        // 交互handler
        this.interactionHandler = new Interaction({
            target: this.interactionLayer,
        });
        this.initListener();
    }
    Demo.prototype.initListener = function () {
        bus.namespace(Namespace.INTERACTION).on(EventTypes.CLICK, this.clickHandler);
        // EventBus.namespace(Namespace.INTERACTION).on(
        //   EventTypes.MOVE,
        //   this.moveHandler
        // );
        // EventBus.namespace(Namespace.INTERACTION).on(
        //   EventTypes.HOVER,
        //   this.hoverHandler
        // );
    };
    Demo.prototype.uninit = function () {
        bus.namespace(Namespace.INTERACTION).remove(EventTypes.CLICK);
        // EventBus.namespace(Namespace.INTERACTION).remove(EventTypes.MOVE);
        // EventBus.namespace(Namespace.INTERACTION).remove(EventTypes.HOVER);
    };
    // 局部擦除
    Demo.prototype.clearGrid = function (area) {
        this.getCtx().clearRect(area.x, area.y, area.width, area.height);
    };
    // 局部重绘
    Demo.prototype.reRender = function (list, targetShape) {
        var _this = this;
        // targetShape最后render
        // 按zindex顺序绘制
        var shapeList = list.map(function (id) { return _this.meshLayer.shapeBucket.get(id); });
        shapeList.sort(function (a, b) { return b.zIndex - a.zIndex; });
        // console.log('shapeList', shapeList);
        var ctx = this.getCtx();
        shapeList.forEach(function (shape) {
            shape.render(ctx);
        });
        // 最后绘制
        targetShape.render(ctx);
    };
    // 销毁（其实不用调用）
    Demo.prototype.destroy = function () {
        // 取消监听器
        this.interactionHandler.destroy();
        // 解除eventBus
        this.uninit();
    };
    Demo.prototype.getCtx = function () {
        return this.displayLayer.ctx;
    };
    // 生成count个随机shape
    Demo.prototype.generateShape = function (count) {
        var list = [];
        while (count) {
            var shape = new Shape({
                x: Math.floor(Math.random() * this.width),
                y: Math.floor(Math.random() * this.height),
                radius: Math.floor(Math.random() * 10 + 30),
                zIndex: count,
            });
            list.push(shape);
            count--;
        }
        return list;
    };
    return Demo;
}());

/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:19:49
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 21:16:48
 *
 * demo: 数百个圆，随机排布，可被鼠标点击。点击后变色并置于顶层，其他圆的绘制顺序不变。
 */
// 新建demo实例
var demo = new Demo({
    container: 'container',
});
window.demo = demo;
// 生成图形
var shapeList = demo.generateShape(200);
// 渲染图像
var ctx = demo.getCtx();
shapeList.forEach(function (shape) {
    shape.render(ctx);
});
// 退出时销毁实例
window.onunload = function () {
    demo.destroy();
};
//# sourceMappingURL=bundle.js.map
