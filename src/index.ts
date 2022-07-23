/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:19:49
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 21:16:48
 *
 * world: 数百个圆，随机排布，可被鼠标点击。点击后变色并置于顶层，其他圆的绘制顺序不变。
 */

import { World } from './demo';

// 新建world实例
const world = new World({
  container: 'container',
});

window.world = world;

// 生成图形
const shapeList = world.generateShape(120);

// 渲染图像
const ctx = world.getCtx();
shapeList.forEach((shape) => {
  shape.render(ctx);
});

// 退出时销毁实例
window.onunload = () => {
  world.destroy();
};

console.log('1');

// 暂时不需要考虑 react 写组件吧，直接弄点 canvas 渲染即可
