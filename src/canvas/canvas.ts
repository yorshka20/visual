/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:43:14
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 17:26:28
 *
 * 自定义canvas类型，大小与容器一致
 */

import type { VCanvasOptions } from './interface';

export default class VCanvas {
  readonly id: string;
  // 挂载容器
  protected container: HTMLElement;
  // DOM canvas元素实例(对外暴露)
  public canvasEle: HTMLCanvasElement;

  // 2d context
  public ctx: CanvasRenderingContext2D;

  // 宽高
  protected width: number;
  protected height: number;

  constructor(options: VCanvasOptions) {
    const { container, zIndex, hide, id } = options;

    //   保存canvas挂载容器
    this.container = container;
    this.id = id;

    //   创建canvas元素
    const canvas = document.createElement('canvas');
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
    canvas.style.zIndex = `${zIndex}`;

    //   store canvas element
    this.canvasEle = canvas;
    this.ctx = canvas.getContext('2d')!;

    // 设置层叠顺序
    this.ctx!.globalCompositeOperation = 'source-over';

    // 初始化stroke样式(default)
    this.ctx!.lineWidth = 1;
    this.ctx!.strokeStyle = '#000';

    //   mount canvas element
    if (!hide) {
      this.container!.appendChild(canvas);
    }
  }
}
