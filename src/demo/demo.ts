/*
 * @Author: yorshka
 * @Date: 2021-01-29 10:25:35
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 00:20:49
 *
 * canvas demo.
 *
 */

import { Canvas } from '@src/canvas';
import { Interaction } from '@src/interaction';
import { Mesh } from '@src/mesh';
import { DemoOptions } from './interface';

export default class Demo {
  // 容器及实例
  private container: HTMLElement | null;
  private canvas: Canvas;

  // 交互控制句柄，可取消监听器
  private interactionHandler: Interaction;

  // 鼠标事件感知层
  private interactionLayer: Canvas;
  // 坐标层
  private meshLayer: Mesh;
  // 缓存层
  private bufferLayer: Canvas = null;

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
    this.meshLayer = new Mesh({
      container,
      zIndex: 2,
      hide: true,
    });

    // 鼠标动作感知图层
    this.interactionLayer = new Canvas({
      container,
      zIndex: 3,
    });

    // 交互handler
    this.interactionHandler = new Interaction({
      target: this.interactionLayer,
    });
  }

  // 销毁（其实不用调用）
  public destroy() {
    this.interactionHandler.destroy();
  }

  public render() {
    this.canvas.render();
  }
}
