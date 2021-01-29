/*
 * @Author: yorshka
 * @Date: 2021-01-29 10:25:35
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 23:21:42
 *
 * canvas demo.
 *
 */

import { Canvas } from '@src/canvas';
import { Mesh } from '@src/mesh';
import { DemoOptions } from './interface';

export default class Demo {
  // 容器及实例
  private container: HTMLElement | null;
  private canvas: Canvas;

  // 坐标层
  private meshCanvas: Mesh;
  // 缓存层
  private bufferCanvas: Canvas = null;

  constructor(options: DemoOptions) {
    const { container: name } = options;

    const container = document.getElementById(
      name || 'container'
    ) as HTMLElement;
    // 保存容器
    this.container = container;

    const canvas = new Canvas({
      container,
      zIndex: 1,
    });

    // 主画布
    this.canvas = canvas;

    // 网格画布，用作坐标感知
    this.meshCanvas = new Mesh({
      container,
      zIndex: 2,
      hide: true,
    });
  }

  public render() {
    this.canvas.render();
  }
}
