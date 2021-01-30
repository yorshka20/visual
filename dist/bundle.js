'use strict';

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
                var event = args[0], params = args[1];
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
    EventTypes["CLICK"] = "click";
    EventTypes["HOVER"] = "hover";
    EventTypes["MOVE"] = "move";
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

/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:35:02
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 18:40:01
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
 * @Last Modified time: 2021-01-30 13:26:50
 */
// 返回一个矩形
function computeBoundingBox(shape) {
    return new BoundingBox({
        x: shape.x,
        y: shape.y,
        width: 2 * shape.radius,
        height: 2 * shape.radius,
    });
}

/*
 * @Author: yorshka
 * @Date: 2021-01-30 17:18:10
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 17:29:58
 *
 * 高亮层，绘制鼠标感知状态
 */
var Highlight = /** @class */ (function (_super) {
    __extends(Highlight, _super);
    function Highlight(options) {
        var _this = _super.call(this, options) || this;
        _this.hoverHandler = function (shape) {
            _this.hoverTarget = shape;
        };
        //   设置高亮stroke颜色
        _this.ctx.strokeStyle = '#00FF00';
        //   初始化监听器
        _this.init();
        return _this;
    }
    Object.defineProperty(Highlight.prototype, "hoverTarget", {
        get: function () {
            return this._target;
        },
        set: function (val) {
            if (val.id !== this._target.id) {
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
}(Canvas));

/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:34:19
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 18:44:57
 *
 * mesh实例，用来作为网格坐标层
 */
var Mesh = /** @class */ (function (_super) {
    __extends(Mesh, _super);
    function Mesh(options) {
        var _this = _super.call(this, options) || this;
        _this.handleShapeReady = function (shape) {
            console.log('shape', shape);
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
        bus.namespace(Namespace.INIT).on(EventTypes.SHAPE, _this.handleShapeReady);
        Mesh.instance = _this;
        return _this;
    }
    // 录入图形，形成坐标
    Mesh.prototype.recordShape = function (shape) {
        var id = shape.id;
        // 记录原始数据
        this.shapeBucket.set(id, shape);
        // 更新格点缓存
        this.updateGridCache(shape);
    };
    // 删除图形
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
        // console.log('xStart, xEnd', xStart, xEnd);
        // console.log('yStart, yEnd', yStart, yEnd);
        // console.log('gridSize', gridSize);
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
        ctx.closePath();
        ctx.stroke();
    };
    return Mesh;
}(Canvas));

/*
 * @Author: yorshka
 * @Date: 2021-01-30 15:08:51
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 17:14:30
 */
// 获得shape cover的格子
function getCoveredGrid(x, y, radius, gridSize) {
    var list = [];
    // boundingBox四顶点
    var lt = [x - radius, y - radius];
    var rt = [x + radius, y - radius];
    var lb = [x - radius, y + radius];
    var xAxis = [Math.floor(lt[0] / gridSize), Math.floor(rt[0] / gridSize)];
    var yAxis = [Math.floor(lt[1] / gridSize), Math.floor(lb[0] / gridSize)];
    // console.log('xAxis,yAxis', xAxis, yAxis);
    for (var x_1 = xAxis[0]; x_1 <= xAxis[1]; x_1++) {
        if (x_1 < 0)
            continue;
        for (var y_1 = yAxis[0]; y_1 <= yAxis[1]; y_1++) {
            if (y_1 < 0)
                continue;
            list.push(x_1 + ":" + y_1);
        }
    }
    // console.log('list', list);
    return list;
}

/*
 * @Author: yorshka
 * @Date: 2021-01-29 23:04:21
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 18:40:43
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
            _this.meshGridList = gridList;
            console.log('finish cache: ', _this.zIndex, _this.id);
            bus.namespace(Namespace.INIT).emit(EventTypes.SHAPE, _this);
        }, 0);
    };
    // 自身渲染
    Shape.prototype.render = function (ctx, fillColor) {
        if (fillColor === void 0) { fillColor = '#00BFFF'; }
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
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.closePath();
    };
    return Shape;
}());

/*
 * @Author: yorshka
 * @Date: 2021-01-29 10:25:35
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 18:40:41
 *
 * canvas demo.
 *
 */
var Demo = /** @class */ (function () {
    function Demo(options) {
        // 粗粒化格子大小
        this.gridSize = 25;
        // 缓存层
        this.cacheLayer = null;
        this.clickHandler = function (e) {
            console.log('click', e);
        };
        this.moveHandler = function (e) {
            console.log('move', e);
        };
        this.hoverHandler = function (e) {
            console.log('hover', e);
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
        // cache层，快速擦除，内容较少
        this.cacheLayer = new Highlight({
            id: 'cache',
            container: container,
            zIndex: 3,
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
        this.meshLayer.renderGrid();
        // 交互handler
        // this.interactionHandler = new Interaction({
        //   target: this.interactionLayer,
        // });
        this.initListener();
    }
    Demo.prototype.initListener = function () {
        bus.namespace(Namespace.INTERACTION).on(EventTypes.CLICK, this.clickHandler);
        bus.namespace(Namespace.INTERACTION).on(EventTypes.MOVE, this.moveHandler);
        bus.namespace(Namespace.INTERACTION).on(EventTypes.HOVER, this.hoverHandler);
    };
    Demo.prototype.uninit = function () {
        bus.namespace(Namespace.INTERACTION).remove(EventTypes.CLICK);
        bus.namespace(Namespace.INTERACTION).remove(EventTypes.MOVE);
        bus.namespace(Namespace.INTERACTION).remove(EventTypes.HOVER);
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
    // 主渲染方法
    // TODO: 局部刷新
    Demo.prototype.render = function (ctx) {
        if (!ctx) {
            // console.log('canvas context is not ready!');
            // return;
            ctx = this.displayLayer.ctx;
        }
        ctx.beginPath();
        ctx.ellipse(300, 300, 100, 100, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    };
    // 生成count个随机shape
    Demo.prototype.generateShape = function (count) {
        var list = [];
        while (count) {
            var shape = new Shape({
                x: Math.floor(Math.random() * this.width),
                y: Math.floor(Math.random() * this.height),
                radius: Math.floor(Math.random() * 40 + 10),
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
 * @Last Modified time: 2021-01-30 13:55:59
 *
 * demo: 数百个圆，随机排布，可被鼠标点击。点击后变色并置于顶层，其他圆的绘制顺序不变。
 */
// 新建demo
var demo = new Demo({
    container: 'container',
});
window.demo = demo;
// 生成图形
var shapeList = demo.generateShape(200);
console.log('shapeList', shapeList);
var ctx = demo.getCtx();
shapeList.forEach(function (shape) {
    shape.render(ctx);
});
// 退出时销毁实例
window.onunload = function () {
    demo.destroy();
};
