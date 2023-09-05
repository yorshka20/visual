/*
 * @Author: yorshka
 * @Date: 2021-01-30 20:58:08
 */

import tinyColor from 'tinycolor2';

export function getNextColor(_: string): string {
  return tinyColor.random().toHexString();
}
