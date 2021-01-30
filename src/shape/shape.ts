/*
 * @Author: yorshka
 * @Date: 2021-01-29 23:04:21
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 14:10:41
 *
 * shape类型，用来储存需要被绘制的数据
 */

interface ShapeOptions {
  x: number;
  y: number;
  radius: number;

  zIndex: number; // 层级
}

export default class Shape {
  // 唯一id
  id: string;

  // ellipse 类型
  x: number;
  y: number;
  radius: number;
  zIndex: number;

  constructor(options: ShapeOptions) {
    const { x, y, radius, zIndex } = options;

    //   保存原始数据
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.zIndex = zIndex;

    //   生成随机id
    this.id = Math.random().toString(36).substring(2);
  }

  // 自身渲染
  public render(ctx: CanvasRenderingContext2D, fillColor = '#00BFFF'): void {
    if (!ctx) {
      return;
    }

    // 描边
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();

    // 填充
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.closePath();
  }
}
