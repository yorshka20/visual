'use strict';

/*
 * @Author: yorshka
 * @Date: 2021-01-29 10:25:35
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 22:23:14
 *
 * canvas demo.
 *
 */
var Demo = /** @class */ (function () {
    function Demo(options) {
        var container = document.getElementById(options.container || 'container');
        this.container = container;
        var canvas = document.createElement('canvas');
        var winEle = document.documentElement;
        canvas.width = winEle.clientWidth - 100;
        canvas.height = winEle.clientHeight - 100;
        //   set absolute position for multiple-layer canvas layout.
        canvas.style.position = 'absolute';
        canvas.style.top = '50px';
        canvas.style.left = '50px';
        //   distinguish Element.
        canvas.style.border = '1px solid black';
        //   store canvas element
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        //   mount canvas element
        this.container.appendChild(canvas);
        console.log('this.canvas', this.canvas);
        console.log('this.container', this.container);
        console.log('this.ctx', this.ctx);
    }
    Demo.prototype.render = function () {
        if (!this.ctx) {
            return;
        }
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(300, 300, 100, 100, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
    };
    return Demo;
}());

/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:19:49
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 22:23:45
 */
var demo = new Demo({
    container: 'container',
});
window.demo = demo;
demo.render();
