/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:19:49
 *
 * world: hundreds of circle overlapping with each other. supporting mouse detecting and interacting.
 */

import { World } from './world';

// 1. create world
const world = new World({
  container: 'container',
});

window.world = world;

// 2. generate shape
const shapeList = world.generateShape(120);

// 3. render the scene
const ctx = world.getCtx();
shapeList.forEach((shape) => {
  shape.render(ctx);
});

// destroy when refresh
window.onunload = () => {
  world.destroy();
};
