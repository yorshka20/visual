/*
 * @Author: yorshka
 * @Date: 2021-01-29 23:04:21
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 18:40:43
 *
 * shape类型，用来储存需要被绘制的数据
 */

import { EventBus, EventTypes, Namespace } from '@src/eventBus';
import { Mesh } from '@src/mesh';
import { getCoveredGrid } from './utils';

interface ShapeOptions {
  x: number;
  y: number;
  radius: number;

  zIndex: number; // 层级
}

export default class Shape {
  // 唯一id
  id: string;

  // ellipse 类型参数
  x: number;
  y: number;
  radius: number;

  // 格点大小
  gridSize: number;

  // 层级参数
  zIndex: number;

  // 自身格点缓存信息
  meshGridList: string[];

  constructor(options: ShapeOptions) {
    const { x, y, radius, zIndex } = options;

    //   保存原始数据
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.zIndex = zIndex;

    //   生成随机id
    this.id = Math.random().toString(36).substring(2);

    // shape晚于mesh实例化，所以此时mesh必定已经实例化完成
    this.gridSize = Mesh.instance.gridSize;

    // 初始化缓存
    this.initCache();
  }

  // 初始化缓存
  // 1. 找出所有覆盖到的grid
  // 2. 记录每个grid的id
  private initCache() {
    setTimeout(() => {
      const gridList = getCoveredGrid(
        this.x,
        this.y,
        this.radius,
        this.gridSize
      );

      this.meshGridList = gridList;
      console.log('finish cache: ', this.zIndex, this.id);
      EventBus.namespace(Namespace.INIT).emit(EventTypes.SHAPE, this);
    }, 0);
  }

  // 自身渲染
  public render(ctx: CanvasRenderingContext2D, fillColor = '#00BFFF'): void {
    if (!ctx) {
      return;
    }

    // 描边
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();

    // 填充
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.closePath();
  }
}
