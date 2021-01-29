/*
 * @Author: yorshka
 * @Date: 2021-01-29 10:29:19
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 10:44:08
 */

export default class Cache {
  private bucket: Map<string, any>;

  constructor() {
    setInterval(() => console.log(1), 1000);

    this.bucket = new Map<string, any>();
  }

  public addCache(name: string, data: any): void {
    this.bucket.set(name, data);
  }
}
