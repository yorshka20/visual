/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:56:27
 * @Last Modified by:   yorshka
 * @Last Modified time: 2021-01-29 22:56:27
 */

export interface CanvasOptions {
  container: HTMLElement;
  zIndex: number; // z轴层级，用来隔离多层canvas
  hide?: boolean; // 是否不展示，缓存及非主画布为hide
}
