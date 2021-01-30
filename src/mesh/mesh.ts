/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:34:19
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 20:10:26
 *
 * mesh实例，用来作为网格坐标层
 */

import { Canvas } from '@src/canvas';
import { SHOW_SHAPE_GRID } from '@src/config';
import { EventBus, EventTypes, Namespace } from '@src/eventBus';
import { Shape } from '@src/shape';
import { getMeshGrid } from '@src/shape/utils';
import { MeshOptions, GridCacheList, Point } from './interface';

export default class Mesh extends Canvas {
  static instance: Mesh;

  // 缓冲数据集
  private shapeBucket: Map<string, any>;

  // 格点缓存，以gridId为key，记录cover该grid的shape的list，shape按zindex倒序排
  gridCache: Map<string, GridCacheList>;

  // mesh网格格子大小
  gridSize: number;

  constructor(options: MeshOptions) {
    super(options);

    if (Mesh.instance) {
      return Mesh.instance;
    }

    // 初始化缓存
    this.shapeBucket = new Map<string, any>();
    this.gridCache = new Map<string, GridCacheList>();

    // 记录格点大小
    this.gridSize = options.gridSize;

    EventBus.namespace(Namespace.INIT).on(
      EventTypes.SHAPE,
      this.handleShapeReady
    );

    EventBus.namespace(Namespace.INTERACTION).on(
      EventTypes.MOVE,
      this.handleMouseMove
    );

    Mesh.instance = this;
  }

  // 监听鼠标移动，计算当前hover shape
  private handleMouseMove = (point: Point) => {
    const grid = getMeshGrid(point.x, point.y, this.gridSize).join(':');
    console.log('grid', grid);
    const cache = this.gridCache.get(grid);
    if (cache) {
      console.log('has content', cache);
      if (cache?.list?.length) {
        const shape = this.shapeBucket.get(cache.list[0]);
        EventBus.namespace(Namespace.INTERACTION).emit(EventTypes.HOVER, shape);
      }
    }
  };

  private handleShapeReady = (shape: Shape) => {
    console.log('shape ready', shape);
    this.recordShape(shape);
  };

  // 录入图形，形成坐标
  public recordShape(shape: Shape): void {
    const { id } = shape;

    // 记录原始数据
    this.shapeBucket.set(id, shape);

    // 更新格点缓存
    this.updateGridCache(shape);
  }

  // 删除图形
  public removeShape(shape: Shape): void {
    const { id, meshGridList, zIndex } = shape;
    this.shapeBucket.delete(id);

    meshGridList.forEach((grid) => {
      const cache = this.gridCache.get(grid);
      if (cache) {
        cache.list = cache.list.filter((i) => i != id);
        if (cache.topIndex == zIndex && cache.list.length) {
          const topShape = this.shapeBucket.get(cache.list[0]);
          cache.topIndex = topShape.zIndex;
        }

        this.gridCache.set(grid, cache);
      }
    });
  }

  // 格点缓存
  private updateGridCache(shape: Shape): void {
    const { id, meshGridList, zIndex } = shape;
    meshGridList.forEach((grid) => {
      let cache = this.gridCache.get(grid);
      if (!cache) {
        cache = {
          list: [],
          topIndex: 0,
        };
      }
      let { topIndex, list } = cache;
      // 更新最大zindex
      if (zIndex > topIndex) {
        topIndex = zIndex;
        list.unshift(id);
      } else {
        list.push(id);
      }

      // 更新缓存
      this.gridCache.set(grid, { topIndex, list });

      if (SHOW_SHAPE_GRID) {
        // debug
        this.fillGrid(grid);
      }
    });
  }

  private fillGrid(grid: string) {
    const [x, y] = grid.split(':').map((i) => Number(i));
    this.ctx.fillStyle = '#666';
    this.ctx.fillRect(
      x * this.gridSize,
      y * this.gridSize,
      this.gridSize,
      this.gridSize
    );
  }

  // 渲染网格坐标
  public renderGrid(): void {
    const ctx = this.ctx;

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#d2e2f7';

    const gridSize = this.gridSize;

    const xStart = 0;
    const xEnd = this.container.clientWidth;
    const yStart = 0;
    const yEnd = this.container.clientHeight;

    // console.log('xStart, xEnd', xStart, xEnd);
    // console.log('yStart, yEnd', yStart, yEnd);
    // console.log('gridSize', gridSize);

    ctx.beginPath();

    // 画网格, x axios
    for (let x = xStart; x <= xEnd + gridSize; x += gridSize) {
      // 超出坐标系绘制，防止有空隙
      ctx.moveTo(x, yStart - gridSize);
      ctx.lineTo(x, yEnd + gridSize);
    }
    // 画网格, y axios
    for (let y = yStart; y <= yEnd + gridSize; y += gridSize) {
      // 超出坐标系绘制，防止有空隙
      ctx.moveTo(xStart - gridSize, y);
      ctx.lineTo(xEnd + gridSize, y);
    }

    const xOffset = 0;
    const yOffset = 0;

    // 画格线交点
    for (let x = xStart - gridSize; x <= xEnd; x += gridSize) {
      for (let y = yStart - gridSize; y <= yEnd; y += gridSize) {
        if (
          Math.abs(x + xOffset) % 100 == 0 &&
          Math.abs(y + yOffset) % 100 == 0
        ) {
          ctx.strokeStyle = '#000';
          ctx.strokeText(
            `(${(x + xOffset) / gridSize},${(y + yOffset) / gridSize})`,
            x + 1,
            y - 1
          );
        }
      }
    }

    ctx.closePath();

    ctx.stroke();
  }
}
