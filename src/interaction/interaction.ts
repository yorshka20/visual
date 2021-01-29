/*
 * @Author: yorshka
 * @Date: 2021-01-29 23:38:02
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 01:12:12
 *
 * 交互感知层
 */

import { Canvas } from '@src/canvas';
import { EventBus, EventTypes, Namespace } from '@src/eventBus';
import throttle from 'lodash/throttle';

interface EventHandler {
  (e?: MouseEvent): void;
}

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
    // this.target.removeEventListener('mouseenter', this.mouseEnterHandler);
    // this.target.removeEventListener('mouseleave', this.mouseLeaveHandler);
    this.target.removeEventListener('mousemove', this.mouseMoveHandler);
  }

  // 挂载监听器
  public init(): void {
    this.target.addEventListener('mousedown', this.mouseDownHandler);
    // this.target.addEventListener('mouseenter', this.mouseEnterHandler);
    // this.target.addEventListener('mouseleave', this.mouseLeaveHandler);
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
    }, 50)(e);

  private mouseDownHandler = (e: MouseEvent) => {
    const { offsetX, offsetY } = e;
    // 发送事件
    EventBus.namespace(Namespace.INTERACTION).emit(EventTypes.CLICK, {
      x: offsetX,
      y: offsetY,
    });
  };

  private mouseEnterHandler = (e: MouseEvent) => {
    const { offsetX, offsetY } = e;
    // 发送事件
    EventBus.namespace(Namespace.INTERACTION).emit(EventTypes.HOVER, {
      x: offsetX,
      y: offsetY,
    });
  };

  private mouseLeaveHandler = (e: MouseEvent) => {
    console.log('mouse leave: ===>', e);
  };
}
