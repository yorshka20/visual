/*
 * @Author: yorshka
 * @Date: 2021-01-30 15:08:51
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 17:14:30
 */

// 获得shape cover的格子
export function getCoveredGrid(
  x: number,
  y: number,
  radius: number,
  gridSize: number
): string[] {
  const list = [];

  // boundingBox四顶点
  const lt = [x - radius, y - radius];
  const rt = [x + radius, y - radius];
  const lb = [x - radius, y + radius];

  const xAxis = [Math.floor(lt[0] / gridSize), Math.floor(rt[0] / gridSize)];
  const yAxis = [Math.floor(lt[1] / gridSize), Math.floor(lb[0] / gridSize)];

  // console.log('xAxis,yAxis', xAxis, yAxis);

  for (let x = xAxis[0]; x <= xAxis[1]; x++) {
    if (x < 0) continue;
    for (let y = yAxis[0]; y <= yAxis[1]; y++) {
      if (y < 0) continue;
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
