/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:34:19
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 15:42:30
 *
 * mesh实例，用来作为网格坐标层
 */

import { Canvas } from '@src/canvas';
import { MeshOptions } from './interface';

export default class Mesh extends Canvas {
  static instance: Mesh;

  // 缓冲数据集
  private shapeBucket: Map<string, any>;

  // mesh网格格子大小
  gridGapX: number;
  gridGapY: number;

  constructor(options: MeshOptions) {
    if (Mesh.instance) {
      return Mesh.instance;
    }

    super(options);

    // 初始化缓存
    this.shapeBucket = new Map<string, any>();

    // 记录格点大小
    this.gridGapX = this.gridGapY = options.gridGap;

    Mesh.instance = this;
  }

  // 录入图形，形成坐标
  public recordShape(shape: any): void {
    const { id } = shape;

    this.shapeBucket.set(id, shape);
  }

  // 删除图形
  public removeShape(shape: any): void {
    const { id } = shape;
    this.shapeBucket.delete(id);
  }

  // 渲染网格坐标
  public renderGrid(): void {
    const ctx = this.ctx;

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#d2e2f7';

    const gridSize = this.gridGapX;

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

    ctx.closePath();

    ctx.stroke();
  }
}
