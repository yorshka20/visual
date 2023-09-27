import tinyColor from 'tinycolor2';

export function getNextColor(_: string): string {
  return tinyColor.random().toHexString();
}
