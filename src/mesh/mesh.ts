/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:34:19
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 23:29:54
 *
 * mesh实例，用来作为网格坐标层
 */

import { Canvas } from '@src/canvas';
import { MeshOptions } from './interface';

export default class Mesh extends Canvas {
  // 缓冲数据集
  private shapeBucket: Map<string, any>;

  constructor(options: MeshOptions) {
    super(options);

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
}
