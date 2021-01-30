/*
 * @Author: yorshka
 * @Date: 2021-01-29 10:25:35
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 15:43:36
 *
 * canvas demo.
 *
 */

import { Canvas } from '@src/canvas';
import { EventBus, EventTypes, Namespace } from '@src/eventBus';
import { Interaction } from '@src/interaction';
import { Mesh } from '@src/mesh';
import { Shape } from '@src/shape';
import { DemoOptions } from './interface';

export default class Demo {
  // 容器及实例
  private container: HTMLElement | null;

  private width: number;
  private height: number;

  // 粗粒化格子大小
  private gridGap = 20;

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
    this.cacheLayer = new Canvas({
      id: 'cache',
      container,
      zIndex: 3,
    });

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
      hide: true,
      gridGap: this.gridGap,
    });

    this.meshLayer.renderGrid();

    // 交互handler
    // this.interactionHandler = new Interaction({
    //   target: this.interactionLayer,
    // });

    this.initListener();
  }

  public initListener(): void {
    EventBus.namespace(Namespace.INTERACTION).on(
      EventTypes.CLICK,
      this.clickHandler
    );
    EventBus.namespace(Namespace.INTERACTION).on(
      EventTypes.MOVE,
      this.moveHandler
    );
    EventBus.namespace(Namespace.INTERACTION).on(
      EventTypes.HOVER,
      this.hoverHandler
    );
  }

  public uninit(): void {
    EventBus.namespace(Namespace.INTERACTION).remove(EventTypes.CLICK);
    EventBus.namespace(Namespace.INTERACTION).remove(EventTypes.MOVE);
    EventBus.namespace(Namespace.INTERACTION).remove(EventTypes.HOVER);
  }

  private clickHandler = (e: any) => {
    console.log('click', e);
  };
  private moveHandler = (e: any) => {
    console.log('move', e);
  };
  private hoverHandler = (e: any) => {
    console.log('hover', e);
  };

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

  // 主渲染方法
  // TODO: 局部刷新
  public render(ctx?: CanvasRenderingContext2D): void {
    if (!ctx) {
      // console.log('canvas context is not ready!');
      // return;
      ctx = this.displayLayer.ctx;
    }

    ctx.beginPath();

    ctx.ellipse(300, 300, 100, 100, 0, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.closePath();
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

      // 网格层记录图形数据
      this.meshLayer.recordShape(shape);

      count--;
    }

    return list;
  }
}
