/*
 * @Author: yorshka
 * @Date: 2021-01-30 13:13:02
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 19:43:52
 */

import { Shape } from '@src/shape';
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
