/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:34:19
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 13:27:21
 *
 * mesh实例，用来作为网格坐标层
 */

import { Canvas } from '@src/canvas';
import { MeshOptions } from './interface';

export default class Mesh extends Canvas {
  // 缓冲数据集
  private shapeBucket: Map<string, any>;

  // mesh网格格子大小
  gridGapX: number;
  gridGapY: number;

  constructor(options: MeshOptions) {
    super(options);

    // 初始化缓存
    this.shapeBucket = new Map<string, any>();
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

  // 获取point在mesh中最近的grid位置
  private getMeshGrid(x: number, y: number): number[] {
    const gx = Math.floor(x / this.gridGapX);
    const gy = Math.floor(y / this.gridGapY);

    return [gx, gy];
  }
}
