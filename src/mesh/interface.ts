/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:35:02
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 18:40:01
 */

import { CanvasOptions } from '@src/canvas/interface';

export interface MeshOptions extends CanvasOptions {
  gridSize: number;
}

export interface BoundingBoxData {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 包围盒
export class BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(data: BoundingBoxData) {
    const { x, y, width, height } = data;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
