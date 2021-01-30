/*
 * @Author: yorshka
 * @Date: 2021-01-29 23:38:02
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 20:52:58
 *
 * 交互感知层
 */

import { Canvas } from '@src/canvas';
import { EventBus, EventTypes, Namespace } from '@src/eventBus';
import { Mesh } from '@src/mesh';
import throttle from 'lodash/throttle';

interface InteractionOptions {
  target: Canvas;
}

export default class Interaction {
  // 监听目标元素
  private target: HTMLCanvasElement;

  constructor(options: InteractionOptions) {
    this.target = options.target.canvasEle;

    this.init();
  }

  // 销毁
  public destroy(): void {
    this.target.removeEventListener('mousedown', this.mouseDownHandler);
    this.target.removeEventListener('mousemove', this.mouseMoveHandler);
  }

  // 挂载监听器
  public init(): void {
    this.target.addEventListener('mousedown', this.mouseDownHandler);
    this.target.addEventListener('mousemove', this.mouseMoveHandler);
  }

  private mouseMoveHandler = (e: MouseEvent) =>
    throttle((e: MouseEvent) => {
      const { offsetX, offsetY } = e;
      // 发送事件
      EventBus.namespace(Namespace.INTERACTION).emit(EventTypes.MOVE, {
        x: offsetX,
        y: offsetY,
      });
    }, 20)(e);

  private mouseDownHandler = (e: MouseEvent) => {
    const { offsetX, offsetY } = e;
    // 发送事件
    EventBus.namespace(Namespace.INTERACTION).emit(EventTypes.MOUSEDOWN, {
      x: offsetX,
      y: offsetY,
    });
  };
}
