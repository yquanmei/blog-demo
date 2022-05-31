/*
 * @Author: yquanmei
 * @Date: 2022-05
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-05
 * @FilePath: /blog-demo/interview/clone-deep/lodash/getAllKeys.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
// .internal/getAllKeys.js

// import getSymbols from './getSymbols.js'
// .internal/getSymbols.js
/** Built-in value references. */
const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
const nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
function getSymbols(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return nativeGetSymbols(object).filter((symbol) =>
    propertyIsEnumerable.call(object, symbol)
  );
}

// export default getSymbols

// import keys from '../keys.js'

// arrayLikeKeys.js
//https://github.com/lodash/lodash/blob/master/.internal/arrayLikeKeys.js

// isLength.js
/*
 * isLength(3)
 * // => true
 *
 * isLength(Number.MIN_VALUE)
 * // => false
 *
 * isLength(Infinity)
 * // => false
 *
 * isLength('3')
 * // => false
 */
const MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return (
    typeof value === "number" &&
    value > -1 &&
    value % 1 == 0 &&
    value <= MAX_SAFE_INTEGER
  );
}

// export default isLength

// isArrayLike.js
/** * isArrayLike([1, 2, 3])
 * // => true
 *
 * isArrayLike(document.body.children)
 * // => true
 *
 * isArrayLike('abc')
 * // => true
 *
 * isArrayLike(Function)
 * // => false */

function isArrayLike(value) {
  return value != null && typeof value !== "function" && isLength(value.length);
}

// export default isArrayLike
/*
 * function Foo() {
 *   this.a = 1
 *   this.b = 2
 * }
 *
 * Foo.prototype.c = 3
 *
 * keys(new Foo)
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * keys('hi')
 * // => ['0', '1']
 * */
function keys(object) {
  return isArrayLike(object)
    ? arrayLikeKeys(object)
    : Object.keys(Object(object));
}

// export default keys

function getAllKeys(object) {
  const result = keys(object);
  if (!Array.isArray(object)) {
    result.push(...getSymbols(object));
  }
  return result;
}

export default getAllKeys;
