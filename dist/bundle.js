'use strict';

/*
 * @Author: yorshka
 * @Date: 2021-01-29 10:29:19
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 10:44:08
 */
var Cache = /** @class */ (function () {
    function Cache() {
        setInterval(function () { return console.log(1); }, 1000);
        this.bucket = new Map();
    }
    Cache.prototype.addCache = function (name, data) {
        this.bucket.set(name, data);
    };
    return Cache;
}());

/*
 * @Author: yorshka
 * @Date: 2021-01-29 10:25:35
 * @Last Modified by: yorshka
 * @Last Modified time: 2021-01-29 20:20:22
 *
 * canvas demo.
 *
 */
var cache = new Cache();
console.log(cache);
