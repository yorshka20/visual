/*
 * @Author: yorshka
 * @Date: 2021-01-29 23:04:21
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 23:07:47
 *
 * shape类型，用来储存需要被绘制的数据
 */

interface ShapeOptions {
  data: any;
}

export default class Shape {
  // 唯一id
  private id: string;
  // 原始数据
  private rawData: any;

  constructor(options: ShapeOptions) {
    const { data } = options;

    //   保存原始数据
    this.rawData = data;

    //   生成随机id
    this.id = Math.random().toString(36).substring(2);
  }
}
