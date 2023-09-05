/*
 * @Author: yorshka
 * @Date: 2021-01-30 13:13:02
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-31 14:56:49
 */

import type { Shape } from '../shape';
import { BoundingBox } from './interface';

// 返回一个矩形
export function computeBoundingBox(shape: Shape): BoundingBox {
  return new BoundingBox({
    x: shape.x - shape.radius,
    y: shape.y - shape.radius,
    width: 2 * shape.radius,
    height: 2 * shape.radius,
  });
}

// 两点之间距离
export function getDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
