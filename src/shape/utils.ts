/*
 * @Author: yorshka
 * @Date: 2021-01-30 15:08:51
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 22:00:05
 */

import type { CoverArea } from './index';

type PosCell = [number, number];

// 获得shape cover的格子
export function getCoveredGrid(
  x: number,
  y: number,
  radius: number,
  gridSize: number
): string[] {
  const list = [];

  // boundingBox三顶点： 左上，右上，左下
  const lt: PosCell = [
    x - radius < 0 ? 0 : x - radius,
    y - radius < 0 ? 0 : y - radius,
  ];
  const rt: PosCell = [x + radius, y - radius < 0 ? 0 : y - radius];
  const lb: PosCell = [x - radius < 0 ? 0 : x - radius, y + radius];

  // console.log('x,y,radius', x, y, radius);
  // console.log('lt,rt,lb', lt, rt, lb);

  const xAxis: PosCell = [
    Math.floor(lt[0] / gridSize),
    Math.floor(rt[0] / gridSize),
  ];
  const yAxis: PosCell = [
    Math.floor(lt[1] / gridSize),
    Math.floor(lb[1] / gridSize),
  ];

  // console.log('xAxis,yAxis', xAxis, yAxis);

  for (let x = xAxis[0]; x <= xAxis[1]; x++) {
    for (let y = yAxis[0]; y <= yAxis[1]; y++) {
      list.push(`${x}:${y}`);
    }
  }

  // console.log('list', list);

  return list;
}

// 获取point在mesh中最近的grid位置
export function getMeshGrid(x: number, y: number, gridSize: number): number[] {
  const gx = Math.floor(x / gridSize);
  const gy = Math.floor(y / gridSize);

  return [gx, gy];
}

// 计算cover区域
export function getCoverArea(
  x: number,
  y: number,
  radius: number,
  gridSize: number
): CoverArea {
  const area: CoverArea = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  // boundingBox三顶点： 左上，右上，左下
  const lt: PosCell = [
    x - radius < 0 ? 0 : x - radius,
    y - radius < 0 ? 0 : y - radius,
  ];
  const rt: PosCell = [x + radius, y - radius < 0 ? 0 : y - radius];
  const lb: PosCell = [x - radius < 0 ? 0 : x - radius, y + radius];

  const xAxis: PosCell = [
    Math.floor(lt[0] / gridSize),
    Math.floor(rt[0] / gridSize),
  ];
  const yAxis: PosCell = [
    Math.floor(lt[1] / gridSize),
    Math.floor(lb[1] / gridSize),
  ];

  area.x = xAxis[0] * gridSize;
  area.y = yAxis[0] * gridSize;
  area.width = xAxis[1] * gridSize + gridSize - area.x;
  area.height = yAxis[1] * gridSize + gridSize - area.y;

  return area;
}
