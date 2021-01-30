/*
 * @Author: yorshka
 * @Date: 2021-01-30 13:13:02
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 13:26:50
 */

import { Shape } from '@src/shape';
import { BoundingBox } from './interface';

// 返回一个矩形
export function computeBoundingBox(shape: Shape): BoundingBox {
  return new BoundingBox({
    x: shape.x,
    y: shape.y,
    width: 2 * shape.radius,
    height: 2 * shape.radius,
  });
}
