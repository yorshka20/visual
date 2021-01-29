'use strict';

/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:43:14
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 23:20:43
 *
 * 自定义canvas类型，大小与容器一致
 */
var Canvas = /** @class */ (function () {
    function Canvas(options) {
        var container = options.container, zIndex = options.zIndex, hide = options.hide;
        //   保存canvas挂载容器
        this.container = container;
        //   创建canvas元素
        var canvas = document.createElement('canvas');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        //   set absolute position for multiple-layer canvas layout.
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        //   distinguish Element.
        if (!hide) {
            canvas.style.border = '1px solid black';
        }
        // 设置z层级
        canvas.style.zIndex = zIndex + '';
        //   store canvas element
        this.canvasEle = canvas;
        this.ctx = canvas.getContext('2d');
        // 初始化stroke样式
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        //   mount canvas element
        this.container.appendChild(canvas);
    }
    // 主渲染方法
    // TODO: 局部刷新
    Canvas.prototype.render = function () {
        if (!this.ctx) {
            console.log('canvas context is not ready!');
            return;
        }
        this.ctx.beginPath();
        this.ctx.ellipse(300, 300, 100, 100, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
    };
    return Canvas;
}());

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
 * @Date: 2021-01-29 22:34:19
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 23:53:43
 *
 * mesh实例，用来作为网格坐标层
 */
var Mesh = /** @class */ (function (_super) {
    __extends(Mesh, _super);
    function Mesh(options) {
        var _this = _super.call(this, options) || this;
        // 初始化缓存
        _this.shapeBucket = new Map();
        return _this;
    }
    // 录入图形，形成坐标
    Mesh.prototype.recordShape = function (shape) {
        var id = shape.id;
        this.shapeBucket.set(id, shape);
    };
    // 删除图形
    Mesh.prototype.removeShape = function (shape) {
        var id = shape.id;
        this.shapeBucket.delete(id);
    };
    return Mesh;
}(Canvas));

/*
 * @Author: yorshka
 * @Date: 2021-01-29 10:25:35
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 23:21:42
 *
 * canvas demo.
 *
 */
var Demo = /** @class */ (function () {
    function Demo(options) {
        // 缓存层
        this.bufferCanvas = null;
        var name = options.container;
        var container = document.getElementById(name || 'container');
        // 保存容器
        this.container = container;
        var canvas = new Canvas({
            container: container,
            zIndex: 1,
        });
        // 主画布
        this.canvas = canvas;
        // 网格画布，用作坐标感知
        this.meshCanvas = new Mesh({
            container: container,
            zIndex: 2,
            hide: true,
        });
    }
    Demo.prototype.render = function () {
        this.canvas.render();
    };
    return Demo;
}());

/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:19:49
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 22:33:02
 *
 * demo: 数百个圆，随机排布，可被鼠标点击。点击后变色并置于顶层，其他圆的绘制顺序不变。
 */
var demo = new Demo({
    container: 'container',
});
window.demo = demo;
demo.render();
