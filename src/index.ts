/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:19:49
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-30 01:15:38
 *
 * demo: 数百个圆，随机排布，可被鼠标点击。点击后变色并置于顶层，其他圆的绘制顺序不变。
 */

import { Demo } from './demo';

// 新建demo
const demo = new Demo({
  container: 'container',
});

window.demo = demo;

// 渲染图形
demo.render();

// 退出时销毁实例
window.onunload = () => {
  demo.destroy();
};
