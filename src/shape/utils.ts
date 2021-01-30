/*
 * @Author: yorshka
 * @Date: 2021-01-30 15:08:51
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 15:30:30
 */

import { Shape } from './';

// 获得shape cover的格子
export function getCoveredGrid(
  shape: Shape,
  gridX: number,
  gridY: number
): string[] {
  const list = [];

  // boundingBox四顶点
  const lt = [shape.x - shape.radius, shape.y - shape.radius];
  const rt = [shape.x + shape.radius, shape.y - shape.radius];
  const lb = [shape.x - shape.radius, shape.y + shape.radius];

  const xAxis = [Math.floor(lt[0] / gridX), Math.floor(rt[0] / gridX)];
  const yAxis = [Math.floor(lt[1] / gridY), Math.floor(lb[0] / gridY)];

  for (let x = xAxis[0]; x < xAxis[1]; x += gridX) {
    for (let y = yAxis[0]; y < yAxis[1]; y += gridY) {
      list.push(`${x}:${y}`);
    }
  }

  return list;
}

// 获取point在mesh中最近的grid位置
export function getMeshGrid(x: number, y: number, gridGap: number): number[] {
  const gx = Math.floor(x / gridGap);
  const gy = Math.floor(y / gridGap);

  return [gx, gy];
}
