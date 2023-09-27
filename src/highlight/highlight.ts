import { VCanvas } from '../canvas';
import type { VCanvasOptions } from '../canvas/interface';
import { EventBus, EventTypes, Namespace } from '../eventBus';
import { computeBoundingBox } from '../mesh/utils';
import type { Shape } from '../shape';

interface HighlightOptions extends VCanvasOptions {
  //
}

export default class Highlight extends VCanvas {
  private _target: Shape | undefined = undefined; // hover shape id

  private get hoverTarget() {
    return this._target!;
  }

  private set hoverTarget(val: Shape) {
    if (!val) {
      this.clean();
      return;
    }

    if (val.id !== this._target?.id || !this._target) {
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
    this.unbindEvents();
  }

  private init(): void {
    EventBus.namespace(Namespace.INTERACTION).on(
      EventTypes.HOVER,
      this.hoverHandler,
    );
  }

  private unbindEvents(): void {
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
