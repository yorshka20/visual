/*
 * @Author: yorshka
 * @Date: 2021-01-30 20:58:08
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 21:00:28
 */

import { COLOR_SET } from '@src/config';

export function getNextColor(color: string): string {
  const index = COLOR_SET.indexOf(color);
  if (index >= 0) {
    if (index + 1 < COLOR_SET.length) {
      return COLOR_SET[index + 1];
    }
  }

  return COLOR_SET[0];
}
