import { throttle } from 'lodash-es';

import type { VCanvas } from '../canvas';
import { EventBus, EventTypes, Namespace } from '../eventBus';

interface InteractionOptions {
  target: VCanvas;
}

export default class Interaction {
  // listening object
  private target: HTMLCanvasElement;

  constructor(options: InteractionOptions) {
    this.target = options.target.canvasEle;

    this.init();
  }

  public destroy(): void {
    this.target.removeEventListener('mousedown', this.mouseDownHandler);
    this.target.removeEventListener('mousemove', this.mouseMoveHandler);
  }

  public init(): void {
    this.target.addEventListener('mousedown', this.mouseDownHandler);
    this.target.addEventListener('mousemove', this.mouseMoveHandler);
  }

  private mouseMoveHandler = (e: MouseEvent) =>
    throttle((e: MouseEvent) => {
      const { offsetX, offsetY } = e;

      EventBus.namespace(Namespace.INTERACTION).emit(EventTypes.MOVE, {
        x: offsetX,
        y: offsetY,
      });
    }, 20)(e);

  private mouseDownHandler = (e: MouseEvent) => {
    const { offsetX, offsetY } = e;

    EventBus.namespace(Namespace.INTERACTION).emit(EventTypes.MOUSEDOWN, {
      x: offsetX,
      y: offsetY,
    });
  };
}
