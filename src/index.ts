/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:19:49
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 22:33:02
 *
 * demo: 数百个圆，随机排布，可被鼠标点击。点击后变色并置于顶层，其他圆的绘制顺序不变。
 */

import { Demo } from './demo';

const demo = new Demo({
  container: 'container',
});

window.demo = demo;

demo.render();
