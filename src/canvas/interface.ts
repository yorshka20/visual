export interface VCanvasOptions {
  id: string;
  container: HTMLElement;
  zIndex: number; // z轴层级，用来隔离多层canvas
  hide?: boolean; // 是否不展示，缓存及非主画布为hide
}
