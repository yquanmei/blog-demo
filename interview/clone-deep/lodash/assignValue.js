/*
 * @Author: yquanmei
 * @Date: 2022-05
 * @LastEditors: yquanmei
 * @LastEditTime: 2022-05
 * @FilePath: /blog-demo/interview/clone-deep/lodash/assignValue.js
 * @Description:
 * Copyright (c) 2022 by 用户/公司名, All Rights Reserved.
 */
// import baseAssignValue from "./baseAssignValue.js";
function baseAssignValue(object, key, value) {
  // console.log(`%c object:::`, "background-color: pink;font-size:14px;", object);
  // console.log(`%c key:::`, "background-color: pink;font-size:14px;", key);
  // console.log(`%c value:::`, "background-color: pink;font-size:14px;", value);
  if (key == "__proto__") {
    Object.defineProperty(object, key, {
      configurable: true,
      enumerable: true,
      value: value,
      writable: true,
    });
  } else {
    object[key] = value;
  }
}

// export default baseAssignValue
// import eq from "../eq.js";
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

// export default eq

/** Used to check objects for own properties. */
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  const objValue = object[key];

  if (!(hasOwnProperty.call(object, key) && eq(objValue, value))) {
    if (value !== 0 || 1 / value === 1 / objValue) {
      baseAssignValue(object, key, value);
    }
  } else if (value === undefined && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}

export default assignValue;
