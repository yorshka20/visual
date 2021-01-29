/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:43:14
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 00:18:52
 *
 * 自定义canvas类型，大小与容器一致
 */

import { CanvasOptions } from './interface';

export default class Canvas {
  // 挂载容器
  private container: HTMLElement | null;
  // DOM canvas元素实例(对外暴露)
  public canvasEle: HTMLCanvasElement | null;
  // 2d context
  public ctx: CanvasRenderingContext2D | null;

  constructor(options: CanvasOptions) {
    const { container, zIndex, hide } = options;

    //   保存canvas挂载容器
    this.container = container;

    //   创建canvas元素
    const canvas = document.createElement('canvas');
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

    // 初始化stroke样式(default)
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;

    //   mount canvas element
    this.container!.appendChild(canvas);
  }

  // 主渲染方法
  // TODO: 局部刷新
  public render(): void {
    if (!this.ctx) {
      console.log('canvas context is not ready!');
      return;
    }

    this.ctx.beginPath();

    this.ctx.ellipse(300, 300, 100, 100, 0, 0, 2 * Math.PI);
    this.ctx.stroke();

    this.ctx.closePath();
  }
}
