/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:35:02
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 18:56:51
 */

export interface MeshOptions {
  id: string;
  gridSize: number;
  container: HTMLElement;
  zIndex: number; // z轴层级，用来隔离多层canvas
  hide?: boolean; // 是否不展示，缓存及非主画布为hide
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

export interface GridCacheList {
  topIndex: number;
  list: string[];
}

export interface Point {
  x: number;
  y: number;
}
