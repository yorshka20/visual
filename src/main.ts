/*
 * @Author: yorshka
 * @Date: 2021-01-29 10:25:35
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 20:20:22
 *
 * canvas demo.
 *
 */

import Cache from './cache';

const cache = new Cache();

console.log(cache);

interface DemoOptions {
  container: string;
}

class Demo {
  private container: HTMLElement | null;

  private canvas: HTMLCanvasElement | null;

  private ctx: CanvasRenderingContext2D | null;

  constructor(options: DemoOptions) {
    const container = document.getElementById(options.container || 'container');
    this.container = container;

    const canvas = document.createElement('canvas');
    const winEle = document.documentElement;
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
    this.container!.appendChild(canvas);

    console.log('this.canvas', this.canvas);
    console.log('this.container', this.container);
    console.log('this.ctx', this.ctx);
  }

  public render() {
    if (!this.ctx) {
      return;
    }

    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();

    this.ctx.ellipse(300, 300, 100, 100, 0, 0, 2 * Math.PI);
    this.ctx.stroke();

    this.ctx.closePath();
  }
}

const demo = new Demo({
  container: 'container',
});

demo.render();
