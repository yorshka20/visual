/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:19:49
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 21:16:48
 *
 * demo: 数百个圆，随机排布，可被鼠标点击。点击后变色并置于顶层，其他圆的绘制顺序不变。
 */

import { Demo } from './demo';

// 新建demo实例
const demo = new Demo({
  container: 'container',
});

window.demo = demo;

// 生成图形
const shapeList = demo.generateShape(120);

// 渲染图像
const ctx = demo.getCtx();
shapeList.forEach((shape) => {
  shape.render(ctx);
});

// 退出时销毁实例
window.onunload = () => {
  demo.destroy();
};
