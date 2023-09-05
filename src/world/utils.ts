/*
 * @Author: yorshka
 * @Date: 2021-01-30 20:58:08
 */

import { COLOR_SET } from '@src/config';

export function getNextColor(color: string): string {
  const index = COLOR_SET.indexOf(color);
  if (index >= 0) {
    if (index + 1 < COLOR_SET.length) {
      return COLOR_SET[index + 1] as string;
    }
  }

  return COLOR_SET[0] as string;
}
