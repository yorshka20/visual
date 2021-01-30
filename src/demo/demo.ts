/*
 * @Author: yorshka
 * @Date: 2021-01-29 10:25:35
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 22:04:57
 *
 * canvas demo.
 *
 */

import { Canvas } from '@src/canvas';
import { SHOW_HIGHLIGHT, SHOW_MESH } from '@src/config';
import { EventBus, EventTypes, Namespace } from '@src/eventBus';
import { Highlight } from '@src/highlight';
import { Interaction } from '@src/interaction';
import { Mesh } from '@src/mesh';
import { CoverArea, Shape } from '@src/shape';
import { DemoOptions } from './interface';
import { getNextColor } from './utils';

export default class Demo {
  // 容器及实例
  private container: HTMLElement | null;

  private width: number;
  private height: number;

  // 粗粒化格子大小
  private gridSize = 25;

  // 交互控制句柄，可取消监听器
  private interactionHandler: Interaction;

  /* 按层级排列 */
  // 鼠标事件感知层
  private interactionLayer: Canvas;
  // 缓存层
  private cacheLayer: Canvas = null;
  // 主画布
  private displayLayer: Canvas;
  // 坐标层
  private meshLayer: Mesh;

  constructor(options: DemoOptions) {
    const { container: name } = options;

    const container = document.getElementById(
      name || 'container'
    ) as HTMLElement;
    // 保存容器
    this.container = container;

    this.width = container.clientWidth;
    this.height = container.clientHeight;

    // 鼠标动作感知图层
    this.interactionLayer = new Canvas({
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
    this.displayLayer = new Canvas({
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

  public uninit(): void {
    EventBus.namespace(Namespace.INTERACTION).remove(EventTypes.CLICK);
    // EventBus.namespace(Namespace.INTERACTION).remove(EventTypes.MOVE);
    // EventBus.namespace(Namespace.INTERACTION).remove(EventTypes.HOVER);
  }

  // 点击元素
  private clickHandler = (shape: Shape) => {
    console.log('click', shape);
    const { fillColor, meshGridList } = shape;
    // 更新颜色
    shape.fillColor = getNextColor(fillColor);
    // 1. 局部擦除
    // 2. 按照zindex重绘被擦除的元素

    // 建立局部刷新区域
    // 待重绘shape
    let reRenderShape: string[] = [];
    // 记录待重绘元素
    meshGridList.forEach((grid) => {
      const cache = this.meshLayer.gridCache.get(grid);
      if (cache) {
        reRenderShape = [...reRenderShape, ...cache.list];
      }
    });

    console.log('clearArea', shape.coverArea);
    reRenderShape = [...new Set([...reRenderShape])];
    console.log('reRenderShape', reRenderShape);
    // 擦除
    this.clearGrid(shape.coverArea);
    // 重绘
  };

  // 局部擦除
  private clearGrid(area: CoverArea): void {
    this.getCtx().clearRect(area.x, area.y, area.width, area.height);
  }

  // 销毁（其实不用调用）
  public destroy() {
    // 取消监听器
    this.interactionHandler.destroy();
    // 解除eventBus
    this.uninit();
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
        radius: Math.floor(Math.random() * 40 + 10), // 10 ~ 50
        zIndex: count,
      });
      list.push(shape);

      count--;
    }

    return list;
  }
}
