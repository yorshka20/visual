/*
 * @Author: yorshka
 * @Date: 2021-01-30 17:18:10
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 17:29:58
 *
 * 高亮层，绘制鼠标感知状态
 */

import { Canvas } from '@src/canvas';
import { CanvasOptions } from '@src/canvas/interface';
import { EventBus, EventTypes, Namespace } from '@src/eventBus';
import { computeBoundingBox } from '@src/mesh/utils';
import { Shape } from '@src/shape';

interface HighlightOptions extends CanvasOptions {
  //
}

export default class Highlight extends Canvas {
  private _target: Shape; // hover shape id

  private get hoverTarget() {
    return this._target;
  }

  private set hoverTarget(val: Shape) {
    if (val.id !== this._target.id) {
      this._target = val;
      this.clean();
      this.drawHighlight(val);
    }
  }

  constructor(options: HighlightOptions) {
    super(options);

    //   设置高亮stroke颜色
    this.ctx.strokeStyle = '#00FF00';

    //   初始化监听器
    this.init();
  }

  public destroy(): void {
    this.uninit();
  }

  private init(): void {
    EventBus.namespace(Namespace.INTERACTION).on(
      EventTypes.HOVER,
      this.hoverHandler
    );
  }

  private uninit(): void {
    EventBus.namespace(Namespace.INTERACTION).remove(EventTypes.HOVER);
  }

  private hoverHandler = (shape: Shape) => {
    this.hoverTarget = shape;
  };

  // 绘制高亮框
  private drawHighlight(shape: Shape): void {
    const rect = computeBoundingBox(shape);

    this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }

  private clean(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
