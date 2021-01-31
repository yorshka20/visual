/*
 * @Author: yorshka
 * @Date: 2021-01-29 22:35:02
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-31 23:16:02
 */

import { CanvasOptions } from '@src/canvas/interface';
import { Shape } from '@src/shape';

export interface MeshOptions extends CanvasOptions {
  gridSize: number;
}

export interface BoundingBoxData {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 包围盒
export class BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(data: BoundingBoxData) {
    const { x, y, width, height } = data;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

export interface Point {
  x: number;
  y: number;
}

interface RankNodeOptions {
  id: string;
  zIndex: number;
  prev?: RankNode;
  next?: RankNode;
}

export class RankNode {
  id: string;
  zIndex: number;
  prev: RankNode;
  next: RankNode;

  pointer: RankNode;

  constructor(options: RankNodeOptions) {
    const { id, zIndex, prev, next } = options;

    this.id = id;
    this.zIndex = zIndex;
    this.next = next;
    this.prev = prev;
  }

  // 输出为数组
  public toArray(): string[] {
    const list = [];
    const head = this.prev;

    let curr = head.next;
    while (curr) {
      if (curr) {
        list.push(curr.id);
        curr = curr.next;
      } else {
        break;
      }
    }

    return list;
  }

  // 在最尾部插入
  public append(node: RankNode): void {
    const head = this.prev;
    let curr = head.next;

    // console.log('this', this);
    // console.log('head', head);
    // console.log('curr', curr);

    let target = curr;
    while (curr) {
      if (!curr.next) {
        target = curr;
        break;
      }
      curr = curr.next;
    }

    if (!target) {
      head.next = node;
      node.prev = head;
      return;
    }

    node.prev = target;
    target.next = node;
  }

  // 插入节点，在位置index插入node，长度不够则在最后插入
  public insert(node: RankNode, index: number): void {
    const head = this.prev;
    let targetNode = head.next;

    if (!index) {
      this.next = node;
      node.prev = this;
      return;
    }

    while (index) {
      if (targetNode.next) {
        targetNode = targetNode.next;
        index--;
      } else {
        // 最后一个
        targetNode.next = node;
        node.prev = targetNode;
        return;
      }
    }

    const tmp = targetNode.next;
    if (tmp) {
      tmp.prev = node;
    }
    targetNode.next = node;
    node.next = tmp;
    node.prev = targetNode;
  }

  // 删除节点
  public delete(node: RankNode): void {
    let target = this.next;

    while (target) {
      if (target.id == node.id) {
        target.prev.next = target.next;
        target.next.prev = target.prev;
        break;
      }

      target = target.next;
    }
  }

  // 按id删除元素
  public deleteById(id: string): void {
    const head = this.prev;
    let curr = head.next;

    let target: RankNode;
    while (curr) {
      if (curr.id == id) {
        target = curr;
        break;
      }

      curr = curr.next;
    }

    if (!target) {
      return;
    }

    console.log('target delete: ===>', target);

    const next = target.next;
    target.prev.next = next;
    if (next) {
      next.prev = target.prev;
    }

    target = null;
  }
}
