/*
 * @Author: yorshka
 * @Date: 2021-01-29 10:25:35
 *
 * canvas World.
 *
 * Duty of world:
 * - create world
 * - export control api
 *
 * what api do we need?
 * - start
 * - restart
 * - stop
 * - pause
 *
 * more advanced:
 * - tick
 * - nextTick
 *
 */

import { VCanvas } from '../canvas';
import { GRID_SIZE, SHOW_HIGHLIGHT, SHOW_MESH } from '../config';
import { EventBus, EventTypes, Namespace } from '../eventBus';
import { Highlight } from '../highlight';
import { Interaction } from '../interaction';
import { Mesh } from '../mesh';
import { CoverArea, Shape } from '../shape';
import type { WorldOptions } from './interface';
import { getNextColor } from './utils';

export default class World {
  // 容器及实例
  private container: HTMLElement;

  // 基本的宽高
  private width: number;
  private height: number;

  // 粗粒化格子大小
  private gridSize = GRID_SIZE;

  // 交互控制句柄，可取消监听器
  private interactionHandler: Interaction;

  /* 按层级排列 */
  // 鼠标事件感知层
  private interactionLayer: VCanvas;
  // 缓存层
  private cacheLayer: VCanvas = {} as any;
  // 主画布
  private displayLayer: VCanvas;
  // 坐标层
  private meshLayer: Mesh;

  constructor(options: WorldOptions) {
    const { container: name } = options;

    const container = document.getElementById(
      name || 'container'
    ) as HTMLElement;
    // 保存容器
    this.container = container;

    this.width = container.clientWidth;
    this.height = container.clientHeight;

    // 鼠标动作感知图层
    this.interactionLayer = new VCanvas({
      id: 'interaction',
      container,
      zIndex: 4,
    });

    // cache层，快速擦除，内容较少
    if (SHOW_HIGHLIGHT) {
      this.cacheLayer = new Highlight({
        id: 'cache',
        container,
        zIndex: 3,
      });
    }

    // 主画布
    this.displayLayer = new VCanvas({
      id: 'main',
      container,
      zIndex: 2,
    });

    // 网格画布，用作坐标感知
    this.meshLayer = new Mesh({
      id: 'mesh',
      container,
      zIndex: 1,
      // hide: true,
      gridSize: this.gridSize,
    });

    // 渲染网格背景
    if (SHOW_MESH) {
      this.meshLayer.renderGrid();
    }

    // 交互handler
    this.interactionHandler = new Interaction({
      target: this.interactionLayer,
    });

    this.initListener();
  }

  public initListener(): void {
    EventBus.namespace(Namespace.INTERACTION).on(
      EventTypes.CLICK,
      this.clickHandler
    );
    // EventBus.namespace(Namespace.INTERACTION).on(
    //   EventTypes.MOVE,
    //   this.moveHandler
    // );
    // EventBus.namespace(Namespace.INTERACTION).on(
    //   EventTypes.HOVER,
    //   this.hoverHandler
    // );
  }

  public unbindEvent(): void {
    EventBus.namespace(Namespace.INTERACTION).remove(EventTypes.CLICK);
    // EventBus.namespace(Namespace.INTERACTION).remove(EventTypes.MOVE);
    // EventBus.namespace(Namespace.INTERACTION).remove(EventTypes.HOVER);
  }

  // click element
  private clickHandler = (shape: Shape) => {
    console.log('click', shape);
    const { fillColor, meshGridList } = shape;
    const nextColor = getNextColor(fillColor);
    // update color
    shape.setColor(nextColor);
    // update position
    shape.levelUp();

    // 1. erase partially
    // 2. rerendering erased elements by z-index

    // create area to be erased and rerendered
    // waiting to repaint
    let reRenderShape: string[] = [];
    // collect elements to be repainted
    meshGridList.forEach((grid) => {
      const cache = this.meshLayer.gridCache.get(grid);
      if (cache) {
        reRenderShape = [...reRenderShape, ...cache.list];
      }
    });

    console.log('clearArea', shape.coverArea);
    reRenderShape = [...new Set([...reRenderShape])];
    console.log('reRenderShape', reRenderShape);

    this.clearGrid(shape.coverArea);
    this.reRender(reRenderShape, shape);
  };

  // 局部擦除
  private clearGrid(area: CoverArea): void {
    this.getCtx()?.clearRect(area.x, area.y, area.width, area.height);
  }

  // 局部重绘
  private reRender(list: string[], targetShape: Shape): void {
    // targetShape最后render
    // 按zindex顺序绘制
    const shapeList = list.map(
      (id) => this.meshLayer.shapeBucket.get(id) as Shape
    );
    shapeList.sort((a, b) => b?.zIndex - a?.zIndex);
    // console.log('shapeList', shapeList);
    const ctx = this.getCtx();
    shapeList.forEach((shape) => {
      shape.render(ctx);
    });

    // 最后绘制
    targetShape.render(ctx);
  }

  // 销毁（其实不用调用）
  public destroy() {
    // 取消监听器
    this.interactionHandler.destroy();
    // 解除eventBus
    this.unbindEvent();
  }

  public getCtx(): CanvasRenderingContext2D {
    return this.displayLayer.ctx;
  }

  // 生成count个随机shape
  public generateShape(count: number): Shape[] {
    const list = [];

    while (count) {
      const shape = new Shape({
        x: Math.floor(Math.random() * this.width),
        y: Math.floor(Math.random() * this.height),
        radius: Math.floor(Math.random() * 10 + 30), // 30 ~ 40
        zIndex: count,
      });
      list.push(shape);

      count--;
    }

    return list;
  }
}
