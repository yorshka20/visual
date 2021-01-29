/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:19:49
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 22:23:45
 */

import { Demo } from './demo';

const demo = new Demo({
  container: 'container',
});

window.demo = demo;

demo.render();
