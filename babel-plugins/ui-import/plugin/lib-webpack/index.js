/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(4);
/* provided dependency */ var console = __webpack_require__(5);
// Currently in sync with Node.js lib/assert.js
// https://github.com/nodejs/node/commit/2a51ae424a513ec9a6aa3466baa0cc1d55dd4f3b
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var _require = __webpack_require__(2),
    _require$codes = _require.codes,
    ERR_AMBIGUOUS_ARGUMENT = _require$codes.ERR_AMBIGUOUS_ARGUMENT,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_INVALID_ARG_VALUE = _require$codes.ERR_INVALID_ARG_VALUE,
    ERR_INVALID_RETURN_VALUE = _require$codes.ERR_INVALID_RETURN_VALUE,
    ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;

var AssertionError = __webpack_require__(26);

var _require2 = __webpack_require__(3),
    inspect = _require2.inspect;

var _require$types = (__webpack_require__(3).types),
    isPromise = _require$types.isPromise,
    isRegExp = _require$types.isRegExp;

var objectAssign = Object.assign ? Object.assign : (__webpack_require__(27).assign);
var objectIs = Object.is ? Object.is : __webpack_require__(28);
var errorCache = new Map();
var isDeepEqual;
var isDeepStrictEqual;
var parseExpressionAt;
var findNodeAround;
var decoder;

function lazyLoadComparison() {
  var comparison = __webpack_require__(37);

  isDeepEqual = comparison.isDeepEqual;
  isDeepStrictEqual = comparison.isDeepStrictEqual;
} // Escape control characters but not \n and \t to keep the line breaks and
// indentation intact.
// eslint-disable-next-line no-control-regex


var escapeSequencesRegExp = /[\x00-\x08\x0b\x0c\x0e-\x1f]/g;
var meta = ["\\u0000", "\\u0001", "\\u0002", "\\u0003", "\\u0004", "\\u0005", "\\u0006", "\\u0007", '\\b', '', '', "\\u000b", '\\f', '', "\\u000e", "\\u000f", "\\u0010", "\\u0011", "\\u0012", "\\u0013", "\\u0014", "\\u0015", "\\u0016", "\\u0017", "\\u0018", "\\u0019", "\\u001a", "\\u001b", "\\u001c", "\\u001d", "\\u001e", "\\u001f"];

var escapeFn = function escapeFn(str) {
  return meta[str.charCodeAt(0)];
};

var warned = false; // The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;
var NO_EXCEPTION_SENTINEL = {}; // All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided. All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function innerFail(obj) {
  if (obj.message instanceof Error) throw obj.message;
  throw new AssertionError(obj);
}

function fail(actual, expected, message, operator, stackStartFn) {
  var argsLen = arguments.length;
  var internalMessage;

  if (argsLen === 0) {
    internalMessage = 'Failed';
  } else if (argsLen === 1) {
    message = actual;
    actual = undefined;
  } else {
    if (warned === false) {
      warned = true;
      var warn = process.emitWarning ? process.emitWarning : console.warn.bind(console);
      warn('assert.fail() with more than one argument is deprecated. ' + 'Please use assert.strictEqual() instead or only pass a message.', 'DeprecationWarning', 'DEP0094');
    }

    if (argsLen === 2) operator = '!=';
  }

  if (message instanceof Error) throw message;
  var errArgs = {
    actual: actual,
    expected: expected,
    operator: operator === undefined ? 'fail' : operator,
    stackStartFn: stackStartFn || fail
  };

  if (message !== undefined) {
    errArgs.message = message;
  }

  var err = new AssertionError(errArgs);

  if (internalMessage) {
    err.message = internalMessage;
    err.generatedMessage = true;
  }

  throw err;
}

assert.fail = fail; // The AssertionError is defined in internal/error.

assert.AssertionError = AssertionError;

function innerOk(fn, argLen, value, message) {
  if (!value) {
    var generatedMessage = false;

    if (argLen === 0) {
      generatedMessage = true;
      message = 'No value argument passed to `assert.ok()`';
    } else if (message instanceof Error) {
      throw message;
    }

    var err = new AssertionError({
      actual: value,
      expected: true,
      message: message,
      operator: '==',
      stackStartFn: fn
    });
    err.generatedMessage = generatedMessage;
    throw err;
  }
} // Pure assertion tests whether a value is truthy, as determined
// by !!value.


function ok() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  innerOk.apply(void 0, [ok, args.length].concat(args));
}

assert.ok = ok; // The equality assertion tests shallow, coercive equality with ==.

/* eslint-disable no-restricted-properties */

assert.equal = function equal(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  } // eslint-disable-next-line eqeqeq


  if (actual != expected) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: '==',
      stackStartFn: equal
    });
  }
}; // The non-equality assertion tests for whether two objects are not
// equal with !=.


assert.notEqual = function notEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  } // eslint-disable-next-line eqeqeq


  if (actual == expected) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: '!=',
      stackStartFn: notEqual
    });
  }
}; // The equivalence assertion tests a deep equality relation.


assert.deepEqual = function deepEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (isDeepEqual === undefined) lazyLoadComparison();

  if (!isDeepEqual(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'deepEqual',
      stackStartFn: deepEqual
    });
  }
}; // The non-equivalence assertion tests for any deep inequality.


assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (isDeepEqual === undefined) lazyLoadComparison();

  if (isDeepEqual(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'notDeepEqual',
      stackStartFn: notDeepEqual
    });
  }
};
/* eslint-enable */


assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (isDeepEqual === undefined) lazyLoadComparison();

  if (!isDeepStrictEqual(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'deepStrictEqual',
      stackStartFn: deepStrictEqual
    });
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;

function notDeepStrictEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (isDeepEqual === undefined) lazyLoadComparison();

  if (isDeepStrictEqual(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'notDeepStrictEqual',
      stackStartFn: notDeepStrictEqual
    });
  }
}

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (!objectIs(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'strictEqual',
      stackStartFn: strictEqual
    });
  }
};

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (objectIs(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'notStrictEqual',
      stackStartFn: notStrictEqual
    });
  }
};

var Comparison = function Comparison(obj, keys, actual) {
  var _this = this;

  _classCallCheck(this, Comparison);

  keys.forEach(function (key) {
    if (key in obj) {
      if (actual !== undefined && typeof actual[key] === 'string' && isRegExp(obj[key]) && obj[key].test(actual[key])) {
        _this[key] = actual[key];
      } else {
        _this[key] = obj[key];
      }
    }
  });
};

function compareExceptionKey(actual, expected, key, message, keys, fn) {
  if (!(key in actual) || !isDeepStrictEqual(actual[key], expected[key])) {
    if (!message) {
      // Create placeholder objects to create a nice output.
      var a = new Comparison(actual, keys);
      var b = new Comparison(expected, keys, actual);
      var err = new AssertionError({
        actual: a,
        expected: b,
        operator: 'deepStrictEqual',
        stackStartFn: fn
      });
      err.actual = actual;
      err.expected = expected;
      err.operator = fn.name;
      throw err;
    }

    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: fn.name,
      stackStartFn: fn
    });
  }
}

function expectedException(actual, expected, msg, fn) {
  if (typeof expected !== 'function') {
    if (isRegExp(expected)) return expected.test(actual); // assert.doesNotThrow does not accept objects.

    if (arguments.length === 2) {
      throw new ERR_INVALID_ARG_TYPE('expected', ['Function', 'RegExp'], expected);
    } // Handle primitives properly.


    if (_typeof(actual) !== 'object' || actual === null) {
      var err = new AssertionError({
        actual: actual,
        expected: expected,
        message: msg,
        operator: 'deepStrictEqual',
        stackStartFn: fn
      });
      err.operator = fn.name;
      throw err;
    }

    var keys = Object.keys(expected); // Special handle errors to make sure the name and the message are compared
    // as well.

    if (expected instanceof Error) {
      keys.push('name', 'message');
    } else if (keys.length === 0) {
      throw new ERR_INVALID_ARG_VALUE('error', expected, 'may not be an empty object');
    }

    if (isDeepEqual === undefined) lazyLoadComparison();
    keys.forEach(function (key) {
      if (typeof actual[key] === 'string' && isRegExp(expected[key]) && expected[key].test(actual[key])) {
        return;
      }

      compareExceptionKey(actual, expected, key, msg, keys, fn);
    });
    return true;
  } // Guard instanceof against arrow functions as they don't have a prototype.


  if (expected.prototype !== undefined && actual instanceof expected) {
    return true;
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function getActual(fn) {
  if (typeof fn !== 'function') {
    throw new ERR_INVALID_ARG_TYPE('fn', 'Function', fn);
  }

  try {
    fn();
  } catch (e) {
    return e;
  }

  return NO_EXCEPTION_SENTINEL;
}

function checkIsPromise(obj) {
  // Accept native ES6 promises and promises that are implemented in a similar
  // way. Do not accept thenables that use a function as `obj` and that have no
  // `catch` handler.
  // TODO: thenables are checked up until they have the correct methods,
  // but according to documentation, the `then` method should receive
  // the `fulfill` and `reject` arguments as well or it may be never resolved.
  return isPromise(obj) || obj !== null && _typeof(obj) === 'object' && typeof obj.then === 'function' && typeof obj.catch === 'function';
}

function waitForActual(promiseFn) {
  return Promise.resolve().then(function () {
    var resultPromise;

    if (typeof promiseFn === 'function') {
      // Return a rejected promise if `promiseFn` throws synchronously.
      resultPromise = promiseFn(); // Fail in case no promise is returned.

      if (!checkIsPromise(resultPromise)) {
        throw new ERR_INVALID_RETURN_VALUE('instance of Promise', 'promiseFn', resultPromise);
      }
    } else if (checkIsPromise(promiseFn)) {
      resultPromise = promiseFn;
    } else {
      throw new ERR_INVALID_ARG_TYPE('promiseFn', ['Function', 'Promise'], promiseFn);
    }

    return Promise.resolve().then(function () {
      return resultPromise;
    }).then(function () {
      return NO_EXCEPTION_SENTINEL;
    }).catch(function (e) {
      return e;
    });
  });
}

function expectsError(stackStartFn, actual, error, message) {
  if (typeof error === 'string') {
    if (arguments.length === 4) {
      throw new ERR_INVALID_ARG_TYPE('error', ['Object', 'Error', 'Function', 'RegExp'], error);
    }

    if (_typeof(actual) === 'object' && actual !== null) {
      if (actual.message === error) {
        throw new ERR_AMBIGUOUS_ARGUMENT('error/message', "The error message \"".concat(actual.message, "\" is identical to the message."));
      }
    } else if (actual === error) {
      throw new ERR_AMBIGUOUS_ARGUMENT('error/message', "The error \"".concat(actual, "\" is identical to the message."));
    }

    message = error;
    error = undefined;
  } else if (error != null && _typeof(error) !== 'object' && typeof error !== 'function') {
    throw new ERR_INVALID_ARG_TYPE('error', ['Object', 'Error', 'Function', 'RegExp'], error);
  }

  if (actual === NO_EXCEPTION_SENTINEL) {
    var details = '';

    if (error && error.name) {
      details += " (".concat(error.name, ")");
    }

    details += message ? ": ".concat(message) : '.';
    var fnType = stackStartFn.name === 'rejects' ? 'rejection' : 'exception';
    innerFail({
      actual: undefined,
      expected: error,
      operator: stackStartFn.name,
      message: "Missing expected ".concat(fnType).concat(details),
      stackStartFn: stackStartFn
    });
  }

  if (error && !expectedException(actual, error, message, stackStartFn)) {
    throw actual;
  }
}

function expectsNoError(stackStartFn, actual, error, message) {
  if (actual === NO_EXCEPTION_SENTINEL) return;

  if (typeof error === 'string') {
    message = error;
    error = undefined;
  }

  if (!error || expectedException(actual, error)) {
    var details = message ? ": ".concat(message) : '.';
    var fnType = stackStartFn.name === 'doesNotReject' ? 'rejection' : 'exception';
    innerFail({
      actual: actual,
      expected: error,
      operator: stackStartFn.name,
      message: "Got unwanted ".concat(fnType).concat(details, "\n") + "Actual message: \"".concat(actual && actual.message, "\""),
      stackStartFn: stackStartFn
    });
  }

  throw actual;
}

assert.throws = function throws(promiseFn) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  expectsError.apply(void 0, [throws, getActual(promiseFn)].concat(args));
};

assert.rejects = function rejects(promiseFn) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return waitForActual(promiseFn).then(function (result) {
    return expectsError.apply(void 0, [rejects, result].concat(args));
  });
};

assert.doesNotThrow = function doesNotThrow(fn) {
  for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  expectsNoError.apply(void 0, [doesNotThrow, getActual(fn)].concat(args));
};

assert.doesNotReject = function doesNotReject(fn) {
  for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  return waitForActual(fn).then(function (result) {
    return expectsNoError.apply(void 0, [doesNotReject, result].concat(args));
  });
};

assert.ifError = function ifError(err) {
  if (err !== null && err !== undefined) {
    var message = 'ifError got unwanted exception: ';

    if (_typeof(err) === 'object' && typeof err.message === 'string') {
      if (err.message.length === 0 && err.constructor) {
        message += err.constructor.name;
      } else {
        message += err.message;
      }
    } else {
      message += inspect(err);
    }

    var newErr = new AssertionError({
      actual: err,
      expected: null,
      operator: 'ifError',
      message: message,
      stackStartFn: ifError
    }); // Make sure we actually have a stack trace!

    var origStack = err.stack;

    if (typeof origStack === 'string') {
      // This will remove any duplicated frames from the error frames taken
      // from within `ifError` and add the original error frames to the newly
      // created ones.
      var tmp2 = origStack.split('\n');
      tmp2.shift(); // Filter all frames existing in err.stack.

      var tmp1 = newErr.stack.split('\n');

      for (var i = 0; i < tmp2.length; i++) {
        // Find the first occurrence of the frame.
        var pos = tmp1.indexOf(tmp2[i]);

        if (pos !== -1) {
          // Only keep new frames.
          tmp1 = tmp1.slice(0, pos);
          break;
        }
      }

      newErr.stack = "".concat(tmp1.join('\n'), "\n").concat(tmp2.join('\n'));
    }

    throw newErr;
  }
}; // Expose a strict only variant of assert


function strict() {
  for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }

  innerOk.apply(void 0, [strict, args.length].concat(args));
}

assert.strict = objectAssign(strict, assert, {
  equal: assert.strictEqual,
  deepEqual: assert.deepStrictEqual,
  notEqual: assert.notStrictEqual,
  notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Currently in sync with Node.js lib/internal/errors.js
// https://github.com/nodejs/node/commit/3b044962c48fe313905877a96b5d0894a5404f6f

/* eslint node-core/documented-errors: "error" */

/* eslint node-core/alphabetize-errors: "error" */

/* eslint node-core/prefer-util-format-errors: "error" */
 // The whole point behind this internal module is to allow Node.js to no
// longer be forced to treat every error message change as a semver-major
// change. The NodeError classes here all expose a `code` property whose
// value statically and permanently identifies the error. While the error
// message may change, the code should not.

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

var codes = {}; // Lazy loaded

var assert;
var util;

function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error;
  }

  function getMessage(arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message;
    } else {
      return message(arg1, arg2, arg3);
    }
  }

  var NodeError = /*#__PURE__*/function (_Base) {
    _inherits(NodeError, _Base);

    function NodeError(arg1, arg2, arg3) {
      var _this;

      _classCallCheck(this, NodeError);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(NodeError).call(this, getMessage(arg1, arg2, arg3)));
      _this.code = code;
      return _this;
    }

    return NodeError;
  }(Base);

  codes[code] = NodeError;
} // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js


function oneOf(expected, thing) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    expected = expected.map(function (i) {
      return String(i);
    });

    if (len > 2) {
      return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
    } else if (len === 2) {
      return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
    } else {
      return "of ".concat(thing, " ").concat(expected[0]);
    }
  } else {
    return "of ".concat(thing, " ").concat(String(expected));
  }
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith


function startsWith(str, search, pos) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType('ERR_AMBIGUOUS_ARGUMENT', 'The "%s" argument is ambiguous. %s', TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  if (assert === undefined) assert = __webpack_require__(1);
  assert(typeof name === 'string', "'name' must be a string"); // determiner: 'must be' or 'must not be'

  var determiner;

  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  var msg;

  if (endsWith(name, ' argument')) {
    // For cases like 'first argument'
    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } else {
    var type = includes(name, '.') ? 'property' : 'argument';
    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } // TODO(BridgeAR): Improve the output by showing `null` and similar.


  msg += ". Received type ".concat(_typeof(actual));
  return msg;
}, TypeError);
createErrorType('ERR_INVALID_ARG_VALUE', function (name, value) {
  var reason = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'is invalid';
  if (util === undefined) util = __webpack_require__(3);
  var inspected = util.inspect(value);

  if (inspected.length > 128) {
    inspected = "".concat(inspected.slice(0, 128), "...");
  }

  return "The argument '".concat(name, "' ").concat(reason, ". Received ").concat(inspected);
}, TypeError, RangeError);
createErrorType('ERR_INVALID_RETURN_VALUE', function (input, name, value) {
  var type;

  if (value && value.constructor && value.constructor.name) {
    type = "instance of ".concat(value.constructor.name);
  } else {
    type = "type ".concat(_typeof(value));
  }

  return "Expected ".concat(input, " to be returned from the \"").concat(name, "\"") + " function but got ".concat(type, ".");
}, TypeError);
createErrorType('ERR_MISSING_ARGS', function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (assert === undefined) assert = __webpack_require__(1);
  assert(args.length > 0, 'At least one arg needs to be specified');
  var msg = 'The ';
  var len = args.length;
  args = args.map(function (a) {
    return "\"".concat(a, "\"");
  });

  switch (len) {
    case 1:
      msg += "".concat(args[0], " argument");
      break;

    case 2:
      msg += "".concat(args[0], " and ").concat(args[1], " arguments");
      break;

    default:
      msg += args.slice(0, len - 1).join(', ');
      msg += ", and ".concat(args[len - 1], " arguments");
      break;
  }

  return "".concat(msg, " must be specified");
}, TypeError);
module.exports.codes = codes;

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(4);
/* provided dependency */ var console = __webpack_require__(5);


// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(obj) {
  var keys = Object.keys(obj);
  var descriptors = {};

  for (var i = 0; i < keys.length; i++) {
    descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
  }

  return descriptors;
};

var formatRegExp = /%[sdj%]/g;

exports.format = function (f) {
  if (!isString(f)) {
    var objects = [];

    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }

    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;

    switch (x) {
      case '%s':
        return String(args[i++]);

      case '%d':
        return Number(args[i++]);

      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }

      default:
        return x;
    }
  });

  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }

  return str;
}; // Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.


exports.deprecate = function (fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  } // Allow for deprecating things in the process of starting up.


  if (typeof process === 'undefined') {
    return function () {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;

  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }

      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
};

var debugs = {};
var debugEnvRegex = /^$/;

if (process.env.NODE_DEBUG) {
  var debugEnv = process.env.NODE_DEBUG;
  debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&').replace(/\*/g, '.*').replace(/,/g, '$|^').toUpperCase();
  debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
}

exports.debuglog = function (set) {
  set = set.toUpperCase();

  if (!debugs[set]) {
    if (debugEnvRegex.test(set)) {
      var pid = process.pid;

      debugs[set] = function () {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function () {};
    }
  }

  return debugs[set];
};
/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */

/* legacy: obj, showHidden, depth, colors*/


function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  }; // legacy...

  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];

  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  } // set default options


  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

exports.inspect = inspect; // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

inspect.colors = {
  'bold': [1, 22],
  'italic': [3, 23],
  'underline': [4, 24],
  'inverse': [7, 27],
  'white': [37, 39],
  'grey': [90, 39],
  'black': [30, 39],
  'blue': [34, 39],
  'cyan': [36, 39],
  'green': [32, 39],
  'magenta': [35, 39],
  'red': [31, 39],
  'yellow': [33, 39]
}; // Don't use 'blue' not visible on cmd.exe

inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}

function stylizeNoColor(str, styleType) {
  return str;
}

function arrayToHash(array) {
  var hash = {};
  array.forEach(function (val, idx) {
    hash[val] = true;
  });
  return hash;
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
  value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);

    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }

    return ret;
  } // Primitive types cannot have properties


  var primitive = formatPrimitive(ctx, value);

  if (primitive) {
    return primitive;
  } // Look up the keys of the object.


  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  } // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx


  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  } // Some type of object without properties can be shortcutted.


  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }

    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }

    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }

    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '',
      array = false,
      braces = ['{', '}']; // Make Array say that they are Array

  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  } // Make functions say that they are functions


  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  } // Make RegExps say that they are RegExps


  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  } // Make dates with properties first say the date


  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  } // Make error with message first say the error


  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);
  var output;

  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();
  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }

  if (isNumber(value)) return ctx.stylize('' + value, 'number');
  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean'); // For some reason typeof null is "object", so special case here.

  if (isNull(value)) return ctx.stylize('null', 'null');
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];

  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push('');
    }
  }

  keys.forEach(function (key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || {
    value: value[key]
  };

  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }

  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }

  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }

      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function (line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function (line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }

  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }

    name = JSON.stringify('' + key);

    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function (prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
} // NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.


exports.types = __webpack_require__(6);

function isArray(ar) {
  return Array.isArray(ar);
}

exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}

exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}

exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}

exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}

exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}

exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}

exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

exports.isRegExp = isRegExp;
exports.types.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

exports.isDate = isDate;
exports.types.isDate = isDate;

function isError(e) {
  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
}

exports.isError = isError;
exports.types.isNativeError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}

exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}

exports.isPrimitive = isPrimitive;
exports.isBuffer = __webpack_require__(24);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 26 Feb 16:19:34

function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
} // log is just a thin wrapper to console.log that prepends a timestamp


exports.log = function () {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};
/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */


exports.inherits = __webpack_require__(25);

exports._extend = function (origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;
  var keys = Object.keys(add);
  var i = keys.length;

  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }

  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function') throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];

    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }

    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn,
      enumerable: false,
      writable: false,
      configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });
    var args = [];

    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn,
    enumerable: false,
    writable: false,
    configurable: true
  });
  return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
};

exports.promisify.custom = kCustomPromisifiedSymbol;

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }

  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  } // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.


  function callbackified() {
    var args = [];

    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();

    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }

    var self = this;

    var cb = function () {
      return maybeCb.apply(self, arguments);
    }; // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)


    original.apply(this, args).then(function (ret) {
      process.nextTick(cb.bind(null, null, ret));
    }, function (rej) {
      process.nextTick(callbackifyOnRejected.bind(null, rej, cb));
    });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
  return callbackified;
}

exports.callbackify = callbackify;

/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";


// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};

/***/ }),
/* 5 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/*global window, global*/
var util = __webpack_require__(3);

var assert = __webpack_require__(1);

function now() {
  return new Date().getTime();
}

var slice = Array.prototype.slice;
var console;
var times = {};

if (typeof __webpack_require__.g !== "undefined" && __webpack_require__.g.console) {
  console = __webpack_require__.g.console;
} else if (typeof window !== "undefined" && window.console) {
  console = window.console;
} else {
  console = {};
}

var functions = [[log, "log"], [info, "info"], [warn, "warn"], [error, "error"], [time, "time"], [timeEnd, "timeEnd"], [trace, "trace"], [dir, "dir"], [consoleAssert, "assert"]];

for (var i = 0; i < functions.length; i++) {
  var tuple = functions[i];
  var f = tuple[0];
  var name = tuple[1];

  if (!console[name]) {
    console[name] = f;
  }
}

module.exports = console;

function log() {}

function info() {
  console.log.apply(console, arguments);
}

function warn() {
  console.log.apply(console, arguments);
}

function error() {
  console.warn.apply(console, arguments);
}

function time(label) {
  times[label] = now();
}

function timeEnd(label) {
  var time = times[label];

  if (!time) {
    throw new Error("No such label: " + label);
  }

  delete times[label];
  var duration = now() - time;
  console.log(label + ": " + duration + "ms");
}

function trace() {
  var err = new Error();
  err.name = "Trace";
  err.message = util.format.apply(null, arguments);
  console.error(err.stack);
}

function dir(object) {
  console.log(util.inspect(object) + "\n");
}

function consoleAssert(expression) {
  if (!expression) {
    var arr = slice.call(arguments, 1);
    assert.ok(false, util.format.apply(null, arr));
  }
}

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// Currently in sync with Node.js lib/internal/util/types.js
// https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9


var isArgumentsObject = __webpack_require__(7);

var isGeneratorFunction = __webpack_require__(17);

var whichTypedArray = __webpack_require__(18);

var isTypedArray = __webpack_require__(23);

function uncurryThis(f) {
  return f.call.bind(f);
}

var BigIntSupported = typeof BigInt !== 'undefined';
var SymbolSupported = typeof Symbol !== 'undefined';
var ObjectToString = uncurryThis(Object.prototype.toString);
var numberValue = uncurryThis(Number.prototype.valueOf);
var stringValue = uncurryThis(String.prototype.valueOf);
var booleanValue = uncurryThis(Boolean.prototype.valueOf);

if (BigIntSupported) {
  var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
}

if (SymbolSupported) {
  var symbolValue = uncurryThis(Symbol.prototype.valueOf);
}

function checkBoxedPrimitive(value, prototypeValueOf) {
  if (typeof value !== 'object') {
    return false;
  }

  try {
    prototypeValueOf(value);
    return true;
  } catch (e) {
    return false;
  }
}

exports.isArgumentsObject = isArgumentsObject;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isTypedArray = isTypedArray; // Taken from here and modified for better browser support
// https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js

function isPromise(input) {
  return typeof Promise !== 'undefined' && input instanceof Promise || input !== null && typeof input === 'object' && typeof input.then === 'function' && typeof input.catch === 'function';
}

exports.isPromise = isPromise;

function isArrayBufferView(value) {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    return ArrayBuffer.isView(value);
  }

  return isTypedArray(value) || isDataView(value);
}

exports.isArrayBufferView = isArrayBufferView;

function isUint8Array(value) {
  return whichTypedArray(value) === 'Uint8Array';
}

exports.isUint8Array = isUint8Array;

function isUint8ClampedArray(value) {
  return whichTypedArray(value) === 'Uint8ClampedArray';
}

exports.isUint8ClampedArray = isUint8ClampedArray;

function isUint16Array(value) {
  return whichTypedArray(value) === 'Uint16Array';
}

exports.isUint16Array = isUint16Array;

function isUint32Array(value) {
  return whichTypedArray(value) === 'Uint32Array';
}

exports.isUint32Array = isUint32Array;

function isInt8Array(value) {
  return whichTypedArray(value) === 'Int8Array';
}

exports.isInt8Array = isInt8Array;

function isInt16Array(value) {
  return whichTypedArray(value) === 'Int16Array';
}

exports.isInt16Array = isInt16Array;

function isInt32Array(value) {
  return whichTypedArray(value) === 'Int32Array';
}

exports.isInt32Array = isInt32Array;

function isFloat32Array(value) {
  return whichTypedArray(value) === 'Float32Array';
}

exports.isFloat32Array = isFloat32Array;

function isFloat64Array(value) {
  return whichTypedArray(value) === 'Float64Array';
}

exports.isFloat64Array = isFloat64Array;

function isBigInt64Array(value) {
  return whichTypedArray(value) === 'BigInt64Array';
}

exports.isBigInt64Array = isBigInt64Array;

function isBigUint64Array(value) {
  return whichTypedArray(value) === 'BigUint64Array';
}

exports.isBigUint64Array = isBigUint64Array;

function isMapToString(value) {
  return ObjectToString(value) === '[object Map]';
}

isMapToString.working = typeof Map !== 'undefined' && isMapToString(new Map());

function isMap(value) {
  if (typeof Map === 'undefined') {
    return false;
  }

  return isMapToString.working ? isMapToString(value) : value instanceof Map;
}

exports.isMap = isMap;

function isSetToString(value) {
  return ObjectToString(value) === '[object Set]';
}

isSetToString.working = typeof Set !== 'undefined' && isSetToString(new Set());

function isSet(value) {
  if (typeof Set === 'undefined') {
    return false;
  }

  return isSetToString.working ? isSetToString(value) : value instanceof Set;
}

exports.isSet = isSet;

function isWeakMapToString(value) {
  return ObjectToString(value) === '[object WeakMap]';
}

isWeakMapToString.working = typeof WeakMap !== 'undefined' && isWeakMapToString(new WeakMap());

function isWeakMap(value) {
  if (typeof WeakMap === 'undefined') {
    return false;
  }

  return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
}

exports.isWeakMap = isWeakMap;

function isWeakSetToString(value) {
  return ObjectToString(value) === '[object WeakSet]';
}

isWeakSetToString.working = typeof WeakSet !== 'undefined' && isWeakSetToString(new WeakSet());

function isWeakSet(value) {
  return isWeakSetToString(value);
}

exports.isWeakSet = isWeakSet;

function isArrayBufferToString(value) {
  return ObjectToString(value) === '[object ArrayBuffer]';
}

isArrayBufferToString.working = typeof ArrayBuffer !== 'undefined' && isArrayBufferToString(new ArrayBuffer());

function isArrayBuffer(value) {
  if (typeof ArrayBuffer === 'undefined') {
    return false;
  }

  return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
}

exports.isArrayBuffer = isArrayBuffer;

function isDataViewToString(value) {
  return ObjectToString(value) === '[object DataView]';
}

isDataViewToString.working = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined' && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));

function isDataView(value) {
  if (typeof DataView === 'undefined') {
    return false;
  }

  return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
}

exports.isDataView = isDataView; // Store a copy of SharedArrayBuffer in case it's deleted elsewhere

var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;

function isSharedArrayBufferToString(value) {
  return ObjectToString(value) === '[object SharedArrayBuffer]';
}

function isSharedArrayBuffer(value) {
  if (typeof SharedArrayBufferCopy === 'undefined') {
    return false;
  }

  if (typeof isSharedArrayBufferToString.working === 'undefined') {
    isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
  }

  return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBufferCopy;
}

exports.isSharedArrayBuffer = isSharedArrayBuffer;

function isAsyncFunction(value) {
  return ObjectToString(value) === '[object AsyncFunction]';
}

exports.isAsyncFunction = isAsyncFunction;

function isMapIterator(value) {
  return ObjectToString(value) === '[object Map Iterator]';
}

exports.isMapIterator = isMapIterator;

function isSetIterator(value) {
  return ObjectToString(value) === '[object Set Iterator]';
}

exports.isSetIterator = isSetIterator;

function isGeneratorObject(value) {
  return ObjectToString(value) === '[object Generator]';
}

exports.isGeneratorObject = isGeneratorObject;

function isWebAssemblyCompiledModule(value) {
  return ObjectToString(value) === '[object WebAssembly.Module]';
}

exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

function isNumberObject(value) {
  return checkBoxedPrimitive(value, numberValue);
}

exports.isNumberObject = isNumberObject;

function isStringObject(value) {
  return checkBoxedPrimitive(value, stringValue);
}

exports.isStringObject = isStringObject;

function isBooleanObject(value) {
  return checkBoxedPrimitive(value, booleanValue);
}

exports.isBooleanObject = isBooleanObject;

function isBigIntObject(value) {
  return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
}

exports.isBigIntObject = isBigIntObject;

function isSymbolObject(value) {
  return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
}

exports.isSymbolObject = isSymbolObject;

function isBoxedPrimitive(value) {
  return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
}

exports.isBoxedPrimitive = isBoxedPrimitive;

function isAnyArrayBuffer(value) {
  return typeof Uint8Array !== 'undefined' && (isArrayBuffer(value) || isSharedArrayBuffer(value));
}

exports.isAnyArrayBuffer = isAnyArrayBuffer;
['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function (method) {
  Object.defineProperty(exports, method, {
    enumerable: false,
    value: function () {
      throw new Error(method + ' is not supported in userland');
    }
  });
});

/***/ }),
/* 7 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var hasToStringTag = __webpack_require__(8)();

var callBound = __webpack_require__(10);

var $toString = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
  if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
    return false;
  }

  return $toString(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
  if (isStandardArguments(value)) {
    return true;
  }

  return value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && $toString(value) !== '[object Array]' && $toString(value.callee) === '[object Function]';
};

var supportsStandardArguments = function () {
  return isStandardArguments(arguments);
}();

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

/***/ }),
/* 8 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var hasSymbols = __webpack_require__(9);

module.exports = function hasToStringTagShams() {
  return hasSymbols() && !!Symbol.toStringTag;
};

/***/ }),
/* 9 */
/***/ ((module) => {

"use strict";

/* eslint complexity: [2, 18], max-statements: [2, 33] */

module.exports = function hasSymbols() {
  if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
    return false;
  }

  if (typeof Symbol.iterator === 'symbol') {
    return true;
  }

  var obj = {};
  var sym = Symbol('test');
  var symObj = Object(sym);

  if (typeof sym === 'string') {
    return false;
  }

  if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
    return false;
  }

  if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
    return false;
  } // temp disabled per https://github.com/ljharb/object.assign/issues/17
  // if (sym instanceof Symbol) { return false; }
  // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
  // if (!(symObj instanceof Symbol)) { return false; }
  // if (typeof Symbol.prototype.toString !== 'function') { return false; }
  // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }


  var symVal = 42;
  obj[sym] = symVal;

  for (sym in obj) {
    return false;
  } // eslint-disable-line no-restricted-syntax, no-unreachable-loop


  if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
    return false;
  }

  if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
    return false;
  }

  var syms = Object.getOwnPropertySymbols(obj);

  if (syms.length !== 1 || syms[0] !== sym) {
    return false;
  }

  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    return false;
  }

  if (typeof Object.getOwnPropertyDescriptor === 'function') {
    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);

    if (descriptor.value !== symVal || descriptor.enumerable !== true) {
      return false;
    }
  }

  return true;
};

/***/ }),
/* 10 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(11);

var callBind = __webpack_require__(16);

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
  var intrinsic = GetIntrinsic(name, !!allowMissing);

  if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
    return callBind(intrinsic);
  }

  return intrinsic;
};

/***/ }),
/* 11 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var undefined;
var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError; // eslint-disable-next-line consistent-return

var getEvalledConstructor = function (expressionSyntax) {
  try {
    return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
  } catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;

if ($gOPD) {
  try {
    $gOPD({}, '');
  } catch (e) {
    $gOPD = null; // this is IE 8, which has a broken gOPD
  }
}

var throwTypeError = function () {
  throw new $TypeError();
};

var ThrowTypeError = $gOPD ? function () {
  try {
    // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
    arguments.callee; // IE 8 does not throw here

    return throwTypeError;
  } catch (calleeThrows) {
    try {
      // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
      return $gOPD(arguments, 'callee').get;
    } catch (gOPDthrows) {
      return throwTypeError;
    }
  }
}() : throwTypeError;

var hasSymbols = __webpack_require__(12)();

var getProto = Object.getPrototypeOf || function (x) {
  return x.__proto__;
}; // eslint-disable-line no-proto


var needsEval = {};
var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);
var INTRINSICS = {
  '%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
  '%Array%': Array,
  '%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
  '%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
  '%AsyncFromSyncIteratorPrototype%': undefined,
  '%AsyncFunction%': needsEval,
  '%AsyncGenerator%': needsEval,
  '%AsyncGeneratorFunction%': needsEval,
  '%AsyncIteratorPrototype%': needsEval,
  '%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
  '%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
  '%Boolean%': Boolean,
  '%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
  '%Date%': Date,
  '%decodeURI%': decodeURI,
  '%decodeURIComponent%': decodeURIComponent,
  '%encodeURI%': encodeURI,
  '%encodeURIComponent%': encodeURIComponent,
  '%Error%': Error,
  '%eval%': eval,
  // eslint-disable-line no-eval
  '%EvalError%': EvalError,
  '%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
  '%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
  '%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
  '%Function%': $Function,
  '%GeneratorFunction%': needsEval,
  '%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
  '%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
  '%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
  '%isFinite%': isFinite,
  '%isNaN%': isNaN,
  '%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
  '%JSON%': typeof JSON === 'object' ? JSON : undefined,
  '%Map%': typeof Map === 'undefined' ? undefined : Map,
  '%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
  '%Math%': Math,
  '%Number%': Number,
  '%Object%': Object,
  '%parseFloat%': parseFloat,
  '%parseInt%': parseInt,
  '%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
  '%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
  '%RangeError%': RangeError,
  '%ReferenceError%': ReferenceError,
  '%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
  '%RegExp%': RegExp,
  '%Set%': typeof Set === 'undefined' ? undefined : Set,
  '%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
  '%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
  '%String%': String,
  '%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
  '%Symbol%': hasSymbols ? Symbol : undefined,
  '%SyntaxError%': $SyntaxError,
  '%ThrowTypeError%': ThrowTypeError,
  '%TypedArray%': TypedArray,
  '%TypeError%': $TypeError,
  '%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
  '%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
  '%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
  '%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
  '%URIError%': URIError,
  '%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
  '%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
  '%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
  var value;

  if (name === '%AsyncFunction%') {
    value = getEvalledConstructor('async function () {}');
  } else if (name === '%GeneratorFunction%') {
    value = getEvalledConstructor('function* () {}');
  } else if (name === '%AsyncGeneratorFunction%') {
    value = getEvalledConstructor('async function* () {}');
  } else if (name === '%AsyncGenerator%') {
    var fn = doEval('%AsyncGeneratorFunction%');

    if (fn) {
      value = fn.prototype;
    }
  } else if (name === '%AsyncIteratorPrototype%') {
    var gen = doEval('%AsyncGenerator%');

    if (gen) {
      value = getProto(gen.prototype);
    }
  }

  INTRINSICS[name] = value;
  return value;
};

var LEGACY_ALIASES = {
  '%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
  '%ArrayPrototype%': ['Array', 'prototype'],
  '%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
  '%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
  '%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
  '%ArrayProto_values%': ['Array', 'prototype', 'values'],
  '%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
  '%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
  '%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
  '%BooleanPrototype%': ['Boolean', 'prototype'],
  '%DataViewPrototype%': ['DataView', 'prototype'],
  '%DatePrototype%': ['Date', 'prototype'],
  '%ErrorPrototype%': ['Error', 'prototype'],
  '%EvalErrorPrototype%': ['EvalError', 'prototype'],
  '%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
  '%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
  '%FunctionPrototype%': ['Function', 'prototype'],
  '%Generator%': ['GeneratorFunction', 'prototype'],
  '%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
  '%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
  '%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
  '%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
  '%JSONParse%': ['JSON', 'parse'],
  '%JSONStringify%': ['JSON', 'stringify'],
  '%MapPrototype%': ['Map', 'prototype'],
  '%NumberPrototype%': ['Number', 'prototype'],
  '%ObjectPrototype%': ['Object', 'prototype'],
  '%ObjProto_toString%': ['Object', 'prototype', 'toString'],
  '%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
  '%PromisePrototype%': ['Promise', 'prototype'],
  '%PromiseProto_then%': ['Promise', 'prototype', 'then'],
  '%Promise_all%': ['Promise', 'all'],
  '%Promise_reject%': ['Promise', 'reject'],
  '%Promise_resolve%': ['Promise', 'resolve'],
  '%RangeErrorPrototype%': ['RangeError', 'prototype'],
  '%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
  '%RegExpPrototype%': ['RegExp', 'prototype'],
  '%SetPrototype%': ['Set', 'prototype'],
  '%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
  '%StringPrototype%': ['String', 'prototype'],
  '%SymbolPrototype%': ['Symbol', 'prototype'],
  '%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
  '%TypedArrayPrototype%': ['TypedArray', 'prototype'],
  '%TypeErrorPrototype%': ['TypeError', 'prototype'],
  '%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
  '%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
  '%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
  '%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
  '%URIErrorPrototype%': ['URIError', 'prototype'],
  '%WeakMapPrototype%': ['WeakMap', 'prototype'],
  '%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = __webpack_require__(13);

var hasOwn = __webpack_require__(15);

var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);
/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */

var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g;
/** Used to match backslashes in property paths. */

var stringToPath = function stringToPath(string) {
  var first = $strSlice(string, 0, 1);
  var last = $strSlice(string, -1);

  if (first === '%' && last !== '%') {
    throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
  } else if (last === '%' && first !== '%') {
    throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
  }

  var result = [];
  $replace(string, rePropName, function (match, number, quote, subString) {
    result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
  });
  return result;
};
/* end adaptation */


var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
  var intrinsicName = name;
  var alias;

  if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
    alias = LEGACY_ALIASES[intrinsicName];
    intrinsicName = '%' + alias[0] + '%';
  }

  if (hasOwn(INTRINSICS, intrinsicName)) {
    var value = INTRINSICS[intrinsicName];

    if (value === needsEval) {
      value = doEval(intrinsicName);
    }

    if (typeof value === 'undefined' && !allowMissing) {
      throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
    }

    return {
      alias: alias,
      name: intrinsicName,
      value: value
    };
  }

  throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new $TypeError('intrinsic name must be a non-empty string');
  }

  if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
    throw new $TypeError('"allowMissing" argument must be a boolean');
  }

  if ($exec(/^%?[^%]*%?$/g, name) === null) {
    throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
  }

  var parts = stringToPath(name);
  var intrinsicBaseName = parts.length > 0 ? parts[0] : '';
  var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
  var intrinsicRealName = intrinsic.name;
  var value = intrinsic.value;
  var skipFurtherCaching = false;
  var alias = intrinsic.alias;

  if (alias) {
    intrinsicBaseName = alias[0];
    $spliceApply(parts, $concat([0, 1], alias));
  }

  for (var i = 1, isOwn = true; i < parts.length; i += 1) {
    var part = parts[i];
    var first = $strSlice(part, 0, 1);
    var last = $strSlice(part, -1);

    if ((first === '"' || first === "'" || first === '`' || last === '"' || last === "'" || last === '`') && first !== last) {
      throw new $SyntaxError('property names with quotes must have matching quotes');
    }

    if (part === 'constructor' || !isOwn) {
      skipFurtherCaching = true;
    }

    intrinsicBaseName += '.' + part;
    intrinsicRealName = '%' + intrinsicBaseName + '%';

    if (hasOwn(INTRINSICS, intrinsicRealName)) {
      value = INTRINSICS[intrinsicRealName];
    } else if (value != null) {
      if (!(part in value)) {
        if (!allowMissing) {
          throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
        }

        return void undefined;
      }

      if ($gOPD && i + 1 >= parts.length) {
        var desc = $gOPD(value, part);
        isOwn = !!desc; // By convention, when a data property is converted to an accessor
        // property to emulate a data property that does not suffer from
        // the override mistake, that accessor's getter is marked with
        // an `originalValue` property. Here, when we detect this, we
        // uphold the illusion by pretending to see that original data
        // property, i.e., returning the value rather than the getter
        // itself.

        if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
          value = desc.get;
        } else {
          value = value[part];
        }
      } else {
        isOwn = hasOwn(value, part);
        value = value[part];
      }

      if (isOwn && !skipFurtherCaching) {
        INTRINSICS[intrinsicRealName] = value;
      }
    }
  }

  return value;
};

/***/ }),
/* 12 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var origSymbol = typeof Symbol !== 'undefined' && Symbol;

var hasSymbolSham = __webpack_require__(9);

module.exports = function hasNativeSymbols() {
  if (typeof origSymbol !== 'function') {
    return false;
  }

  if (typeof Symbol !== 'function') {
    return false;
  }

  if (typeof origSymbol('foo') !== 'symbol') {
    return false;
  }

  if (typeof Symbol('bar') !== 'symbol') {
    return false;
  }

  return hasSymbolSham();
};

/***/ }),
/* 13 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(14);

module.exports = Function.prototype.bind || implementation;

/***/ }),
/* 14 */
/***/ ((module) => {

"use strict";

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
  var target = this;

  if (typeof target !== 'function' || toStr.call(target) !== funcType) {
    throw new TypeError(ERROR_MESSAGE + target);
  }

  var args = slice.call(arguments, 1);
  var bound;

  var binder = function () {
    if (this instanceof bound) {
      var result = target.apply(this, args.concat(slice.call(arguments)));

      if (Object(result) === result) {
        return result;
      }

      return this;
    } else {
      return target.apply(that, args.concat(slice.call(arguments)));
    }
  };

  var boundLength = Math.max(0, target.length - args.length);
  var boundArgs = [];

  for (var i = 0; i < boundLength; i++) {
    boundArgs.push('$' + i);
  }

  bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

  if (target.prototype) {
    var Empty = function Empty() {};

    Empty.prototype = target.prototype;
    bound.prototype = new Empty();
    Empty.prototype = null;
  }

  return bound;
};

/***/ }),
/* 15 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(13);

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

/***/ }),
/* 16 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(13);

var GetIntrinsic = __webpack_require__(11);

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);
var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
  try {
    $defineProperty({}, 'a', {
      value: 1
    });
  } catch (e) {
    // IE 8 has a broken defineProperty
    $defineProperty = null;
  }
}

module.exports = function callBind(originalFunction) {
  var func = $reflectApply(bind, $call, arguments);

  if ($gOPD && $defineProperty) {
    var desc = $gOPD(func, 'length');

    if (desc.configurable) {
      // original length, plus the receiver, minus any additional arguments (after the receiver)
      $defineProperty(func, 'length', {
        value: 1 + $max(0, originalFunction.length - (arguments.length - 1))
      });
    }
  }

  return func;
};

var applyBind = function applyBind() {
  return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
  $defineProperty(module.exports, 'apply', {
    value: applyBind
  });
} else {
  module.exports.apply = applyBind;
}

/***/ }),
/* 17 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;

var hasToStringTag = __webpack_require__(8)();

var getProto = Object.getPrototypeOf;

var getGeneratorFunc = function () {
  // eslint-disable-line consistent-return
  if (!hasToStringTag) {
    return false;
  }

  try {
    return Function('return function*() {}')();
  } catch (e) {}
};

var GeneratorFunction;

module.exports = function isGeneratorFunction(fn) {
  if (typeof fn !== 'function') {
    return false;
  }

  if (isFnRegex.test(fnToStr.call(fn))) {
    return true;
  }

  if (!hasToStringTag) {
    var str = toStr.call(fn);
    return str === '[object GeneratorFunction]';
  }

  if (!getProto) {
    return false;
  }

  if (typeof GeneratorFunction === 'undefined') {
    var generatorFunc = getGeneratorFunc();
    GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
  }

  return getProto(fn) === GeneratorFunction;
};

/***/ }),
/* 18 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var forEach = __webpack_require__(19);

var availableTypedArrays = __webpack_require__(21);

var callBound = __webpack_require__(10);

var $toString = callBound('Object.prototype.toString');

var hasToStringTag = __webpack_require__(8)();

var g = typeof globalThis === 'undefined' ? __webpack_require__.g : globalThis;
var typedArrays = availableTypedArrays();
var $slice = callBound('String.prototype.slice');
var toStrTags = {};

var gOPD = __webpack_require__(22);

var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');

if (hasToStringTag && gOPD && getPrototypeOf) {
  forEach(typedArrays, function (typedArray) {
    if (typeof g[typedArray] === 'function') {
      var arr = new g[typedArray]();

      if (Symbol.toStringTag in arr) {
        var proto = getPrototypeOf(arr);
        var descriptor = gOPD(proto, Symbol.toStringTag);

        if (!descriptor) {
          var superProto = getPrototypeOf(proto);
          descriptor = gOPD(superProto, Symbol.toStringTag);
        }

        toStrTags[typedArray] = descriptor.get;
      }
    }
  });
}

var tryTypedArrays = function tryAllTypedArrays(value) {
  var foundName = false;
  forEach(toStrTags, function (getter, typedArray) {
    if (!foundName) {
      try {
        var name = getter.call(value);

        if (name === typedArray) {
          foundName = name;
        }
      } catch (e) {}
    }
  });
  return foundName;
};

var isTypedArray = __webpack_require__(23);

module.exports = function whichTypedArray(value) {
  if (!isTypedArray(value)) {
    return false;
  }

  if (!hasToStringTag || !(Symbol.toStringTag in value)) {
    return $slice($toString(value), 8, -1);
  }

  return tryTypedArrays(value);
};

/***/ }),
/* 19 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isCallable = __webpack_require__(20);

var toStr = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

var forEachArray = function forEachArray(array, iterator, receiver) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (hasOwnProperty.call(array, i)) {
      if (receiver == null) {
        iterator(array[i], i, array);
      } else {
        iterator.call(receiver, array[i], i, array);
      }
    }
  }
};

var forEachString = function forEachString(string, iterator, receiver) {
  for (var i = 0, len = string.length; i < len; i++) {
    // no such thing as a sparse string.
    if (receiver == null) {
      iterator(string.charAt(i), i, string);
    } else {
      iterator.call(receiver, string.charAt(i), i, string);
    }
  }
};

var forEachObject = function forEachObject(object, iterator, receiver) {
  for (var k in object) {
    if (hasOwnProperty.call(object, k)) {
      if (receiver == null) {
        iterator(object[k], k, object);
      } else {
        iterator.call(receiver, object[k], k, object);
      }
    }
  }
};

var forEach = function forEach(list, iterator, thisArg) {
  if (!isCallable(iterator)) {
    throw new TypeError('iterator must be a function');
  }

  var receiver;

  if (arguments.length >= 3) {
    receiver = thisArg;
  }

  if (toStr.call(list) === '[object Array]') {
    forEachArray(list, iterator, receiver);
  } else if (typeof list === 'string') {
    forEachString(list, iterator, receiver);
  } else {
    forEachObject(list, iterator, receiver);
  }
};

module.exports = forEach;

/***/ }),
/* 20 */
/***/ ((module) => {

"use strict";


var fnToStr = Function.prototype.toString;
var reflectApply = typeof Reflect === 'object' && Reflect !== null && Reflect.apply;
var badArrayLike;
var isCallableMarker;

if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
  try {
    badArrayLike = Object.defineProperty({}, 'length', {
      get: function () {
        throw isCallableMarker;
      }
    });
    isCallableMarker = {}; // eslint-disable-next-line no-throw-literal

    reflectApply(function () {
      throw 42;
    }, null, badArrayLike);
  } catch (_) {
    if (_ !== isCallableMarker) {
      reflectApply = null;
    }
  }
} else {
  reflectApply = null;
}

var constructorRegex = /^\s*class\b/;

var isES6ClassFn = function isES6ClassFunction(value) {
  try {
    var fnStr = fnToStr.call(value);
    return constructorRegex.test(fnStr);
  } catch (e) {
    return false; // not a function
  }
};

var tryFunctionObject = function tryFunctionToStr(value) {
  try {
    if (isES6ClassFn(value)) {
      return false;
    }

    fnToStr.call(value);
    return true;
  } catch (e) {
    return false;
  }
};

var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && !!Symbol.toStringTag; // better: use `has-tostringtag`

/* globals document: false */

var documentDotAll = typeof document === 'object' && typeof document.all === 'undefined' && document.all !== undefined ? document.all : {};
module.exports = reflectApply ? function isCallable(value) {
  if (value === documentDotAll) {
    return true;
  }

  if (!value) {
    return false;
  }

  if (typeof value !== 'function' && typeof value !== 'object') {
    return false;
  }

  if (typeof value === 'function' && !value.prototype) {
    return true;
  }

  try {
    reflectApply(value, null, badArrayLike);
  } catch (e) {
    if (e !== isCallableMarker) {
      return false;
    }
  }

  return !isES6ClassFn(value);
} : function isCallable(value) {
  if (value === documentDotAll) {
    return true;
  }

  if (!value) {
    return false;
  }

  if (typeof value !== 'function' && typeof value !== 'object') {
    return false;
  }

  if (typeof value === 'function' && !value.prototype) {
    return true;
  }

  if (hasToStringTag) {
    return tryFunctionObject(value);
  }

  if (isES6ClassFn(value)) {
    return false;
  }

  var strClass = toStr.call(value);
  return strClass === fnClass || strClass === genClass;
};

/***/ }),
/* 21 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var possibleNames = ['BigInt64Array', 'BigUint64Array', 'Float32Array', 'Float64Array', 'Int16Array', 'Int32Array', 'Int8Array', 'Uint16Array', 'Uint32Array', 'Uint8Array', 'Uint8ClampedArray'];
var g = typeof globalThis === 'undefined' ? __webpack_require__.g : globalThis;

module.exports = function availableTypedArrays() {
  var out = [];

  for (var i = 0; i < possibleNames.length; i++) {
    if (typeof g[possibleNames[i]] === 'function') {
      out[out.length] = possibleNames[i];
    }
  }

  return out;
};

/***/ }),
/* 22 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(11);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);

if ($gOPD) {
  try {
    $gOPD([], 'length');
  } catch (e) {
    // IE 8 has a broken gOPD
    $gOPD = null;
  }
}

module.exports = $gOPD;

/***/ }),
/* 23 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var forEach = __webpack_require__(19);

var availableTypedArrays = __webpack_require__(21);

var callBound = __webpack_require__(10);

var $toString = callBound('Object.prototype.toString');

var hasToStringTag = __webpack_require__(8)();

var g = typeof globalThis === 'undefined' ? __webpack_require__.g : globalThis;
var typedArrays = availableTypedArrays();

var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i] === value) {
      return i;
    }
  }

  return -1;
};

var $slice = callBound('String.prototype.slice');
var toStrTags = {};

var gOPD = __webpack_require__(22);

var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');

if (hasToStringTag && gOPD && getPrototypeOf) {
  forEach(typedArrays, function (typedArray) {
    var arr = new g[typedArray]();

    if (Symbol.toStringTag in arr) {
      var proto = getPrototypeOf(arr);
      var descriptor = gOPD(proto, Symbol.toStringTag);

      if (!descriptor) {
        var superProto = getPrototypeOf(proto);
        descriptor = gOPD(superProto, Symbol.toStringTag);
      }

      toStrTags[typedArray] = descriptor.get;
    }
  });
}

var tryTypedArrays = function tryAllTypedArrays(value) {
  var anyTrue = false;
  forEach(toStrTags, function (getter, typedArray) {
    if (!anyTrue) {
      try {
        anyTrue = getter.call(value) === typedArray;
      } catch (e) {
        /**/
      }
    }
  });
  return anyTrue;
};

module.exports = function isTypedArray(value) {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if (!hasToStringTag || !(Symbol.toStringTag in value)) {
    var tag = $slice($toString(value), 8, -1);
    return $indexOf(typedArrays, tag) > -1;
  }

  if (!gOPD) {
    return false;
  }

  return tryTypedArrays(value);
};

/***/ }),
/* 24 */
/***/ ((module) => {

"use strict";


module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
};

/***/ }),
/* 25 */
/***/ ((module) => {

"use strict";


if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;

      var TempCtor = function () {};

      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}

/***/ }),
/* 26 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(4);
// Currently in sync with Node.js lib/internal/assert/assertion_error.js
// https://github.com/nodejs/node/commit/0817840f775032169ddd70c85ac059f18ffcc81c


function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var _require = __webpack_require__(3),
    inspect = _require.inspect;

var _require2 = __webpack_require__(2),
    ERR_INVALID_ARG_TYPE = _require2.codes.ERR_INVALID_ARG_TYPE; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat


function repeat(str, count) {
  count = Math.floor(count);
  if (str.length == 0 || count == 0) return '';
  var maxCount = str.length * count;
  count = Math.floor(Math.log(count) / Math.log(2));

  while (count) {
    str += str;
    count--;
  }

  str += str.substring(0, maxCount - str.length);
  return str;
}

var blue = '';
var green = '';
var red = '';
var white = '';
var kReadableOperator = {
  deepStrictEqual: 'Expected values to be strictly deep-equal:',
  strictEqual: 'Expected values to be strictly equal:',
  strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
  deepEqual: 'Expected values to be loosely deep-equal:',
  equal: 'Expected values to be loosely equal:',
  notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
  notStrictEqual: 'Expected "actual" to be strictly unequal to:',
  notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
  notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
  notEqual: 'Expected "actual" to be loosely unequal to:',
  notIdentical: 'Values identical but not reference-equal:'
}; // Comparing short primitives should just show === / !== instead of using the
// diff.

var kMaxShortLength = 10;

function copyError(source) {
  var keys = Object.keys(source);
  var target = Object.create(Object.getPrototypeOf(source));
  keys.forEach(function (key) {
    target[key] = source[key];
  });
  Object.defineProperty(target, 'message', {
    value: source.message
  });
  return target;
}

function inspectValue(val) {
  // The util.inspect default values could be changed. This makes sure the
  // error messages contain the necessary information nevertheless.
  return inspect(val, {
    compact: false,
    customInspect: false,
    depth: 1000,
    maxArrayLength: Infinity,
    // Assert compares only enumerable properties (with a few exceptions).
    showHidden: false,
    // Having a long line as error is better than wrapping the line for
    // comparison for now.
    // TODO(BridgeAR): `breakLength` should be limited as soon as soon as we
    // have meta information about the inspected properties (i.e., know where
    // in what line the property starts and ends).
    breakLength: Infinity,
    // Assert does not detect proxies currently.
    showProxy: false,
    sorted: true,
    // Inspect getters as we also check them when comparing entries.
    getters: true
  });
}

function createErrDiff(actual, expected, operator) {
  var other = '';
  var res = '';
  var lastPos = 0;
  var end = '';
  var skipped = false;
  var actualInspected = inspectValue(actual);
  var actualLines = actualInspected.split('\n');
  var expectedLines = inspectValue(expected).split('\n');
  var i = 0;
  var indicator = ''; // In case both values are objects explicitly mark them as not reference equal
  // for the `strictEqual` operator.

  if (operator === 'strictEqual' && _typeof(actual) === 'object' && _typeof(expected) === 'object' && actual !== null && expected !== null) {
    operator = 'strictEqualObject';
  } // If "actual" and "expected" fit on a single line and they are not strictly
  // equal, check further special handling.


  if (actualLines.length === 1 && expectedLines.length === 1 && actualLines[0] !== expectedLines[0]) {
    var inputLength = actualLines[0].length + expectedLines[0].length; // If the character length of "actual" and "expected" together is less than
    // kMaxShortLength and if neither is an object and at least one of them is
    // not `zero`, use the strict equal comparison to visualize the output.

    if (inputLength <= kMaxShortLength) {
      if ((_typeof(actual) !== 'object' || actual === null) && (_typeof(expected) !== 'object' || expected === null) && (actual !== 0 || expected !== 0)) {
        // -0 === +0
        return "".concat(kReadableOperator[operator], "\n\n") + "".concat(actualLines[0], " !== ").concat(expectedLines[0], "\n");
      }
    } else if (operator !== 'strictEqualObject') {
      // If the stderr is a tty and the input length is lower than the current
      // columns per line, add a mismatch indicator below the output. If it is
      // not a tty, use a default value of 80 characters.
      var maxLength = process.stderr && process.stderr.isTTY ? process.stderr.columns : 80;

      if (inputLength < maxLength) {
        while (actualLines[0][i] === expectedLines[0][i]) {
          i++;
        } // Ignore the first characters.


        if (i > 2) {
          // Add position indicator for the first mismatch in case it is a
          // single line and the input length is less than the column length.
          indicator = "\n  ".concat(repeat(' ', i), "^");
          i = 0;
        }
      }
    }
  } // Remove all ending lines that match (this optimizes the output for
  // readability by reducing the number of total changed lines).


  var a = actualLines[actualLines.length - 1];
  var b = expectedLines[expectedLines.length - 1];

  while (a === b) {
    if (i++ < 2) {
      end = "\n  ".concat(a).concat(end);
    } else {
      other = a;
    }

    actualLines.pop();
    expectedLines.pop();
    if (actualLines.length === 0 || expectedLines.length === 0) break;
    a = actualLines[actualLines.length - 1];
    b = expectedLines[expectedLines.length - 1];
  }

  var maxLines = Math.max(actualLines.length, expectedLines.length); // Strict equal with identical objects that are not identical by reference.
  // E.g., assert.deepStrictEqual({ a: Symbol() }, { a: Symbol() })

  if (maxLines === 0) {
    // We have to get the result again. The lines were all removed before.
    var _actualLines = actualInspected.split('\n'); // Only remove lines in case it makes sense to collapse those.
    // TODO: Accept env to always show the full error.


    if (_actualLines.length > 30) {
      _actualLines[26] = "".concat(blue, "...").concat(white);

      while (_actualLines.length > 27) {
        _actualLines.pop();
      }
    }

    return "".concat(kReadableOperator.notIdentical, "\n\n").concat(_actualLines.join('\n'), "\n");
  }

  if (i > 3) {
    end = "\n".concat(blue, "...").concat(white).concat(end);
    skipped = true;
  }

  if (other !== '') {
    end = "\n  ".concat(other).concat(end);
    other = '';
  }

  var printedLines = 0;
  var msg = kReadableOperator[operator] + "\n".concat(green, "+ actual").concat(white, " ").concat(red, "- expected").concat(white);
  var skippedMsg = " ".concat(blue, "...").concat(white, " Lines skipped");

  for (i = 0; i < maxLines; i++) {
    // Only extra expected lines exist
    var cur = i - lastPos;

    if (actualLines.length < i + 1) {
      // If the last diverging line is more than one line above and the
      // current line is at least line three, add some of the former lines and
      // also add dots to indicate skipped entries.
      if (cur > 1 && i > 2) {
        if (cur > 4) {
          res += "\n".concat(blue, "...").concat(white);
          skipped = true;
        } else if (cur > 3) {
          res += "\n  ".concat(expectedLines[i - 2]);
          printedLines++;
        }

        res += "\n  ".concat(expectedLines[i - 1]);
        printedLines++;
      } // Mark the current line as the last diverging one.


      lastPos = i; // Add the expected line to the cache.

      other += "\n".concat(red, "-").concat(white, " ").concat(expectedLines[i]);
      printedLines++; // Only extra actual lines exist
    } else if (expectedLines.length < i + 1) {
      // If the last diverging line is more than one line above and the
      // current line is at least line three, add some of the former lines and
      // also add dots to indicate skipped entries.
      if (cur > 1 && i > 2) {
        if (cur > 4) {
          res += "\n".concat(blue, "...").concat(white);
          skipped = true;
        } else if (cur > 3) {
          res += "\n  ".concat(actualLines[i - 2]);
          printedLines++;
        }

        res += "\n  ".concat(actualLines[i - 1]);
        printedLines++;
      } // Mark the current line as the last diverging one.


      lastPos = i; // Add the actual line to the result.

      res += "\n".concat(green, "+").concat(white, " ").concat(actualLines[i]);
      printedLines++; // Lines diverge
    } else {
      var expectedLine = expectedLines[i];
      var actualLine = actualLines[i]; // If the lines diverge, specifically check for lines that only diverge by
      // a trailing comma. In that case it is actually identical and we should
      // mark it as such.

      var divergingLines = actualLine !== expectedLine && (!endsWith(actualLine, ',') || actualLine.slice(0, -1) !== expectedLine); // If the expected line has a trailing comma but is otherwise identical,
      // add a comma at the end of the actual line. Otherwise the output could
      // look weird as in:
      //
      //   [
      //     1         // No comma at the end!
      // +   2
      //   ]
      //

      if (divergingLines && endsWith(expectedLine, ',') && expectedLine.slice(0, -1) === actualLine) {
        divergingLines = false;
        actualLine += ',';
      }

      if (divergingLines) {
        // If the last diverging line is more than one line above and the
        // current line is at least line three, add some of the former lines and
        // also add dots to indicate skipped entries.
        if (cur > 1 && i > 2) {
          if (cur > 4) {
            res += "\n".concat(blue, "...").concat(white);
            skipped = true;
          } else if (cur > 3) {
            res += "\n  ".concat(actualLines[i - 2]);
            printedLines++;
          }

          res += "\n  ".concat(actualLines[i - 1]);
          printedLines++;
        } // Mark the current line as the last diverging one.


        lastPos = i; // Add the actual line to the result and cache the expected diverging
        // line so consecutive diverging lines show up as +++--- and not +-+-+-.

        res += "\n".concat(green, "+").concat(white, " ").concat(actualLine);
        other += "\n".concat(red, "-").concat(white, " ").concat(expectedLine);
        printedLines += 2; // Lines are identical
      } else {
        // Add all cached information to the result before adding other things
        // and reset the cache.
        res += other;
        other = ''; // If the last diverging line is exactly one line above or if it is the
        // very first line, add the line to the result.

        if (cur === 1 || i === 0) {
          res += "\n  ".concat(actualLine);
          printedLines++;
        }
      }
    } // Inspected object to big (Show ~20 rows max)


    if (printedLines > 20 && i < maxLines - 2) {
      return "".concat(msg).concat(skippedMsg, "\n").concat(res, "\n").concat(blue, "...").concat(white).concat(other, "\n") + "".concat(blue, "...").concat(white);
    }
  }

  return "".concat(msg).concat(skipped ? skippedMsg : '', "\n").concat(res).concat(other).concat(end).concat(indicator);
}

var AssertionError = /*#__PURE__*/function (_Error) {
  _inherits(AssertionError, _Error);

  function AssertionError(options) {
    var _this;

    _classCallCheck(this, AssertionError);

    if (_typeof(options) !== 'object' || options === null) {
      throw new ERR_INVALID_ARG_TYPE('options', 'Object', options);
    }

    var message = options.message,
        operator = options.operator,
        stackStartFn = options.stackStartFn;
    var actual = options.actual,
        expected = options.expected;
    var limit = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;

    if (message != null) {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, String(message)));
    } else {
      if (process.stderr && process.stderr.isTTY) {
        // Reset on each call to make sure we handle dynamically set environment
        // variables correct.
        if (process.stderr && process.stderr.getColorDepth && process.stderr.getColorDepth() !== 1) {
          blue = "\x1B[34m";
          green = "\x1B[32m";
          white = "\x1B[39m";
          red = "\x1B[31m";
        } else {
          blue = '';
          green = '';
          white = '';
          red = '';
        }
      } // Prevent the error stack from being visible by duplicating the error
      // in a very close way to the original in case both sides are actually
      // instances of Error.


      if (_typeof(actual) === 'object' && actual !== null && _typeof(expected) === 'object' && expected !== null && 'stack' in actual && actual instanceof Error && 'stack' in expected && expected instanceof Error) {
        actual = copyError(actual);
        expected = copyError(expected);
      }

      if (operator === 'deepStrictEqual' || operator === 'strictEqual') {
        _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, createErrDiff(actual, expected, operator)));
      } else if (operator === 'notDeepStrictEqual' || operator === 'notStrictEqual') {
        // In case the objects are equal but the operator requires unequal, show
        // the first object and say A equals B
        var base = kReadableOperator[operator];
        var res = inspectValue(actual).split('\n'); // In case "actual" is an object, it should not be reference equal.

        if (operator === 'notStrictEqual' && _typeof(actual) === 'object' && actual !== null) {
          base = kReadableOperator.notStrictEqualObject;
        } // Only remove lines in case it makes sense to collapse those.
        // TODO: Accept env to always show the full error.


        if (res.length > 30) {
          res[26] = "".concat(blue, "...").concat(white);

          while (res.length > 27) {
            res.pop();
          }
        } // Only print a single input.


        if (res.length === 1) {
          _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, "".concat(base, " ").concat(res[0])));
        } else {
          _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, "".concat(base, "\n\n").concat(res.join('\n'), "\n")));
        }
      } else {
        var _res = inspectValue(actual);

        var other = '';
        var knownOperators = kReadableOperator[operator];

        if (operator === 'notDeepEqual' || operator === 'notEqual') {
          _res = "".concat(kReadableOperator[operator], "\n\n").concat(_res);

          if (_res.length > 1024) {
            _res = "".concat(_res.slice(0, 1021), "...");
          }
        } else {
          other = "".concat(inspectValue(expected));

          if (_res.length > 512) {
            _res = "".concat(_res.slice(0, 509), "...");
          }

          if (other.length > 512) {
            other = "".concat(other.slice(0, 509), "...");
          }

          if (operator === 'deepEqual' || operator === 'equal') {
            _res = "".concat(knownOperators, "\n\n").concat(_res, "\n\nshould equal\n\n");
          } else {
            other = " ".concat(operator, " ").concat(other);
          }
        }

        _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, "".concat(_res).concat(other)));
      }
    }

    Error.stackTraceLimit = limit;
    _this.generatedMessage = !message;
    Object.defineProperty(_assertThisInitialized(_this), 'name', {
      value: 'AssertionError [ERR_ASSERTION]',
      enumerable: false,
      writable: true,
      configurable: true
    });
    _this.code = 'ERR_ASSERTION';
    _this.actual = actual;
    _this.expected = expected;
    _this.operator = operator;

    if (Error.captureStackTrace) {
      // eslint-disable-next-line no-restricted-syntax
      Error.captureStackTrace(_assertThisInitialized(_this), stackStartFn);
    } // Create error message including the error code in the name.


    _this.stack; // Reset the name.

    _this.name = 'AssertionError';
    return _possibleConstructorReturn(_this);
  }

  _createClass(AssertionError, [{
    key: "toString",
    value: function toString() {
      return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
    }
  }, {
    key: inspect.custom,
    value: function value(recurseTimes, ctx) {
      // This limits the `actual` and `expected` property default inspection to
      // the minimum depth. Otherwise those values would be too verbose compared
      // to the actual error message which contains a combined view of these two
      // input values.
      return inspect(this, _objectSpread({}, ctx, {
        customInspect: false,
        depth: 0
      }));
    }
  }]);

  return AssertionError;
}(_wrapNativeSuper(Error));

module.exports = AssertionError;

/***/ }),
/* 27 */
/***/ ((module) => {

"use strict";
/**
 * Code refactored from Mozilla Developer Network:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */


function assign(target, firstSource) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert first argument to object');
  }

  var to = Object(target);

  for (var i = 1; i < arguments.length; i++) {
    var nextSource = arguments[i];

    if (nextSource === undefined || nextSource === null) {
      continue;
    }

    var keysArray = Object.keys(Object(nextSource));

    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      var nextKey = keysArray[nextIndex];
      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

      if (desc !== undefined && desc.enumerable) {
        to[nextKey] = nextSource[nextKey];
      }
    }
  }

  return to;
}

function polyfill() {
  if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: assign
    });
  }
}

module.exports = {
  assign: assign,
  polyfill: polyfill
};

/***/ }),
/* 28 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var define = __webpack_require__(29);

var callBind = __webpack_require__(16);

var implementation = __webpack_require__(34);

var getPolyfill = __webpack_require__(35);

var shim = __webpack_require__(36);

var polyfill = callBind(getPolyfill(), Object);
define(polyfill, {
  getPolyfill: getPolyfill,
  implementation: implementation,
  shim: shim
});
module.exports = polyfill;

/***/ }),
/* 29 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var keys = __webpack_require__(30);

var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';
var toStr = Object.prototype.toString;
var concat = Array.prototype.concat;
var origDefineProperty = Object.defineProperty;

var isFunction = function (fn) {
  return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var hasPropertyDescriptors = __webpack_require__(33)();

var supportsDescriptors = origDefineProperty && hasPropertyDescriptors;

var defineProperty = function (object, name, value, predicate) {
  if (name in object && (!isFunction(predicate) || !predicate())) {
    return;
  }

  if (supportsDescriptors) {
    origDefineProperty(object, name, {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    });
  } else {
    object[name] = value; // eslint-disable-line no-param-reassign
  }
};

var defineProperties = function (object, map) {
  var predicates = arguments.length > 2 ? arguments[2] : {};
  var props = keys(map);

  if (hasSymbols) {
    props = concat.call(props, Object.getOwnPropertySymbols(map));
  }

  for (var i = 0; i < props.length; i += 1) {
    defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
  }
};

defineProperties.supportsDescriptors = !!supportsDescriptors;
module.exports = defineProperties;

/***/ }),
/* 30 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var slice = Array.prototype.slice;

var isArgs = __webpack_require__(31);

var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) {
  return origKeys(o);
} : __webpack_require__(32);
var originalKeys = Object.keys;

keysShim.shim = function shimObjectKeys() {
  if (Object.keys) {
    var keysWorksWithArguments = function () {
      // Safari 5.0 bug
      var args = Object.keys(arguments);
      return args && args.length === arguments.length;
    }(1, 2);

    if (!keysWorksWithArguments) {
      Object.keys = function keys(object) {
        // eslint-disable-line func-name-matching
        if (isArgs(object)) {
          return originalKeys(slice.call(object));
        }

        return originalKeys(object);
      };
    }
  } else {
    Object.keys = keysShim;
  }

  return Object.keys || keysShim;
};

module.exports = keysShim;

/***/ }),
/* 31 */
/***/ ((module) => {

"use strict";


var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
  var str = toStr.call(value);
  var isArgs = str === '[object Arguments]';

  if (!isArgs) {
    isArgs = str !== '[object Array]' && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
  }

  return isArgs;
};

/***/ }),
/* 32 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var keysShim;

if (!Object.keys) {
  // modified from https://github.com/es-shims/es5-shim
  var has = Object.prototype.hasOwnProperty;
  var toStr = Object.prototype.toString;

  var isArgs = __webpack_require__(31); // eslint-disable-line global-require


  var isEnumerable = Object.prototype.propertyIsEnumerable;
  var hasDontEnumBug = !isEnumerable.call({
    toString: null
  }, 'toString');
  var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
  var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];

  var equalsConstructorPrototype = function (o) {
    var ctor = o.constructor;
    return ctor && ctor.prototype === o;
  };

  var excludedKeys = {
    $applicationCache: true,
    $console: true,
    $external: true,
    $frame: true,
    $frameElement: true,
    $frames: true,
    $innerHeight: true,
    $innerWidth: true,
    $onmozfullscreenchange: true,
    $onmozfullscreenerror: true,
    $outerHeight: true,
    $outerWidth: true,
    $pageXOffset: true,
    $pageYOffset: true,
    $parent: true,
    $scrollLeft: true,
    $scrollTop: true,
    $scrollX: true,
    $scrollY: true,
    $self: true,
    $webkitIndexedDB: true,
    $webkitStorageInfo: true,
    $window: true
  };

  var hasAutomationEqualityBug = function () {
    /* global window */
    if (typeof window === 'undefined') {
      return false;
    }

    for (var k in window) {
      try {
        if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
          try {
            equalsConstructorPrototype(window[k]);
          } catch (e) {
            return true;
          }
        }
      } catch (e) {
        return true;
      }
    }

    return false;
  }();

  var equalsConstructorPrototypeIfNotBuggy = function (o) {
    /* global window */
    if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
      return equalsConstructorPrototype(o);
    }

    try {
      return equalsConstructorPrototype(o);
    } catch (e) {
      return false;
    }
  };

  keysShim = function keys(object) {
    var isObject = object !== null && typeof object === 'object';
    var isFunction = toStr.call(object) === '[object Function]';
    var isArguments = isArgs(object);
    var isString = isObject && toStr.call(object) === '[object String]';
    var theKeys = [];

    if (!isObject && !isFunction && !isArguments) {
      throw new TypeError('Object.keys called on a non-object');
    }

    var skipProto = hasProtoEnumBug && isFunction;

    if (isString && object.length > 0 && !has.call(object, 0)) {
      for (var i = 0; i < object.length; ++i) {
        theKeys.push(String(i));
      }
    }

    if (isArguments && object.length > 0) {
      for (var j = 0; j < object.length; ++j) {
        theKeys.push(String(j));
      }
    } else {
      for (var name in object) {
        if (!(skipProto && name === 'prototype') && has.call(object, name)) {
          theKeys.push(String(name));
        }
      }
    }

    if (hasDontEnumBug) {
      var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

      for (var k = 0; k < dontEnums.length; ++k) {
        if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
          theKeys.push(dontEnums[k]);
        }
      }
    }

    return theKeys;
  };
}

module.exports = keysShim;

/***/ }),
/* 33 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(11);

var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);

var hasPropertyDescriptors = function hasPropertyDescriptors() {
  if ($defineProperty) {
    try {
      $defineProperty({}, 'a', {
        value: 1
      });
      return true;
    } catch (e) {
      // IE 8 has a broken defineProperty
      return false;
    }
  }

  return false;
};

hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
  // node v0.6 has a bug where array lengths can be Set but not Defined
  if (!hasPropertyDescriptors()) {
    return null;
  }

  try {
    return $defineProperty([], 'length', {
      value: 1
    }).length !== 1;
  } catch (e) {
    // In Firefox 4-22, defining length on an array throws an exception.
    return true;
  }
};

module.exports = hasPropertyDescriptors;

/***/ }),
/* 34 */
/***/ ((module) => {

"use strict";


var numberIsNaN = function (value) {
  return value !== value;
};

module.exports = function is(a, b) {
  if (a === 0 && b === 0) {
    return 1 / a === 1 / b;
  }

  if (a === b) {
    return true;
  }

  if (numberIsNaN(a) && numberIsNaN(b)) {
    return true;
  }

  return false;
};

/***/ }),
/* 35 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(34);

module.exports = function getPolyfill() {
  return typeof Object.is === 'function' ? Object.is : implementation;
};

/***/ }),
/* 36 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var getPolyfill = __webpack_require__(35);

var define = __webpack_require__(29);

module.exports = function shimObjectIs() {
  var polyfill = getPolyfill();
  define(Object, {
    is: polyfill
  }, {
    is: function testObjectIs() {
      return Object.is !== polyfill;
    }
  });
  return polyfill;
};

/***/ }),
/* 37 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Currently in sync with Node.js lib/internal/util/comparisons.js
// https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9


function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var regexFlagsSupported = /a/g.flags !== undefined;

var arrayFromSet = function arrayFromSet(set) {
  var array = [];
  set.forEach(function (value) {
    return array.push(value);
  });
  return array;
};

var arrayFromMap = function arrayFromMap(map) {
  var array = [];
  map.forEach(function (value, key) {
    return array.push([key, value]);
  });
  return array;
};

var objectIs = Object.is ? Object.is : __webpack_require__(28);
var objectGetOwnPropertySymbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function () {
  return [];
};
var numberIsNaN = Number.isNaN ? Number.isNaN : __webpack_require__(38);

function uncurryThis(f) {
  return f.call.bind(f);
}

var hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
var propertyIsEnumerable = uncurryThis(Object.prototype.propertyIsEnumerable);
var objectToString = uncurryThis(Object.prototype.toString);

var _require$types = (__webpack_require__(3).types),
    isAnyArrayBuffer = _require$types.isAnyArrayBuffer,
    isArrayBufferView = _require$types.isArrayBufferView,
    isDate = _require$types.isDate,
    isMap = _require$types.isMap,
    isRegExp = _require$types.isRegExp,
    isSet = _require$types.isSet,
    isNativeError = _require$types.isNativeError,
    isBoxedPrimitive = _require$types.isBoxedPrimitive,
    isNumberObject = _require$types.isNumberObject,
    isStringObject = _require$types.isStringObject,
    isBooleanObject = _require$types.isBooleanObject,
    isBigIntObject = _require$types.isBigIntObject,
    isSymbolObject = _require$types.isSymbolObject,
    isFloat32Array = _require$types.isFloat32Array,
    isFloat64Array = _require$types.isFloat64Array;

function isNonIndex(key) {
  if (key.length === 0 || key.length > 10) return true;

  for (var i = 0; i < key.length; i++) {
    var code = key.charCodeAt(i);
    if (code < 48 || code > 57) return true;
  } // The maximum size for an array is 2 ** 32 -1.


  return key.length === 10 && key >= Math.pow(2, 32);
}

function getOwnNonIndexProperties(value) {
  return Object.keys(value).filter(isNonIndex).concat(objectGetOwnPropertySymbols(value).filter(Object.prototype.propertyIsEnumerable.bind(value)));
} // Taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */


function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }

  if (y < x) {
    return 1;
  }

  return 0;
}

var ONLY_ENUMERABLE = undefined;
var kStrict = true;
var kLoose = false;
var kNoIterator = 0;
var kIsArray = 1;
var kIsSet = 2;
var kIsMap = 3; // Check if they have the same source and flags

function areSimilarRegExps(a, b) {
  return regexFlagsSupported ? a.source === b.source && a.flags === b.flags : RegExp.prototype.toString.call(a) === RegExp.prototype.toString.call(b);
}

function areSimilarFloatArrays(a, b) {
  if (a.byteLength !== b.byteLength) {
    return false;
  }

  for (var offset = 0; offset < a.byteLength; offset++) {
    if (a[offset] !== b[offset]) {
      return false;
    }
  }

  return true;
}

function areSimilarTypedArrays(a, b) {
  if (a.byteLength !== b.byteLength) {
    return false;
  }

  return compare(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), new Uint8Array(b.buffer, b.byteOffset, b.byteLength)) === 0;
}

function areEqualArrayBuffers(buf1, buf2) {
  return buf1.byteLength === buf2.byteLength && compare(new Uint8Array(buf1), new Uint8Array(buf2)) === 0;
}

function isEqualBoxedPrimitive(val1, val2) {
  if (isNumberObject(val1)) {
    return isNumberObject(val2) && objectIs(Number.prototype.valueOf.call(val1), Number.prototype.valueOf.call(val2));
  }

  if (isStringObject(val1)) {
    return isStringObject(val2) && String.prototype.valueOf.call(val1) === String.prototype.valueOf.call(val2);
  }

  if (isBooleanObject(val1)) {
    return isBooleanObject(val2) && Boolean.prototype.valueOf.call(val1) === Boolean.prototype.valueOf.call(val2);
  }

  if (isBigIntObject(val1)) {
    return isBigIntObject(val2) && BigInt.prototype.valueOf.call(val1) === BigInt.prototype.valueOf.call(val2);
  }

  return isSymbolObject(val2) && Symbol.prototype.valueOf.call(val1) === Symbol.prototype.valueOf.call(val2);
} // Notes: Type tags are historical [[Class]] properties that can be set by
// FunctionTemplate::SetClassName() in C++ or Symbol.toStringTag in JS
// and retrieved using Object.prototype.toString.call(obj) in JS
// See https://tc39.github.io/ecma262/#sec-object.prototype.tostring
// for a list of tags pre-defined in the spec.
// There are some unspecified tags in the wild too (e.g. typed array tags).
// Since tags can be altered, they only serve fast failures
//
// Typed arrays and buffers are checked by comparing the content in their
// underlying ArrayBuffer. This optimization requires that it's
// reasonable to interpret their underlying memory in the same way,
// which is checked by comparing their type tags.
// (e.g. a Uint8Array and a Uint16Array with the same memory content
// could still be different because they will be interpreted differently).
//
// For strict comparison, objects should have
// a) The same built-in type tags
// b) The same prototypes.


function innerDeepEqual(val1, val2, strict, memos) {
  // All identical values are equivalent, as determined by ===.
  if (val1 === val2) {
    if (val1 !== 0) return true;
    return strict ? objectIs(val1, val2) : true;
  } // Check more closely if val1 and val2 are equal.


  if (strict) {
    if (_typeof(val1) !== 'object') {
      return typeof val1 === 'number' && numberIsNaN(val1) && numberIsNaN(val2);
    }

    if (_typeof(val2) !== 'object' || val1 === null || val2 === null) {
      return false;
    }

    if (Object.getPrototypeOf(val1) !== Object.getPrototypeOf(val2)) {
      return false;
    }
  } else {
    if (val1 === null || _typeof(val1) !== 'object') {
      if (val2 === null || _typeof(val2) !== 'object') {
        // eslint-disable-next-line eqeqeq
        return val1 == val2;
      }

      return false;
    }

    if (val2 === null || _typeof(val2) !== 'object') {
      return false;
    }
  }

  var val1Tag = objectToString(val1);
  var val2Tag = objectToString(val2);

  if (val1Tag !== val2Tag) {
    return false;
  }

  if (Array.isArray(val1)) {
    // Check for sparse arrays and general fast path
    if (val1.length !== val2.length) {
      return false;
    }

    var keys1 = getOwnNonIndexProperties(val1, ONLY_ENUMERABLE);
    var keys2 = getOwnNonIndexProperties(val2, ONLY_ENUMERABLE);

    if (keys1.length !== keys2.length) {
      return false;
    }

    return keyCheck(val1, val2, strict, memos, kIsArray, keys1);
  } // [browserify] This triggers on certain types in IE (Map/Set) so we don't
  // wan't to early return out of the rest of the checks. However we can check
  // if the second value is one of these values and the first isn't.


  if (val1Tag === '[object Object]') {
    // return keyCheck(val1, val2, strict, memos, kNoIterator);
    if (!isMap(val1) && isMap(val2) || !isSet(val1) && isSet(val2)) {
      return false;
    }
  }

  if (isDate(val1)) {
    if (!isDate(val2) || Date.prototype.getTime.call(val1) !== Date.prototype.getTime.call(val2)) {
      return false;
    }
  } else if (isRegExp(val1)) {
    if (!isRegExp(val2) || !areSimilarRegExps(val1, val2)) {
      return false;
    }
  } else if (isNativeError(val1) || val1 instanceof Error) {
    // Do not compare the stack as it might differ even though the error itself
    // is otherwise identical.
    if (val1.message !== val2.message || val1.name !== val2.name) {
      return false;
    }
  } else if (isArrayBufferView(val1)) {
    if (!strict && (isFloat32Array(val1) || isFloat64Array(val1))) {
      if (!areSimilarFloatArrays(val1, val2)) {
        return false;
      }
    } else if (!areSimilarTypedArrays(val1, val2)) {
      return false;
    } // Buffer.compare returns true, so val1.length === val2.length. If they both
    // only contain numeric keys, we don't need to exam further than checking
    // the symbols.


    var _keys = getOwnNonIndexProperties(val1, ONLY_ENUMERABLE);

    var _keys2 = getOwnNonIndexProperties(val2, ONLY_ENUMERABLE);

    if (_keys.length !== _keys2.length) {
      return false;
    }

    return keyCheck(val1, val2, strict, memos, kNoIterator, _keys);
  } else if (isSet(val1)) {
    if (!isSet(val2) || val1.size !== val2.size) {
      return false;
    }

    return keyCheck(val1, val2, strict, memos, kIsSet);
  } else if (isMap(val1)) {
    if (!isMap(val2) || val1.size !== val2.size) {
      return false;
    }

    return keyCheck(val1, val2, strict, memos, kIsMap);
  } else if (isAnyArrayBuffer(val1)) {
    if (!areEqualArrayBuffers(val1, val2)) {
      return false;
    }
  } else if (isBoxedPrimitive(val1) && !isEqualBoxedPrimitive(val1, val2)) {
    return false;
  }

  return keyCheck(val1, val2, strict, memos, kNoIterator);
}

function getEnumerables(val, keys) {
  return keys.filter(function (k) {
    return propertyIsEnumerable(val, k);
  });
}

function keyCheck(val1, val2, strict, memos, iterationType, aKeys) {
  // For all remaining Object pairs, including Array, objects and Maps,
  // equivalence is determined by having:
  // a) The same number of owned enumerable properties
  // b) The same set of keys/indexes (although not necessarily the same order)
  // c) Equivalent values for every corresponding key/index
  // d) For Sets and Maps, equal contents
  // Note: this accounts for both named and indexed properties on Arrays.
  if (arguments.length === 5) {
    aKeys = Object.keys(val1);
    var bKeys = Object.keys(val2); // The pair must have the same number of owned properties.

    if (aKeys.length !== bKeys.length) {
      return false;
    }
  } // Cheap key test


  var i = 0;

  for (; i < aKeys.length; i++) {
    if (!hasOwnProperty(val2, aKeys[i])) {
      return false;
    }
  }

  if (strict && arguments.length === 5) {
    var symbolKeysA = objectGetOwnPropertySymbols(val1);

    if (symbolKeysA.length !== 0) {
      var count = 0;

      for (i = 0; i < symbolKeysA.length; i++) {
        var key = symbolKeysA[i];

        if (propertyIsEnumerable(val1, key)) {
          if (!propertyIsEnumerable(val2, key)) {
            return false;
          }

          aKeys.push(key);
          count++;
        } else if (propertyIsEnumerable(val2, key)) {
          return false;
        }
      }

      var symbolKeysB = objectGetOwnPropertySymbols(val2);

      if (symbolKeysA.length !== symbolKeysB.length && getEnumerables(val2, symbolKeysB).length !== count) {
        return false;
      }
    } else {
      var _symbolKeysB = objectGetOwnPropertySymbols(val2);

      if (_symbolKeysB.length !== 0 && getEnumerables(val2, _symbolKeysB).length !== 0) {
        return false;
      }
    }
  }

  if (aKeys.length === 0 && (iterationType === kNoIterator || iterationType === kIsArray && val1.length === 0 || val1.size === 0)) {
    return true;
  } // Use memos to handle cycles.


  if (memos === undefined) {
    memos = {
      val1: new Map(),
      val2: new Map(),
      position: 0
    };
  } else {
    // We prevent up to two map.has(x) calls by directly retrieving the value
    // and checking for undefined. The map can only contain numbers, so it is
    // safe to check for undefined only.
    var val2MemoA = memos.val1.get(val1);

    if (val2MemoA !== undefined) {
      var val2MemoB = memos.val2.get(val2);

      if (val2MemoB !== undefined) {
        return val2MemoA === val2MemoB;
      }
    }

    memos.position++;
  }

  memos.val1.set(val1, memos.position);
  memos.val2.set(val2, memos.position);
  var areEq = objEquiv(val1, val2, strict, aKeys, memos, iterationType);
  memos.val1.delete(val1);
  memos.val2.delete(val2);
  return areEq;
}

function setHasEqualElement(set, val1, strict, memo) {
  // Go looking.
  var setValues = arrayFromSet(set);

  for (var i = 0; i < setValues.length; i++) {
    var val2 = setValues[i];

    if (innerDeepEqual(val1, val2, strict, memo)) {
      // Remove the matching element to make sure we do not check that again.
      set.delete(val2);
      return true;
    }
  }

  return false;
} // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Loose_equality_using
// Sadly it is not possible to detect corresponding values properly in case the
// type is a string, number, bigint or boolean. The reason is that those values
// can match lots of different string values (e.g., 1n == '+00001').


function findLooseMatchingPrimitives(prim) {
  switch (_typeof(prim)) {
    case 'undefined':
      return null;

    case 'object':
      // Only pass in null as object!
      return undefined;

    case 'symbol':
      return false;

    case 'string':
      prim = +prim;
    // Loose equal entries exist only if the string is possible to convert to
    // a regular number and not NaN.
    // Fall through

    case 'number':
      if (numberIsNaN(prim)) {
        return false;
      }

  }

  return true;
}

function setMightHaveLoosePrim(a, b, prim) {
  var altValue = findLooseMatchingPrimitives(prim);
  if (altValue != null) return altValue;
  return b.has(altValue) && !a.has(altValue);
}

function mapMightHaveLoosePrim(a, b, prim, item, memo) {
  var altValue = findLooseMatchingPrimitives(prim);

  if (altValue != null) {
    return altValue;
  }

  var curB = b.get(altValue);

  if (curB === undefined && !b.has(altValue) || !innerDeepEqual(item, curB, false, memo)) {
    return false;
  }

  return !a.has(altValue) && innerDeepEqual(item, curB, false, memo);
}

function setEquiv(a, b, strict, memo) {
  // This is a lazily initiated Set of entries which have to be compared
  // pairwise.
  var set = null;
  var aValues = arrayFromSet(a);

  for (var i = 0; i < aValues.length; i++) {
    var val = aValues[i]; // Note: Checking for the objects first improves the performance for object
    // heavy sets but it is a minor slow down for primitives. As they are fast
    // to check this improves the worst case scenario instead.

    if (_typeof(val) === 'object' && val !== null) {
      if (set === null) {
        set = new Set();
      } // If the specified value doesn't exist in the second set its an not null
      // object (or non strict only: a not matching primitive) we'll need to go
      // hunting for something thats deep-(strict-)equal to it. To make this
      // O(n log n) complexity we have to copy these values in a new set first.


      set.add(val);
    } else if (!b.has(val)) {
      if (strict) return false; // Fast path to detect missing string, symbol, undefined and null values.

      if (!setMightHaveLoosePrim(a, b, val)) {
        return false;
      }

      if (set === null) {
        set = new Set();
      }

      set.add(val);
    }
  }

  if (set !== null) {
    var bValues = arrayFromSet(b);

    for (var _i = 0; _i < bValues.length; _i++) {
      var _val = bValues[_i]; // We have to check if a primitive value is already
      // matching and only if it's not, go hunting for it.

      if (_typeof(_val) === 'object' && _val !== null) {
        if (!setHasEqualElement(set, _val, strict, memo)) return false;
      } else if (!strict && !a.has(_val) && !setHasEqualElement(set, _val, strict, memo)) {
        return false;
      }
    }

    return set.size === 0;
  }

  return true;
}

function mapHasEqualEntry(set, map, key1, item1, strict, memo) {
  // To be able to handle cases like:
  //   Map([[{}, 'a'], [{}, 'b']]) vs Map([[{}, 'b'], [{}, 'a']])
  // ... we need to consider *all* matching keys, not just the first we find.
  var setValues = arrayFromSet(set);

  for (var i = 0; i < setValues.length; i++) {
    var key2 = setValues[i];

    if (innerDeepEqual(key1, key2, strict, memo) && innerDeepEqual(item1, map.get(key2), strict, memo)) {
      set.delete(key2);
      return true;
    }
  }

  return false;
}

function mapEquiv(a, b, strict, memo) {
  var set = null;
  var aEntries = arrayFromMap(a);

  for (var i = 0; i < aEntries.length; i++) {
    var _aEntries$i = _slicedToArray(aEntries[i], 2),
        key = _aEntries$i[0],
        item1 = _aEntries$i[1];

    if (_typeof(key) === 'object' && key !== null) {
      if (set === null) {
        set = new Set();
      }

      set.add(key);
    } else {
      // By directly retrieving the value we prevent another b.has(key) check in
      // almost all possible cases.
      var item2 = b.get(key);

      if (item2 === undefined && !b.has(key) || !innerDeepEqual(item1, item2, strict, memo)) {
        if (strict) return false; // Fast path to detect missing string, symbol, undefined and null
        // keys.

        if (!mapMightHaveLoosePrim(a, b, key, item1, memo)) return false;

        if (set === null) {
          set = new Set();
        }

        set.add(key);
      }
    }
  }

  if (set !== null) {
    var bEntries = arrayFromMap(b);

    for (var _i2 = 0; _i2 < bEntries.length; _i2++) {
      var _bEntries$_i = _slicedToArray(bEntries[_i2], 2),
          key = _bEntries$_i[0],
          item = _bEntries$_i[1];

      if (_typeof(key) === 'object' && key !== null) {
        if (!mapHasEqualEntry(set, a, key, item, strict, memo)) return false;
      } else if (!strict && (!a.has(key) || !innerDeepEqual(a.get(key), item, false, memo)) && !mapHasEqualEntry(set, a, key, item, false, memo)) {
        return false;
      }
    }

    return set.size === 0;
  }

  return true;
}

function objEquiv(a, b, strict, keys, memos, iterationType) {
  // Sets and maps don't have their entries accessible via normal object
  // properties.
  var i = 0;

  if (iterationType === kIsSet) {
    if (!setEquiv(a, b, strict, memos)) {
      return false;
    }
  } else if (iterationType === kIsMap) {
    if (!mapEquiv(a, b, strict, memos)) {
      return false;
    }
  } else if (iterationType === kIsArray) {
    for (; i < a.length; i++) {
      if (hasOwnProperty(a, i)) {
        if (!hasOwnProperty(b, i) || !innerDeepEqual(a[i], b[i], strict, memos)) {
          return false;
        }
      } else if (hasOwnProperty(b, i)) {
        return false;
      } else {
        // Array is sparse.
        var keysA = Object.keys(a);

        for (; i < keysA.length; i++) {
          var key = keysA[i];

          if (!hasOwnProperty(b, key) || !innerDeepEqual(a[key], b[key], strict, memos)) {
            return false;
          }
        }

        if (keysA.length !== Object.keys(b).length) {
          return false;
        }

        return true;
      }
    }
  } // The pair must have equivalent values for every corresponding key.
  // Possibly expensive deep test:


  for (i = 0; i < keys.length; i++) {
    var _key = keys[i];

    if (!innerDeepEqual(a[_key], b[_key], strict, memos)) {
      return false;
    }
  }

  return true;
}

function isDeepEqual(val1, val2) {
  return innerDeepEqual(val1, val2, kLoose);
}

function isDeepStrictEqual(val1, val2) {
  return innerDeepEqual(val1, val2, kStrict);
}

module.exports = {
  isDeepEqual: isDeepEqual,
  isDeepStrictEqual: isDeepStrictEqual
};

/***/ }),
/* 38 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var callBind = __webpack_require__(16);

var define = __webpack_require__(29);

var implementation = __webpack_require__(39);

var getPolyfill = __webpack_require__(40);

var shim = __webpack_require__(41);

var polyfill = callBind(getPolyfill(), Number);
/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

define(polyfill, {
  getPolyfill: getPolyfill,
  implementation: implementation,
  shim: shim
});
module.exports = polyfill;

/***/ }),
/* 39 */
/***/ ((module) => {

"use strict";

/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

module.exports = function isNaN(value) {
  return value !== value;
};

/***/ }),
/* 40 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(39);

module.exports = function getPolyfill() {
  if (Number.isNaN && Number.isNaN(NaN) && !Number.isNaN('a')) {
    return Number.isNaN;
  }

  return implementation;
};

/***/ }),
/* 41 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var define = __webpack_require__(29);

var getPolyfill = __webpack_require__(40);
/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */


module.exports = function shimNumberIsNaN() {
  var polyfill = getPolyfill();
  define(Number, {
    isNaN: polyfill
  }, {
    isNaN: function testIsNaN() {
      return Number.isNaN !== polyfill;
    }
  });
  return polyfill;
};

/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _path = __webpack_require__(43);

var _helperModuleImports = __webpack_require__(44);

function transCamel(_str, symbol) {
  const str = _str[0].toLowerCase() + _str.substr(1);

  return str.replace(/([A-Z])/g, $1 => `${symbol}${$1.toLowerCase()}`);
}

function winPath(path) {
  return path.replace(/\\/g, "/");
}

function normalizeCustomName(originCustomName) {
  // If set to a string, treat it as a JavaScript source file path.
  if (typeof originCustomName === "string") {
    // eslint-disable-next-line import/no-dynamic-require
    const customNameExports = __webpack_require__(133)(originCustomName);

    return typeof customNameExports === "function" ? customNameExports : customNameExports.default;
  }

  return originCustomName;
}

class Plugin {
  constructor(libraryName, libraryDirectory, style, styleLibraryDirectory, customStyleName, camel2DashComponentName, camel2UnderlineComponentName, fileName, customName, transformToDefaultImport, types, index = 0) {
    this.libraryName = libraryName;
    this.libraryDirectory = typeof libraryDirectory === "undefined" ? "lib" : libraryDirectory;
    this.camel2DashComponentName = typeof camel2DashComponentName === "undefined" ? true : camel2DashComponentName;
    this.camel2UnderlineComponentName = camel2UnderlineComponentName;
    this.style = style || false;
    this.styleLibraryDirectory = styleLibraryDirectory;
    this.customStyleName = normalizeCustomName(customStyleName);
    this.fileName = fileName || "";
    this.customName = normalizeCustomName(customName);
    this.transformToDefaultImport = typeof transformToDefaultImport === "undefined" ? true : transformToDefaultImport;
    this.types = types;
    this.pluginStateKey = `importPluginState${index}`;
  }

  getPluginState(state) {
    if (!state[this.pluginStateKey]) {
      state[this.pluginStateKey] = {}; // eslint-disable-line
    }

    return state[this.pluginStateKey];
  }

  importMethod(methodName, file, pluginState) {
    if (!pluginState.selectedMethods[methodName]) {
      const {
        style,
        libraryDirectory
      } = this;
      const transformedMethodName = this.camel2UnderlineComponentName // eslint-disable-line
      ? transCamel(methodName, "_") : this.camel2DashComponentName ? transCamel(methodName, "-") : methodName;
      const path = winPath(this.customName ? this.customName(transformedMethodName, file) : (0, _path.join)(this.libraryName, libraryDirectory, transformedMethodName, this.fileName) // eslint-disable-line
      );
      pluginState.selectedMethods[methodName] = this.transformToDefaultImport // eslint-disable-line
      ? (0, _helperModuleImports.addDefault)(file.path, path, {
        nameHint: methodName
      }) : (0, _helperModuleImports.addNamed)(file.path, methodName, path);

      if (this.customStyleName) {
        const stylePath = winPath(this.customStyleName(transformedMethodName, file));
        (0, _helperModuleImports.addSideEffect)(file.path, `${stylePath}`);
      } else if (this.styleLibraryDirectory) {
        const stylePath = winPath((0, _path.join)(this.libraryName, this.styleLibraryDirectory, transformedMethodName, this.fileName));
        (0, _helperModuleImports.addSideEffect)(file.path, `${stylePath}`);
      } else if (style === true) {
        (0, _helperModuleImports.addSideEffect)(file.path, `${path}/style`);
      } else if (style === "css") {
        (0, _helperModuleImports.addSideEffect)(file.path, `${path}/style/css`);
      } else if (typeof style === "function") {
        const stylePath = style(path, file);

        if (stylePath) {
          (0, _helperModuleImports.addSideEffect)(file.path, stylePath);
        }
      }
    }

    return { ...pluginState.selectedMethods[methodName]
    };
  }

  buildExpressionHandler(node, props, path, state) {
    const file = path && path.hub && path.hub.file || state && state.file;
    const {
      types
    } = this;
    const pluginState = this.getPluginState(state);
    props.forEach(prop => {
      if (!types.isIdentifier(node[prop])) return;

      if (pluginState.specified[node[prop].name] && types.isImportSpecifier(path.scope.getBinding(node[prop].name).path)) {
        node[prop] = this.importMethod(pluginState.specified[node[prop].name], file, pluginState); // eslint-disable-line
      }
    });
  }

  buildDeclaratorHandler(node, prop, path, state) {
    const file = path && path.hub && path.hub.file || state && state.file;
    const {
      types
    } = this;
    const pluginState = this.getPluginState(state);

    const checkScope = targetNode => pluginState.specified[targetNode.name] && // eslint-disable-line
    path.scope.hasBinding(targetNode.name) && // eslint-disable-line
    path.scope.getBinding(targetNode.name).path.type === "ImportSpecifier"; // eslint-disable-line


    if (types.isIdentifier(node[prop]) && checkScope(node[prop])) {
      node[prop] = this.importMethod(pluginState.specified[node[prop].name], file, pluginState); // eslint-disable-line
    } else if (types.isSequenceExpression(node[prop])) {
      node[prop].expressions.forEach((expressionNode, index) => {
        if (types.isIdentifier(expressionNode) && checkScope(expressionNode)) {
          node[prop].expressions[index] = this.importMethod(pluginState.specified[expressionNode.name], file, pluginState); // eslint-disable-line
        }
      });
    }
  }

  ProgramEnter(path, state) {
    const pluginState = this.getPluginState(state);
    pluginState.specified = Object.create(null);
    pluginState.libraryObjs = Object.create(null);
    pluginState.selectedMethods = Object.create(null);
    pluginState.pathsToRemove = [];
  }

  ProgramExit(path, state) {
    this.getPluginState(state).pathsToRemove.forEach(p => !p.removed && p.remove());
  }

  ImportDeclaration(path, state) {
    const {
      node
    } = path; // path maybe removed by prev instances.

    if (!node) return;
    const {
      value
    } = node.source;
    const {
      libraryName
    } = this;
    const {
      types
    } = this;
    const pluginState = this.getPluginState(state);

    if (value === libraryName) {
      node.specifiers.forEach(spec => {
        if (types.isImportSpecifier(spec)) {
          pluginState.specified[spec.local.name] = spec.imported.name;
        } else {
          pluginState.libraryObjs[spec.local.name] = true;
        }
      });
      pluginState.pathsToRemove.push(path);
    }
  }

  CallExpression(path, state) {
    const {
      node
    } = path;
    const file = path && path.hub && path.hub.file || state && state.file;
    const {
      name
    } = node.callee;
    const {
      types
    } = this;
    const pluginState = this.getPluginState(state);

    if (types.isIdentifier(node.callee)) {
      if (pluginState.specified[name]) {
        node.callee = this.importMethod(pluginState.specified[name], file, pluginState);
      }
    }

    node.arguments = node.arguments.map(arg => {
      const {
        name: argName
      } = arg;

      if (pluginState.specified[argName] && path.scope.hasBinding(argName) && path.scope.getBinding(argName).path.type === "ImportSpecifier") {
        return this.importMethod(pluginState.specified[argName], file, pluginState);
      }

      return arg;
    });
  }

  MemberExpression(path, state) {
    const {
      node
    } = path;
    const file = path && path.hub && path.hub.file || state && state.file;
    const pluginState = this.getPluginState(state); // multiple instance check.

    if (!node.object || !node.object.name) return;

    if (pluginState.libraryObjs[node.object.name]) {
      // antd.Button -> _Button
      path.replaceWith(this.importMethod(node.property.name, file, pluginState));
    } else if (pluginState.specified[node.object.name] && path.scope.hasBinding(node.object.name)) {
      const {
        scope
      } = path.scope.getBinding(node.object.name); // global variable in file scope

      if (scope.path.parent.type === "File") {
        node.object = this.importMethod(pluginState.specified[node.object.name], file, pluginState);
      }
    }
  }

  Property(path, state) {
    const {
      node
    } = path;
    this.buildDeclaratorHandler(node, "value", path, state);
  }

  VariableDeclarator(path, state) {
    const {
      node
    } = path;
    this.buildDeclaratorHandler(node, "init", path, state);
  }

  ArrayExpression(path, state) {
    const {
      node
    } = path;
    const props = node.elements.map((_, index) => index);
    this.buildExpressionHandler(node.elements, props, path, state);
  }

  LogicalExpression(path, state) {
    const {
      node
    } = path;
    this.buildExpressionHandler(node, ["left", "right"], path, state);
  }

  ConditionalExpression(path, state) {
    const {
      node
    } = path;
    this.buildExpressionHandler(node, ["test", "consequent", "alternate"], path, state);
  }

  IfStatement(path, state) {
    const {
      node
    } = path;
    this.buildExpressionHandler(node, ["test"], path, state);
    this.buildExpressionHandler(node.test, ["left", "right"], path, state);
  }

  ExpressionStatement(path, state) {
    const {
      node
    } = path;
    const {
      types
    } = this;

    if (types.isAssignmentExpression(node.expression)) {
      this.buildExpressionHandler(node.expression, ["right"], path, state);
    }
  }

  ReturnStatement(path, state) {
    const {
      node
    } = path;
    this.buildExpressionHandler(node, ["argument"], path, state);
  }

  ExportDefaultDeclaration(path, state) {
    const {
      node
    } = path;
    this.buildExpressionHandler(node, ["declaration"], path, state);
  }

  BinaryExpression(path, state) {
    const {
      node
    } = path;
    this.buildExpressionHandler(node, ["left", "right"], path, state);
  }

  NewExpression(path, state) {
    const {
      node
    } = path;
    this.buildExpressionHandler(node, ["callee"], path, state);
    const argumentsProps = node.arguments.map((_, index) => index);
    this.buildExpressionHandler(node.arguments, argumentsProps, path, state);
  }

  SwitchStatement(path, state) {
    const {
      node
    } = path;
    this.buildExpressionHandler(node, ["discriminant"], path, state);
  }

  SwitchCase(path, state) {
    const {
      node
    } = path;
    this.buildExpressionHandler(node, ["test"], path, state);
  }

  ClassDeclaration(path, state) {
    const {
      node
    } = path;
    this.buildExpressionHandler(node, ["superClass"], path, state);
  }

}

exports["default"] = Plugin;

/***/ }),
/* 43 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(4);
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
} // Resolves . and .. elements in a path with directory names


function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;

  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length) code = path.charCodeAt(i);else if (code === 47
    /*/*/
    ) break;else code = 47
    /*/*/
    ;

    if (code === 47
    /*/*/
    ) {
      if (lastSlash === i - 1 || dots === 1) {// NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46
        /*.*/
        || res.charCodeAt(res.length - 2) !== 46
        /*.*/
        ) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');

            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }

              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }

        if (allowAboveRoot) {
          if (res.length > 0) res += '/..';else res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) res += '/' + path.slice(lastSlash + 1, i);else res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }

      lastSlash = i;
      dots = 0;
    } else if (code === 46
    /*.*/
    && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }

  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');

  if (!dir) {
    return base;
  }

  if (dir === pathObject.root) {
    return dir + base;
  }

  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0) path = arguments[i];else {
        if (cwd === undefined) cwd = process.cwd();
        path = cwd;
      }
      assertPath(path); // Skip empty entries

      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47
      /*/*/
      ;
    } // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    // Normalize the path


    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0) return '/' + resolvedPath;else return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },
  normalize: function normalize(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var isAbsolute = path.charCodeAt(0) === 47
    /*/*/
    ;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47
    /*/*/
    ; // Normalize the path

    path = normalizeStringPosix(path, !isAbsolute);
    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';
    if (isAbsolute) return '/' + path;
    return path;
  },
  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47
    /*/*/
    ;
  },
  join: function join() {
    if (arguments.length === 0) return '.';
    var joined;

    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);

      if (arg.length > 0) {
        if (joined === undefined) joined = arg;else joined += '/' + arg;
      }
    }

    if (joined === undefined) return '.';
    return posix.normalize(joined);
  },
  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to) return '';
    from = posix.resolve(from);
    to = posix.resolve(to);
    if (from === to) return ''; // Trim any leading backslashes

    var fromStart = 1;

    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47
      /*/*/
      ) break;
    }

    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart; // Trim any leading backslashes

    var toStart = 1;

    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47
      /*/*/
      ) break;
    }

    var toEnd = to.length;
    var toLen = toEnd - toStart; // Compare paths to find the longest common path from root

    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;

    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47
          /*/*/
          ) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47
          /*/*/
          ) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }

        break;
      }

      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode) break;else if (fromCode === 47
      /*/*/
      ) lastCommonSep = i;
    }

    var out = ''; // Generate the relative path based on the path difference between `to`
    // and `from`

    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47
      /*/*/
      ) {
        if (out.length === 0) out += '..';else out += '/..';
      }
    } // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts


    if (out.length > 0) return out + to.slice(toStart + lastCommonSep);else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47
      /*/*/
      ) ++toStart;
      return to.slice(toStart);
    }
  },
  _makeLong: function _makeLong(path) {
    return path;
  },
  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47
    /*/*/
    ;
    var end = -1;
    var matchedSlash = true;

    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);

      if (code === 47
      /*/*/
      ) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },
  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);
    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;

      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);

        if (code === 47
        /*/*/
        ) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }

          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47
        /*/*/
        ) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },
  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true; // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find

    var preDotState = 0;

    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);

      if (code === 47
      /*/*/
      ) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }

        continue;
      }

      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }

      if (code === 46
      /*.*/
      ) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }

    return path.slice(startDot, end);
  },
  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }

    return _format('/', pathObject);
  },
  parse: function parse(path) {
    assertPath(path);
    var ret = {
      root: '',
      dir: '',
      base: '',
      ext: '',
      name: ''
    };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47
    /*/*/
    ;
    var start;

    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }

    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1; // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find

    var preDotState = 0; // Get non-dir info

    for (; i >= start; --i) {
      code = path.charCodeAt(i);

      if (code === 47
      /*/*/
      ) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }

        continue;
      }

      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }

      if (code === 46
      /*.*/
      ) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }

      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';
    return ret;
  },
  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};
posix.posix = posix;
module.exports = posix;

/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "ImportInjector", ({
  enumerable: true,
  get: function () {
    return _importInjector.default;
  }
}));
exports.addDefault = addDefault;
exports.addNamed = addNamed;
exports.addNamespace = addNamespace;
exports.addSideEffect = addSideEffect;
Object.defineProperty(exports, "isModule", ({
  enumerable: true,
  get: function () {
    return _isModule.default;
  }
}));

var _importInjector = __webpack_require__(45);

var _isModule = __webpack_require__(132);

function addDefault(path, importedSource, opts) {
  return new _importInjector.default(path).addDefault(importedSource, opts);
}

function addNamed(path, name, importedSource, opts) {
  return new _importInjector.default(path).addNamed(name, importedSource, opts);
}

function addNamespace(path, importedSource, opts) {
  return new _importInjector.default(path).addNamespace(importedSource, opts);
}

function addSideEffect(path, importedSource, opts) {
  return new _importInjector.default(path).addSideEffect(importedSource, opts);
}

/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _assert = __webpack_require__(1);

var _t = __webpack_require__(46);

var _importBuilder = __webpack_require__(131);

var _isModule = __webpack_require__(132);

const {
  numericLiteral,
  sequenceExpression
} = _t;

class ImportInjector {
  constructor(path, importedSource, opts) {
    this._defaultOpts = {
      importedSource: null,
      importedType: "commonjs",
      importedInterop: "babel",
      importingInterop: "babel",
      ensureLiveReference: false,
      ensureNoContext: false,
      importPosition: "before"
    };
    const programPath = path.find(p => p.isProgram());
    this._programPath = programPath;
    this._programScope = programPath.scope;
    this._hub = programPath.hub;
    this._defaultOpts = this._applyDefaults(importedSource, opts, true);
  }

  addDefault(importedSourceIn, opts) {
    return this.addNamed("default", importedSourceIn, opts);
  }

  addNamed(importName, importedSourceIn, opts) {
    _assert(typeof importName === "string");

    return this._generateImport(this._applyDefaults(importedSourceIn, opts), importName);
  }

  addNamespace(importedSourceIn, opts) {
    return this._generateImport(this._applyDefaults(importedSourceIn, opts), null);
  }

  addSideEffect(importedSourceIn, opts) {
    return this._generateImport(this._applyDefaults(importedSourceIn, opts), void 0);
  }

  _applyDefaults(importedSource, opts, isInit = false) {
    let newOpts;

    if (typeof importedSource === "string") {
      newOpts = Object.assign({}, this._defaultOpts, {
        importedSource
      }, opts);
    } else {
      _assert(!opts, "Unexpected secondary arguments.");

      newOpts = Object.assign({}, this._defaultOpts, importedSource);
    }

    if (!isInit && opts) {
      if (opts.nameHint !== undefined) newOpts.nameHint = opts.nameHint;
      if (opts.blockHoist !== undefined) newOpts.blockHoist = opts.blockHoist;
    }

    return newOpts;
  }

  _generateImport(opts, importName) {
    const isDefault = importName === "default";
    const isNamed = !!importName && !isDefault;
    const isNamespace = importName === null;
    const {
      importedSource,
      importedType,
      importedInterop,
      importingInterop,
      ensureLiveReference,
      ensureNoContext,
      nameHint,
      importPosition,
      blockHoist
    } = opts;
    let name = nameHint || importName;
    const isMod = (0, _isModule.default)(this._programPath);
    const isModuleForNode = isMod && importingInterop === "node";
    const isModuleForBabel = isMod && importingInterop === "babel";

    if (importPosition === "after" && !isMod) {
      throw new Error(`"importPosition": "after" is only supported in modules`);
    }

    const builder = new _importBuilder.default(importedSource, this._programScope, this._hub);

    if (importedType === "es6") {
      if (!isModuleForNode && !isModuleForBabel) {
        throw new Error("Cannot import an ES6 module from CommonJS");
      }

      builder.import();

      if (isNamespace) {
        builder.namespace(nameHint || importedSource);
      } else if (isDefault || isNamed) {
        builder.named(name, importName);
      }
    } else if (importedType !== "commonjs") {
      throw new Error(`Unexpected interopType "${importedType}"`);
    } else if (importedInterop === "babel") {
      if (isModuleForNode) {
        name = name !== "default" ? name : importedSource;
        const es6Default = `${importedSource}$es6Default`;
        builder.import();

        if (isNamespace) {
          builder.default(es6Default).var(name || importedSource).wildcardInterop();
        } else if (isDefault) {
          if (ensureLiveReference) {
            builder.default(es6Default).var(name || importedSource).defaultInterop().read("default");
          } else {
            builder.default(es6Default).var(name).defaultInterop().prop(importName);
          }
        } else if (isNamed) {
          builder.default(es6Default).read(importName);
        }
      } else if (isModuleForBabel) {
        builder.import();

        if (isNamespace) {
          builder.namespace(name || importedSource);
        } else if (isDefault || isNamed) {
          builder.named(name, importName);
        }
      } else {
        builder.require();

        if (isNamespace) {
          builder.var(name || importedSource).wildcardInterop();
        } else if ((isDefault || isNamed) && ensureLiveReference) {
          if (isDefault) {
            name = name !== "default" ? name : importedSource;
            builder.var(name).read(importName);
            builder.defaultInterop();
          } else {
            builder.var(importedSource).read(importName);
          }
        } else if (isDefault) {
          builder.var(name).defaultInterop().prop(importName);
        } else if (isNamed) {
          builder.var(name).prop(importName);
        }
      }
    } else if (importedInterop === "compiled") {
      if (isModuleForNode) {
        builder.import();

        if (isNamespace) {
          builder.default(name || importedSource);
        } else if (isDefault || isNamed) {
          builder.default(importedSource).read(name);
        }
      } else if (isModuleForBabel) {
        builder.import();

        if (isNamespace) {
          builder.namespace(name || importedSource);
        } else if (isDefault || isNamed) {
          builder.named(name, importName);
        }
      } else {
        builder.require();

        if (isNamespace) {
          builder.var(name || importedSource);
        } else if (isDefault || isNamed) {
          if (ensureLiveReference) {
            builder.var(importedSource).read(name);
          } else {
            builder.prop(importName).var(name);
          }
        }
      }
    } else if (importedInterop === "uncompiled") {
      if (isDefault && ensureLiveReference) {
        throw new Error("No live reference for commonjs default");
      }

      if (isModuleForNode) {
        builder.import();

        if (isNamespace) {
          builder.default(name || importedSource);
        } else if (isDefault) {
          builder.default(name);
        } else if (isNamed) {
          builder.default(importedSource).read(name);
        }
      } else if (isModuleForBabel) {
        builder.import();

        if (isNamespace) {
          builder.default(name || importedSource);
        } else if (isDefault) {
          builder.default(name);
        } else if (isNamed) {
          builder.named(name, importName);
        }
      } else {
        builder.require();

        if (isNamespace) {
          builder.var(name || importedSource);
        } else if (isDefault) {
          builder.var(name);
        } else if (isNamed) {
          if (ensureLiveReference) {
            builder.var(importedSource).read(name);
          } else {
            builder.var(name).prop(importName);
          }
        }
      }
    } else {
      throw new Error(`Unknown importedInterop "${importedInterop}".`);
    }

    const {
      statements,
      resultName
    } = builder.done();

    this._insertStatements(statements, importPosition, blockHoist);

    if ((isDefault || isNamed) && ensureNoContext && resultName.type !== "Identifier") {
      return sequenceExpression([numericLiteral(0), resultName]);
    }

    return resultName;
  }

  _insertStatements(statements, importPosition = "before", blockHoist = 3) {
    const body = this._programPath.get("body");

    if (importPosition === "after") {
      for (let i = body.length - 1; i >= 0; i--) {
        if (body[i].isImportDeclaration()) {
          body[i].insertAfter(statements);
          return;
        }
      }
    } else {
      statements.forEach(node => {
        node._blockHoist = blockHoist;
      });
      const targetPath = body.find(p => {
        const val = p.node._blockHoist;
        return Number.isFinite(val) && val < 4;
      });

      if (targetPath) {
        targetPath.insertBefore(statements);
        return;
      }
    }

    this._programPath.unshiftContainer("body", statements);
  }

}

exports["default"] = ImportInjector;

/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var _exportNames = {
  react: true,
  assertNode: true,
  createTypeAnnotationBasedOnTypeof: true,
  createUnionTypeAnnotation: true,
  createFlowUnionType: true,
  createTSUnionType: true,
  cloneNode: true,
  clone: true,
  cloneDeep: true,
  cloneDeepWithoutLoc: true,
  cloneWithoutLoc: true,
  addComment: true,
  addComments: true,
  inheritInnerComments: true,
  inheritLeadingComments: true,
  inheritsComments: true,
  inheritTrailingComments: true,
  removeComments: true,
  ensureBlock: true,
  toBindingIdentifierName: true,
  toBlock: true,
  toComputedKey: true,
  toExpression: true,
  toIdentifier: true,
  toKeyAlias: true,
  toSequenceExpression: true,
  toStatement: true,
  valueToNode: true,
  appendToMemberExpression: true,
  inherits: true,
  prependToMemberExpression: true,
  removeProperties: true,
  removePropertiesDeep: true,
  removeTypeDuplicates: true,
  getBindingIdentifiers: true,
  getOuterBindingIdentifiers: true,
  traverse: true,
  traverseFast: true,
  shallowEqual: true,
  is: true,
  isBinding: true,
  isBlockScoped: true,
  isImmutable: true,
  isLet: true,
  isNode: true,
  isNodesEquivalent: true,
  isPlaceholderType: true,
  isReferenced: true,
  isScope: true,
  isSpecifierDefault: true,
  isType: true,
  isValidES3Identifier: true,
  isValidIdentifier: true,
  isVar: true,
  matchesPattern: true,
  validate: true,
  buildMatchMemberExpression: true
};
Object.defineProperty(exports, "addComment", ({
  enumerable: true,
  get: function () {
    return _addComment.default;
  }
}));
Object.defineProperty(exports, "addComments", ({
  enumerable: true,
  get: function () {
    return _addComments.default;
  }
}));
Object.defineProperty(exports, "appendToMemberExpression", ({
  enumerable: true,
  get: function () {
    return _appendToMemberExpression.default;
  }
}));
Object.defineProperty(exports, "assertNode", ({
  enumerable: true,
  get: function () {
    return _assertNode.default;
  }
}));
Object.defineProperty(exports, "buildMatchMemberExpression", ({
  enumerable: true,
  get: function () {
    return _buildMatchMemberExpression.default;
  }
}));
Object.defineProperty(exports, "clone", ({
  enumerable: true,
  get: function () {
    return _clone.default;
  }
}));
Object.defineProperty(exports, "cloneDeep", ({
  enumerable: true,
  get: function () {
    return _cloneDeep.default;
  }
}));
Object.defineProperty(exports, "cloneDeepWithoutLoc", ({
  enumerable: true,
  get: function () {
    return _cloneDeepWithoutLoc.default;
  }
}));
Object.defineProperty(exports, "cloneNode", ({
  enumerable: true,
  get: function () {
    return _cloneNode.default;
  }
}));
Object.defineProperty(exports, "cloneWithoutLoc", ({
  enumerable: true,
  get: function () {
    return _cloneWithoutLoc.default;
  }
}));
Object.defineProperty(exports, "createFlowUnionType", ({
  enumerable: true,
  get: function () {
    return _createFlowUnionType.default;
  }
}));
Object.defineProperty(exports, "createTSUnionType", ({
  enumerable: true,
  get: function () {
    return _createTSUnionType.default;
  }
}));
Object.defineProperty(exports, "createTypeAnnotationBasedOnTypeof", ({
  enumerable: true,
  get: function () {
    return _createTypeAnnotationBasedOnTypeof.default;
  }
}));
Object.defineProperty(exports, "createUnionTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _createFlowUnionType.default;
  }
}));
Object.defineProperty(exports, "ensureBlock", ({
  enumerable: true,
  get: function () {
    return _ensureBlock.default;
  }
}));
Object.defineProperty(exports, "getBindingIdentifiers", ({
  enumerable: true,
  get: function () {
    return _getBindingIdentifiers.default;
  }
}));
Object.defineProperty(exports, "getOuterBindingIdentifiers", ({
  enumerable: true,
  get: function () {
    return _getOuterBindingIdentifiers.default;
  }
}));
Object.defineProperty(exports, "inheritInnerComments", ({
  enumerable: true,
  get: function () {
    return _inheritInnerComments.default;
  }
}));
Object.defineProperty(exports, "inheritLeadingComments", ({
  enumerable: true,
  get: function () {
    return _inheritLeadingComments.default;
  }
}));
Object.defineProperty(exports, "inheritTrailingComments", ({
  enumerable: true,
  get: function () {
    return _inheritTrailingComments.default;
  }
}));
Object.defineProperty(exports, "inherits", ({
  enumerable: true,
  get: function () {
    return _inherits.default;
  }
}));
Object.defineProperty(exports, "inheritsComments", ({
  enumerable: true,
  get: function () {
    return _inheritsComments.default;
  }
}));
Object.defineProperty(exports, "is", ({
  enumerable: true,
  get: function () {
    return _is.default;
  }
}));
Object.defineProperty(exports, "isBinding", ({
  enumerable: true,
  get: function () {
    return _isBinding.default;
  }
}));
Object.defineProperty(exports, "isBlockScoped", ({
  enumerable: true,
  get: function () {
    return _isBlockScoped.default;
  }
}));
Object.defineProperty(exports, "isImmutable", ({
  enumerable: true,
  get: function () {
    return _isImmutable.default;
  }
}));
Object.defineProperty(exports, "isLet", ({
  enumerable: true,
  get: function () {
    return _isLet.default;
  }
}));
Object.defineProperty(exports, "isNode", ({
  enumerable: true,
  get: function () {
    return _isNode.default;
  }
}));
Object.defineProperty(exports, "isNodesEquivalent", ({
  enumerable: true,
  get: function () {
    return _isNodesEquivalent.default;
  }
}));
Object.defineProperty(exports, "isPlaceholderType", ({
  enumerable: true,
  get: function () {
    return _isPlaceholderType.default;
  }
}));
Object.defineProperty(exports, "isReferenced", ({
  enumerable: true,
  get: function () {
    return _isReferenced.default;
  }
}));
Object.defineProperty(exports, "isScope", ({
  enumerable: true,
  get: function () {
    return _isScope.default;
  }
}));
Object.defineProperty(exports, "isSpecifierDefault", ({
  enumerable: true,
  get: function () {
    return _isSpecifierDefault.default;
  }
}));
Object.defineProperty(exports, "isType", ({
  enumerable: true,
  get: function () {
    return _isType.default;
  }
}));
Object.defineProperty(exports, "isValidES3Identifier", ({
  enumerable: true,
  get: function () {
    return _isValidES3Identifier.default;
  }
}));
Object.defineProperty(exports, "isValidIdentifier", ({
  enumerable: true,
  get: function () {
    return _isValidIdentifier.default;
  }
}));
Object.defineProperty(exports, "isVar", ({
  enumerable: true,
  get: function () {
    return _isVar.default;
  }
}));
Object.defineProperty(exports, "matchesPattern", ({
  enumerable: true,
  get: function () {
    return _matchesPattern.default;
  }
}));
Object.defineProperty(exports, "prependToMemberExpression", ({
  enumerable: true,
  get: function () {
    return _prependToMemberExpression.default;
  }
}));
exports.react = void 0;
Object.defineProperty(exports, "removeComments", ({
  enumerable: true,
  get: function () {
    return _removeComments.default;
  }
}));
Object.defineProperty(exports, "removeProperties", ({
  enumerable: true,
  get: function () {
    return _removeProperties.default;
  }
}));
Object.defineProperty(exports, "removePropertiesDeep", ({
  enumerable: true,
  get: function () {
    return _removePropertiesDeep.default;
  }
}));
Object.defineProperty(exports, "removeTypeDuplicates", ({
  enumerable: true,
  get: function () {
    return _removeTypeDuplicates.default;
  }
}));
Object.defineProperty(exports, "shallowEqual", ({
  enumerable: true,
  get: function () {
    return _shallowEqual.default;
  }
}));
Object.defineProperty(exports, "toBindingIdentifierName", ({
  enumerable: true,
  get: function () {
    return _toBindingIdentifierName.default;
  }
}));
Object.defineProperty(exports, "toBlock", ({
  enumerable: true,
  get: function () {
    return _toBlock.default;
  }
}));
Object.defineProperty(exports, "toComputedKey", ({
  enumerable: true,
  get: function () {
    return _toComputedKey.default;
  }
}));
Object.defineProperty(exports, "toExpression", ({
  enumerable: true,
  get: function () {
    return _toExpression.default;
  }
}));
Object.defineProperty(exports, "toIdentifier", ({
  enumerable: true,
  get: function () {
    return _toIdentifier.default;
  }
}));
Object.defineProperty(exports, "toKeyAlias", ({
  enumerable: true,
  get: function () {
    return _toKeyAlias.default;
  }
}));
Object.defineProperty(exports, "toSequenceExpression", ({
  enumerable: true,
  get: function () {
    return _toSequenceExpression.default;
  }
}));
Object.defineProperty(exports, "toStatement", ({
  enumerable: true,
  get: function () {
    return _toStatement.default;
  }
}));
Object.defineProperty(exports, "traverse", ({
  enumerable: true,
  get: function () {
    return _traverse.default;
  }
}));
Object.defineProperty(exports, "traverseFast", ({
  enumerable: true,
  get: function () {
    return _traverseFast.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "valueToNode", ({
  enumerable: true,
  get: function () {
    return _valueToNode.default;
  }
}));

var _isReactComponent = __webpack_require__(47);

var _isCompatTag = __webpack_require__(52);

var _buildChildren = __webpack_require__(53);

var _assertNode = __webpack_require__(77);

var _generated = __webpack_require__(79);

Object.keys(_generated).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _generated[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _generated[key];
    }
  });
});

var _createTypeAnnotationBasedOnTypeof = __webpack_require__(80);

var _createFlowUnionType = __webpack_require__(81);

var _createTSUnionType = __webpack_require__(83);

var _generated2 = __webpack_require__(55);

Object.keys(_generated2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _generated2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _generated2[key];
    }
  });
});

var _uppercase = __webpack_require__(85);

Object.keys(_uppercase).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _uppercase[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _uppercase[key];
    }
  });
});

var _cloneNode = __webpack_require__(86);

var _clone = __webpack_require__(87);

var _cloneDeep = __webpack_require__(88);

var _cloneDeepWithoutLoc = __webpack_require__(89);

var _cloneWithoutLoc = __webpack_require__(90);

var _addComment = __webpack_require__(91);

var _addComments = __webpack_require__(92);

var _inheritInnerComments = __webpack_require__(93);

var _inheritLeadingComments = __webpack_require__(95);

var _inheritsComments = __webpack_require__(96);

var _inheritTrailingComments = __webpack_require__(97);

var _removeComments = __webpack_require__(98);

var _generated3 = __webpack_require__(99);

Object.keys(_generated3).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _generated3[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _generated3[key];
    }
  });
});

var _constants = __webpack_require__(69);

Object.keys(_constants).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _constants[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _constants[key];
    }
  });
});

var _ensureBlock = __webpack_require__(100);

var _toBindingIdentifierName = __webpack_require__(102);

var _toBlock = __webpack_require__(101);

var _toComputedKey = __webpack_require__(104);

var _toExpression = __webpack_require__(105);

var _toIdentifier = __webpack_require__(103);

var _toKeyAlias = __webpack_require__(106);

var _toSequenceExpression = __webpack_require__(110);

var _toStatement = __webpack_require__(113);

var _valueToNode = __webpack_require__(114);

var _definitions = __webpack_require__(58);

Object.keys(_definitions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _definitions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _definitions[key];
    }
  });
});

var _appendToMemberExpression = __webpack_require__(115);

var _inherits = __webpack_require__(116);

var _prependToMemberExpression = __webpack_require__(117);

var _removeProperties = __webpack_require__(109);

var _removePropertiesDeep = __webpack_require__(107);

var _removeTypeDuplicates = __webpack_require__(82);

var _getBindingIdentifiers = __webpack_require__(112);

var _getOuterBindingIdentifiers = __webpack_require__(118);

var _traverse = __webpack_require__(119);

Object.keys(_traverse).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _traverse[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _traverse[key];
    }
  });
});

var _traverseFast = __webpack_require__(108);

var _shallowEqual = __webpack_require__(51);

var _is = __webpack_require__(61);

var _isBinding = __webpack_require__(120);

var _isBlockScoped = __webpack_require__(121);

var _isImmutable = __webpack_require__(123);

var _isLet = __webpack_require__(122);

var _isNode = __webpack_require__(78);

var _isNodesEquivalent = __webpack_require__(124);

var _isPlaceholderType = __webpack_require__(63);

var _isReferenced = __webpack_require__(125);

var _isScope = __webpack_require__(126);

var _isSpecifierDefault = __webpack_require__(127);

var _isType = __webpack_require__(62);

var _isValidES3Identifier = __webpack_require__(128);

var _isValidIdentifier = __webpack_require__(64);

var _isVar = __webpack_require__(129);

var _matchesPattern = __webpack_require__(49);

var _validate = __webpack_require__(57);

var _buildMatchMemberExpression = __webpack_require__(48);

var _generated4 = __webpack_require__(50);

Object.keys(_generated4).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _generated4[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _generated4[key];
    }
  });
});

var _generated5 = __webpack_require__(130);

Object.keys(_generated5).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _generated5[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _generated5[key];
    }
  });
});
const react = {
  isReactComponent: _isReactComponent.default,
  isCompatTag: _isCompatTag.default,
  buildChildren: _buildChildren.default
};
exports.react = react;

/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _buildMatchMemberExpression = __webpack_require__(48);

const isReactComponent = (0, _buildMatchMemberExpression.default)("React.Component");
var _default = isReactComponent;
exports["default"] = _default;

/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = buildMatchMemberExpression;

var _matchesPattern = __webpack_require__(49);

function buildMatchMemberExpression(match, allowPartial) {
  const parts = match.split(".");
  return member => (0, _matchesPattern.default)(member, parts, allowPartial);
}

/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = matchesPattern;

var _generated = __webpack_require__(50);

function matchesPattern(member, match, allowPartial) {
  if (!(0, _generated.isMemberExpression)(member)) return false;
  const parts = Array.isArray(match) ? match : match.split(".");
  const nodes = [];
  let node;

  for (node = member; (0, _generated.isMemberExpression)(node); node = node.object) {
    nodes.push(node.property);
  }

  nodes.push(node);
  if (nodes.length < parts.length) return false;
  if (!allowPartial && nodes.length > parts.length) return false;

  for (let i = 0, j = nodes.length - 1; i < parts.length; i++, j--) {
    const node = nodes[j];
    let value;

    if ((0, _generated.isIdentifier)(node)) {
      value = node.name;
    } else if ((0, _generated.isStringLiteral)(node)) {
      value = node.value;
    } else if ((0, _generated.isThisExpression)(node)) {
      value = "this";
    } else {
      return false;
    }

    if (parts[i] !== value) return false;
  }

  return true;
}

/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var console = __webpack_require__(5);


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isAccessor = isAccessor;
exports.isAnyTypeAnnotation = isAnyTypeAnnotation;
exports.isArgumentPlaceholder = isArgumentPlaceholder;
exports.isArrayExpression = isArrayExpression;
exports.isArrayPattern = isArrayPattern;
exports.isArrayTypeAnnotation = isArrayTypeAnnotation;
exports.isArrowFunctionExpression = isArrowFunctionExpression;
exports.isAssignmentExpression = isAssignmentExpression;
exports.isAssignmentPattern = isAssignmentPattern;
exports.isAwaitExpression = isAwaitExpression;
exports.isBigIntLiteral = isBigIntLiteral;
exports.isBinary = isBinary;
exports.isBinaryExpression = isBinaryExpression;
exports.isBindExpression = isBindExpression;
exports.isBlock = isBlock;
exports.isBlockParent = isBlockParent;
exports.isBlockStatement = isBlockStatement;
exports.isBooleanLiteral = isBooleanLiteral;
exports.isBooleanLiteralTypeAnnotation = isBooleanLiteralTypeAnnotation;
exports.isBooleanTypeAnnotation = isBooleanTypeAnnotation;
exports.isBreakStatement = isBreakStatement;
exports.isCallExpression = isCallExpression;
exports.isCatchClause = isCatchClause;
exports.isClass = isClass;
exports.isClassAccessorProperty = isClassAccessorProperty;
exports.isClassBody = isClassBody;
exports.isClassDeclaration = isClassDeclaration;
exports.isClassExpression = isClassExpression;
exports.isClassImplements = isClassImplements;
exports.isClassMethod = isClassMethod;
exports.isClassPrivateMethod = isClassPrivateMethod;
exports.isClassPrivateProperty = isClassPrivateProperty;
exports.isClassProperty = isClassProperty;
exports.isCompletionStatement = isCompletionStatement;
exports.isConditional = isConditional;
exports.isConditionalExpression = isConditionalExpression;
exports.isContinueStatement = isContinueStatement;
exports.isDebuggerStatement = isDebuggerStatement;
exports.isDecimalLiteral = isDecimalLiteral;
exports.isDeclaration = isDeclaration;
exports.isDeclareClass = isDeclareClass;
exports.isDeclareExportAllDeclaration = isDeclareExportAllDeclaration;
exports.isDeclareExportDeclaration = isDeclareExportDeclaration;
exports.isDeclareFunction = isDeclareFunction;
exports.isDeclareInterface = isDeclareInterface;
exports.isDeclareModule = isDeclareModule;
exports.isDeclareModuleExports = isDeclareModuleExports;
exports.isDeclareOpaqueType = isDeclareOpaqueType;
exports.isDeclareTypeAlias = isDeclareTypeAlias;
exports.isDeclareVariable = isDeclareVariable;
exports.isDeclaredPredicate = isDeclaredPredicate;
exports.isDecorator = isDecorator;
exports.isDirective = isDirective;
exports.isDirectiveLiteral = isDirectiveLiteral;
exports.isDoExpression = isDoExpression;
exports.isDoWhileStatement = isDoWhileStatement;
exports.isEmptyStatement = isEmptyStatement;
exports.isEmptyTypeAnnotation = isEmptyTypeAnnotation;
exports.isEnumBody = isEnumBody;
exports.isEnumBooleanBody = isEnumBooleanBody;
exports.isEnumBooleanMember = isEnumBooleanMember;
exports.isEnumDeclaration = isEnumDeclaration;
exports.isEnumDefaultedMember = isEnumDefaultedMember;
exports.isEnumMember = isEnumMember;
exports.isEnumNumberBody = isEnumNumberBody;
exports.isEnumNumberMember = isEnumNumberMember;
exports.isEnumStringBody = isEnumStringBody;
exports.isEnumStringMember = isEnumStringMember;
exports.isEnumSymbolBody = isEnumSymbolBody;
exports.isExistsTypeAnnotation = isExistsTypeAnnotation;
exports.isExportAllDeclaration = isExportAllDeclaration;
exports.isExportDeclaration = isExportDeclaration;
exports.isExportDefaultDeclaration = isExportDefaultDeclaration;
exports.isExportDefaultSpecifier = isExportDefaultSpecifier;
exports.isExportNamedDeclaration = isExportNamedDeclaration;
exports.isExportNamespaceSpecifier = isExportNamespaceSpecifier;
exports.isExportSpecifier = isExportSpecifier;
exports.isExpression = isExpression;
exports.isExpressionStatement = isExpressionStatement;
exports.isExpressionWrapper = isExpressionWrapper;
exports.isFile = isFile;
exports.isFlow = isFlow;
exports.isFlowBaseAnnotation = isFlowBaseAnnotation;
exports.isFlowDeclaration = isFlowDeclaration;
exports.isFlowPredicate = isFlowPredicate;
exports.isFlowType = isFlowType;
exports.isFor = isFor;
exports.isForInStatement = isForInStatement;
exports.isForOfStatement = isForOfStatement;
exports.isForStatement = isForStatement;
exports.isForXStatement = isForXStatement;
exports.isFunction = isFunction;
exports.isFunctionDeclaration = isFunctionDeclaration;
exports.isFunctionExpression = isFunctionExpression;
exports.isFunctionParent = isFunctionParent;
exports.isFunctionTypeAnnotation = isFunctionTypeAnnotation;
exports.isFunctionTypeParam = isFunctionTypeParam;
exports.isGenericTypeAnnotation = isGenericTypeAnnotation;
exports.isIdentifier = isIdentifier;
exports.isIfStatement = isIfStatement;
exports.isImmutable = isImmutable;
exports.isImport = isImport;
exports.isImportAttribute = isImportAttribute;
exports.isImportDeclaration = isImportDeclaration;
exports.isImportDefaultSpecifier = isImportDefaultSpecifier;
exports.isImportNamespaceSpecifier = isImportNamespaceSpecifier;
exports.isImportSpecifier = isImportSpecifier;
exports.isIndexedAccessType = isIndexedAccessType;
exports.isInferredPredicate = isInferredPredicate;
exports.isInterfaceDeclaration = isInterfaceDeclaration;
exports.isInterfaceExtends = isInterfaceExtends;
exports.isInterfaceTypeAnnotation = isInterfaceTypeAnnotation;
exports.isInterpreterDirective = isInterpreterDirective;
exports.isIntersectionTypeAnnotation = isIntersectionTypeAnnotation;
exports.isJSX = isJSX;
exports.isJSXAttribute = isJSXAttribute;
exports.isJSXClosingElement = isJSXClosingElement;
exports.isJSXClosingFragment = isJSXClosingFragment;
exports.isJSXElement = isJSXElement;
exports.isJSXEmptyExpression = isJSXEmptyExpression;
exports.isJSXExpressionContainer = isJSXExpressionContainer;
exports.isJSXFragment = isJSXFragment;
exports.isJSXIdentifier = isJSXIdentifier;
exports.isJSXMemberExpression = isJSXMemberExpression;
exports.isJSXNamespacedName = isJSXNamespacedName;
exports.isJSXOpeningElement = isJSXOpeningElement;
exports.isJSXOpeningFragment = isJSXOpeningFragment;
exports.isJSXSpreadAttribute = isJSXSpreadAttribute;
exports.isJSXSpreadChild = isJSXSpreadChild;
exports.isJSXText = isJSXText;
exports.isLVal = isLVal;
exports.isLabeledStatement = isLabeledStatement;
exports.isLiteral = isLiteral;
exports.isLogicalExpression = isLogicalExpression;
exports.isLoop = isLoop;
exports.isMemberExpression = isMemberExpression;
exports.isMetaProperty = isMetaProperty;
exports.isMethod = isMethod;
exports.isMiscellaneous = isMiscellaneous;
exports.isMixedTypeAnnotation = isMixedTypeAnnotation;
exports.isModuleDeclaration = isModuleDeclaration;
exports.isModuleExpression = isModuleExpression;
exports.isModuleSpecifier = isModuleSpecifier;
exports.isNewExpression = isNewExpression;
exports.isNoop = isNoop;
exports.isNullLiteral = isNullLiteral;
exports.isNullLiteralTypeAnnotation = isNullLiteralTypeAnnotation;
exports.isNullableTypeAnnotation = isNullableTypeAnnotation;
exports.isNumberLiteral = isNumberLiteral;
exports.isNumberLiteralTypeAnnotation = isNumberLiteralTypeAnnotation;
exports.isNumberTypeAnnotation = isNumberTypeAnnotation;
exports.isNumericLiteral = isNumericLiteral;
exports.isObjectExpression = isObjectExpression;
exports.isObjectMember = isObjectMember;
exports.isObjectMethod = isObjectMethod;
exports.isObjectPattern = isObjectPattern;
exports.isObjectProperty = isObjectProperty;
exports.isObjectTypeAnnotation = isObjectTypeAnnotation;
exports.isObjectTypeCallProperty = isObjectTypeCallProperty;
exports.isObjectTypeIndexer = isObjectTypeIndexer;
exports.isObjectTypeInternalSlot = isObjectTypeInternalSlot;
exports.isObjectTypeProperty = isObjectTypeProperty;
exports.isObjectTypeSpreadProperty = isObjectTypeSpreadProperty;
exports.isOpaqueType = isOpaqueType;
exports.isOptionalCallExpression = isOptionalCallExpression;
exports.isOptionalIndexedAccessType = isOptionalIndexedAccessType;
exports.isOptionalMemberExpression = isOptionalMemberExpression;
exports.isParenthesizedExpression = isParenthesizedExpression;
exports.isPattern = isPattern;
exports.isPatternLike = isPatternLike;
exports.isPipelineBareFunction = isPipelineBareFunction;
exports.isPipelinePrimaryTopicReference = isPipelinePrimaryTopicReference;
exports.isPipelineTopicExpression = isPipelineTopicExpression;
exports.isPlaceholder = isPlaceholder;
exports.isPrivate = isPrivate;
exports.isPrivateName = isPrivateName;
exports.isProgram = isProgram;
exports.isProperty = isProperty;
exports.isPureish = isPureish;
exports.isQualifiedTypeIdentifier = isQualifiedTypeIdentifier;
exports.isRecordExpression = isRecordExpression;
exports.isRegExpLiteral = isRegExpLiteral;
exports.isRegexLiteral = isRegexLiteral;
exports.isRestElement = isRestElement;
exports.isRestProperty = isRestProperty;
exports.isReturnStatement = isReturnStatement;
exports.isScopable = isScopable;
exports.isSequenceExpression = isSequenceExpression;
exports.isSpreadElement = isSpreadElement;
exports.isSpreadProperty = isSpreadProperty;
exports.isStandardized = isStandardized;
exports.isStatement = isStatement;
exports.isStaticBlock = isStaticBlock;
exports.isStringLiteral = isStringLiteral;
exports.isStringLiteralTypeAnnotation = isStringLiteralTypeAnnotation;
exports.isStringTypeAnnotation = isStringTypeAnnotation;
exports.isSuper = isSuper;
exports.isSwitchCase = isSwitchCase;
exports.isSwitchStatement = isSwitchStatement;
exports.isSymbolTypeAnnotation = isSymbolTypeAnnotation;
exports.isTSAnyKeyword = isTSAnyKeyword;
exports.isTSArrayType = isTSArrayType;
exports.isTSAsExpression = isTSAsExpression;
exports.isTSBaseType = isTSBaseType;
exports.isTSBigIntKeyword = isTSBigIntKeyword;
exports.isTSBooleanKeyword = isTSBooleanKeyword;
exports.isTSCallSignatureDeclaration = isTSCallSignatureDeclaration;
exports.isTSConditionalType = isTSConditionalType;
exports.isTSConstructSignatureDeclaration = isTSConstructSignatureDeclaration;
exports.isTSConstructorType = isTSConstructorType;
exports.isTSDeclareFunction = isTSDeclareFunction;
exports.isTSDeclareMethod = isTSDeclareMethod;
exports.isTSEntityName = isTSEntityName;
exports.isTSEnumDeclaration = isTSEnumDeclaration;
exports.isTSEnumMember = isTSEnumMember;
exports.isTSExportAssignment = isTSExportAssignment;
exports.isTSExpressionWithTypeArguments = isTSExpressionWithTypeArguments;
exports.isTSExternalModuleReference = isTSExternalModuleReference;
exports.isTSFunctionType = isTSFunctionType;
exports.isTSImportEqualsDeclaration = isTSImportEqualsDeclaration;
exports.isTSImportType = isTSImportType;
exports.isTSIndexSignature = isTSIndexSignature;
exports.isTSIndexedAccessType = isTSIndexedAccessType;
exports.isTSInferType = isTSInferType;
exports.isTSInstantiationExpression = isTSInstantiationExpression;
exports.isTSInterfaceBody = isTSInterfaceBody;
exports.isTSInterfaceDeclaration = isTSInterfaceDeclaration;
exports.isTSIntersectionType = isTSIntersectionType;
exports.isTSIntrinsicKeyword = isTSIntrinsicKeyword;
exports.isTSLiteralType = isTSLiteralType;
exports.isTSMappedType = isTSMappedType;
exports.isTSMethodSignature = isTSMethodSignature;
exports.isTSModuleBlock = isTSModuleBlock;
exports.isTSModuleDeclaration = isTSModuleDeclaration;
exports.isTSNamedTupleMember = isTSNamedTupleMember;
exports.isTSNamespaceExportDeclaration = isTSNamespaceExportDeclaration;
exports.isTSNeverKeyword = isTSNeverKeyword;
exports.isTSNonNullExpression = isTSNonNullExpression;
exports.isTSNullKeyword = isTSNullKeyword;
exports.isTSNumberKeyword = isTSNumberKeyword;
exports.isTSObjectKeyword = isTSObjectKeyword;
exports.isTSOptionalType = isTSOptionalType;
exports.isTSParameterProperty = isTSParameterProperty;
exports.isTSParenthesizedType = isTSParenthesizedType;
exports.isTSPropertySignature = isTSPropertySignature;
exports.isTSQualifiedName = isTSQualifiedName;
exports.isTSRestType = isTSRestType;
exports.isTSStringKeyword = isTSStringKeyword;
exports.isTSSymbolKeyword = isTSSymbolKeyword;
exports.isTSThisType = isTSThisType;
exports.isTSTupleType = isTSTupleType;
exports.isTSType = isTSType;
exports.isTSTypeAliasDeclaration = isTSTypeAliasDeclaration;
exports.isTSTypeAnnotation = isTSTypeAnnotation;
exports.isTSTypeAssertion = isTSTypeAssertion;
exports.isTSTypeElement = isTSTypeElement;
exports.isTSTypeLiteral = isTSTypeLiteral;
exports.isTSTypeOperator = isTSTypeOperator;
exports.isTSTypeParameter = isTSTypeParameter;
exports.isTSTypeParameterDeclaration = isTSTypeParameterDeclaration;
exports.isTSTypeParameterInstantiation = isTSTypeParameterInstantiation;
exports.isTSTypePredicate = isTSTypePredicate;
exports.isTSTypeQuery = isTSTypeQuery;
exports.isTSTypeReference = isTSTypeReference;
exports.isTSUndefinedKeyword = isTSUndefinedKeyword;
exports.isTSUnionType = isTSUnionType;
exports.isTSUnknownKeyword = isTSUnknownKeyword;
exports.isTSVoidKeyword = isTSVoidKeyword;
exports.isTaggedTemplateExpression = isTaggedTemplateExpression;
exports.isTemplateElement = isTemplateElement;
exports.isTemplateLiteral = isTemplateLiteral;
exports.isTerminatorless = isTerminatorless;
exports.isThisExpression = isThisExpression;
exports.isThisTypeAnnotation = isThisTypeAnnotation;
exports.isThrowStatement = isThrowStatement;
exports.isTopicReference = isTopicReference;
exports.isTryStatement = isTryStatement;
exports.isTupleExpression = isTupleExpression;
exports.isTupleTypeAnnotation = isTupleTypeAnnotation;
exports.isTypeAlias = isTypeAlias;
exports.isTypeAnnotation = isTypeAnnotation;
exports.isTypeCastExpression = isTypeCastExpression;
exports.isTypeParameter = isTypeParameter;
exports.isTypeParameterDeclaration = isTypeParameterDeclaration;
exports.isTypeParameterInstantiation = isTypeParameterInstantiation;
exports.isTypeScript = isTypeScript;
exports.isTypeofTypeAnnotation = isTypeofTypeAnnotation;
exports.isUnaryExpression = isUnaryExpression;
exports.isUnaryLike = isUnaryLike;
exports.isUnionTypeAnnotation = isUnionTypeAnnotation;
exports.isUpdateExpression = isUpdateExpression;
exports.isUserWhitespacable = isUserWhitespacable;
exports.isV8IntrinsicIdentifier = isV8IntrinsicIdentifier;
exports.isVariableDeclaration = isVariableDeclaration;
exports.isVariableDeclarator = isVariableDeclarator;
exports.isVariance = isVariance;
exports.isVoidTypeAnnotation = isVoidTypeAnnotation;
exports.isWhile = isWhile;
exports.isWhileStatement = isWhileStatement;
exports.isWithStatement = isWithStatement;
exports.isYieldExpression = isYieldExpression;

var _shallowEqual = __webpack_require__(51);

function isArrayExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ArrayExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isAssignmentExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "AssignmentExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isBinaryExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "BinaryExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isInterpreterDirective(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "InterpreterDirective") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDirective(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "Directive") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDirectiveLiteral(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DirectiveLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isBlockStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "BlockStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isBreakStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "BreakStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isCallExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "CallExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isCatchClause(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "CatchClause") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isConditionalExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ConditionalExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isContinueStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ContinueStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDebuggerStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DebuggerStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDoWhileStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DoWhileStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isEmptyStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "EmptyStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isExpressionStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ExpressionStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isFile(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "File") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isForInStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ForInStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isForStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ForStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isFunctionDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "FunctionDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isFunctionExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "FunctionExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isIdentifier(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "Identifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isIfStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "IfStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isLabeledStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "LabeledStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isStringLiteral(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "StringLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isNumericLiteral(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "NumericLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isNullLiteral(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "NullLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isBooleanLiteral(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "BooleanLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isRegExpLiteral(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "RegExpLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isLogicalExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "LogicalExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isMemberExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "MemberExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isNewExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "NewExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isProgram(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "Program") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isObjectExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ObjectExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isObjectMethod(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ObjectMethod") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isObjectProperty(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ObjectProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isRestElement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "RestElement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isReturnStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ReturnStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isSequenceExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "SequenceExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isParenthesizedExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ParenthesizedExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isSwitchCase(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "SwitchCase") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isSwitchStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "SwitchStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isThisExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ThisExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isThrowStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ThrowStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTryStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TryStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isUnaryExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "UnaryExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isUpdateExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "UpdateExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isVariableDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "VariableDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isVariableDeclarator(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "VariableDeclarator") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isWhileStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "WhileStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isWithStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "WithStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isAssignmentPattern(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "AssignmentPattern") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isArrayPattern(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ArrayPattern") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isArrowFunctionExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ArrowFunctionExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isClassBody(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ClassBody") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isClassExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ClassExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isClassDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ClassDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isExportAllDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ExportAllDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isExportDefaultDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ExportDefaultDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isExportNamedDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ExportNamedDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isExportSpecifier(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ExportSpecifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isForOfStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ForOfStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isImportDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ImportDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isImportDefaultSpecifier(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ImportDefaultSpecifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isImportNamespaceSpecifier(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ImportNamespaceSpecifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isImportSpecifier(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ImportSpecifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isMetaProperty(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "MetaProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isClassMethod(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ClassMethod") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isObjectPattern(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ObjectPattern") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isSpreadElement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "SpreadElement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isSuper(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "Super") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTaggedTemplateExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TaggedTemplateExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTemplateElement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TemplateElement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTemplateLiteral(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TemplateLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isYieldExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "YieldExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isAwaitExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "AwaitExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isImport(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "Import") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isBigIntLiteral(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "BigIntLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isExportNamespaceSpecifier(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ExportNamespaceSpecifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isOptionalMemberExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "OptionalMemberExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isOptionalCallExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "OptionalCallExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isClassProperty(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ClassProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isClassAccessorProperty(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ClassAccessorProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isClassPrivateProperty(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ClassPrivateProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isClassPrivateMethod(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ClassPrivateMethod") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isPrivateName(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "PrivateName") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isStaticBlock(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "StaticBlock") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isAnyTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "AnyTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isArrayTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ArrayTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isBooleanTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "BooleanTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isBooleanLiteralTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "BooleanLiteralTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isNullLiteralTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "NullLiteralTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isClassImplements(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ClassImplements") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDeclareClass(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DeclareClass") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDeclareFunction(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DeclareFunction") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDeclareInterface(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DeclareInterface") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDeclareModule(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DeclareModule") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDeclareModuleExports(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DeclareModuleExports") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDeclareTypeAlias(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DeclareTypeAlias") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDeclareOpaqueType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DeclareOpaqueType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDeclareVariable(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DeclareVariable") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDeclareExportDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DeclareExportDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDeclareExportAllDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DeclareExportAllDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDeclaredPredicate(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DeclaredPredicate") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isExistsTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ExistsTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isFunctionTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "FunctionTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isFunctionTypeParam(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "FunctionTypeParam") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isGenericTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "GenericTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isInferredPredicate(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "InferredPredicate") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isInterfaceExtends(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "InterfaceExtends") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isInterfaceDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "InterfaceDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isInterfaceTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "InterfaceTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isIntersectionTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "IntersectionTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isMixedTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "MixedTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isEmptyTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "EmptyTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isNullableTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "NullableTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isNumberLiteralTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "NumberLiteralTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isNumberTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "NumberTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isObjectTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ObjectTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isObjectTypeInternalSlot(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ObjectTypeInternalSlot") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isObjectTypeCallProperty(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ObjectTypeCallProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isObjectTypeIndexer(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ObjectTypeIndexer") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isObjectTypeProperty(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ObjectTypeProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isObjectTypeSpreadProperty(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ObjectTypeSpreadProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isOpaqueType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "OpaqueType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isQualifiedTypeIdentifier(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "QualifiedTypeIdentifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isStringLiteralTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "StringLiteralTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isStringTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "StringTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isSymbolTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "SymbolTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isThisTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ThisTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTupleTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TupleTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTypeofTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TypeofTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTypeAlias(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TypeAlias") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTypeCastExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TypeCastExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTypeParameter(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TypeParameter") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTypeParameterDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TypeParameterDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTypeParameterInstantiation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TypeParameterInstantiation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isUnionTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "UnionTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isVariance(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "Variance") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isVoidTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "VoidTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isEnumDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "EnumDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isEnumBooleanBody(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "EnumBooleanBody") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isEnumNumberBody(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "EnumNumberBody") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isEnumStringBody(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "EnumStringBody") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isEnumSymbolBody(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "EnumSymbolBody") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isEnumBooleanMember(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "EnumBooleanMember") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isEnumNumberMember(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "EnumNumberMember") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isEnumStringMember(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "EnumStringMember") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isEnumDefaultedMember(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "EnumDefaultedMember") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isIndexedAccessType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "IndexedAccessType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isOptionalIndexedAccessType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "OptionalIndexedAccessType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSXAttribute(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "JSXAttribute") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSXClosingElement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "JSXClosingElement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSXElement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "JSXElement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSXEmptyExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "JSXEmptyExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSXExpressionContainer(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "JSXExpressionContainer") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSXSpreadChild(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "JSXSpreadChild") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSXIdentifier(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "JSXIdentifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSXMemberExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "JSXMemberExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSXNamespacedName(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "JSXNamespacedName") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSXOpeningElement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "JSXOpeningElement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSXSpreadAttribute(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "JSXSpreadAttribute") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSXText(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "JSXText") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSXFragment(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "JSXFragment") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSXOpeningFragment(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "JSXOpeningFragment") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSXClosingFragment(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "JSXClosingFragment") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isNoop(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "Noop") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isPlaceholder(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "Placeholder") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isV8IntrinsicIdentifier(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "V8IntrinsicIdentifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isArgumentPlaceholder(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ArgumentPlaceholder") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isBindExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "BindExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isImportAttribute(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ImportAttribute") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDecorator(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "Decorator") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDoExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DoExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isExportDefaultSpecifier(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ExportDefaultSpecifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isRecordExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "RecordExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTupleExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TupleExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDecimalLiteral(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "DecimalLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isModuleExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "ModuleExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTopicReference(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TopicReference") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isPipelineTopicExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "PipelineTopicExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isPipelineBareFunction(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "PipelineBareFunction") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isPipelinePrimaryTopicReference(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "PipelinePrimaryTopicReference") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSParameterProperty(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSParameterProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSDeclareFunction(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSDeclareFunction") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSDeclareMethod(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSDeclareMethod") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSQualifiedName(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSQualifiedName") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSCallSignatureDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSCallSignatureDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSConstructSignatureDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSConstructSignatureDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSPropertySignature(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSPropertySignature") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSMethodSignature(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSMethodSignature") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSIndexSignature(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSIndexSignature") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSAnyKeyword(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSAnyKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSBooleanKeyword(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSBooleanKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSBigIntKeyword(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSBigIntKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSIntrinsicKeyword(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSIntrinsicKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSNeverKeyword(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSNeverKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSNullKeyword(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSNullKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSNumberKeyword(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSNumberKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSObjectKeyword(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSObjectKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSStringKeyword(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSStringKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSSymbolKeyword(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSSymbolKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSUndefinedKeyword(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSUndefinedKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSUnknownKeyword(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSUnknownKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSVoidKeyword(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSVoidKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSThisType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSThisType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSFunctionType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSFunctionType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSConstructorType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSConstructorType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSTypeReference(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSTypeReference") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSTypePredicate(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSTypePredicate") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSTypeQuery(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSTypeQuery") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSTypeLiteral(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSTypeLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSArrayType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSArrayType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSTupleType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSTupleType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSOptionalType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSOptionalType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSRestType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSRestType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSNamedTupleMember(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSNamedTupleMember") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSUnionType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSUnionType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSIntersectionType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSIntersectionType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSConditionalType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSConditionalType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSInferType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSInferType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSParenthesizedType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSParenthesizedType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSTypeOperator(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSTypeOperator") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSIndexedAccessType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSIndexedAccessType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSMappedType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSMappedType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSLiteralType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSLiteralType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSExpressionWithTypeArguments(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSExpressionWithTypeArguments") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSInterfaceDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSInterfaceDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSInterfaceBody(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSInterfaceBody") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSTypeAliasDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSTypeAliasDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSInstantiationExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSInstantiationExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSAsExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSAsExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSTypeAssertion(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSTypeAssertion") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSEnumDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSEnumDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSEnumMember(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSEnumMember") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSModuleDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSModuleDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSModuleBlock(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSModuleBlock") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSImportType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSImportType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSImportEqualsDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSImportEqualsDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSExternalModuleReference(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSExternalModuleReference") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSNonNullExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSNonNullExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSExportAssignment(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSExportAssignment") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSNamespaceExportDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSNamespaceExportDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSTypeAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSTypeParameterInstantiation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSTypeParameterInstantiation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSTypeParameterDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSTypeParameterDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSTypeParameter(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "TSTypeParameter") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isStandardized(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ArrayExpression" === nodeType || "AssignmentExpression" === nodeType || "BinaryExpression" === nodeType || "InterpreterDirective" === nodeType || "Directive" === nodeType || "DirectiveLiteral" === nodeType || "BlockStatement" === nodeType || "BreakStatement" === nodeType || "CallExpression" === nodeType || "CatchClause" === nodeType || "ConditionalExpression" === nodeType || "ContinueStatement" === nodeType || "DebuggerStatement" === nodeType || "DoWhileStatement" === nodeType || "EmptyStatement" === nodeType || "ExpressionStatement" === nodeType || "File" === nodeType || "ForInStatement" === nodeType || "ForStatement" === nodeType || "FunctionDeclaration" === nodeType || "FunctionExpression" === nodeType || "Identifier" === nodeType || "IfStatement" === nodeType || "LabeledStatement" === nodeType || "StringLiteral" === nodeType || "NumericLiteral" === nodeType || "NullLiteral" === nodeType || "BooleanLiteral" === nodeType || "RegExpLiteral" === nodeType || "LogicalExpression" === nodeType || "MemberExpression" === nodeType || "NewExpression" === nodeType || "Program" === nodeType || "ObjectExpression" === nodeType || "ObjectMethod" === nodeType || "ObjectProperty" === nodeType || "RestElement" === nodeType || "ReturnStatement" === nodeType || "SequenceExpression" === nodeType || "ParenthesizedExpression" === nodeType || "SwitchCase" === nodeType || "SwitchStatement" === nodeType || "ThisExpression" === nodeType || "ThrowStatement" === nodeType || "TryStatement" === nodeType || "UnaryExpression" === nodeType || "UpdateExpression" === nodeType || "VariableDeclaration" === nodeType || "VariableDeclarator" === nodeType || "WhileStatement" === nodeType || "WithStatement" === nodeType || "AssignmentPattern" === nodeType || "ArrayPattern" === nodeType || "ArrowFunctionExpression" === nodeType || "ClassBody" === nodeType || "ClassExpression" === nodeType || "ClassDeclaration" === nodeType || "ExportAllDeclaration" === nodeType || "ExportDefaultDeclaration" === nodeType || "ExportNamedDeclaration" === nodeType || "ExportSpecifier" === nodeType || "ForOfStatement" === nodeType || "ImportDeclaration" === nodeType || "ImportDefaultSpecifier" === nodeType || "ImportNamespaceSpecifier" === nodeType || "ImportSpecifier" === nodeType || "MetaProperty" === nodeType || "ClassMethod" === nodeType || "ObjectPattern" === nodeType || "SpreadElement" === nodeType || "Super" === nodeType || "TaggedTemplateExpression" === nodeType || "TemplateElement" === nodeType || "TemplateLiteral" === nodeType || "YieldExpression" === nodeType || "AwaitExpression" === nodeType || "Import" === nodeType || "BigIntLiteral" === nodeType || "ExportNamespaceSpecifier" === nodeType || "OptionalMemberExpression" === nodeType || "OptionalCallExpression" === nodeType || "ClassProperty" === nodeType || "ClassAccessorProperty" === nodeType || "ClassPrivateProperty" === nodeType || "ClassPrivateMethod" === nodeType || "PrivateName" === nodeType || "StaticBlock" === nodeType || nodeType === "Placeholder" && ("Identifier" === node.expectedNode || "StringLiteral" === node.expectedNode || "BlockStatement" === node.expectedNode || "ClassBody" === node.expectedNode)) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isExpression(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ArrayExpression" === nodeType || "AssignmentExpression" === nodeType || "BinaryExpression" === nodeType || "CallExpression" === nodeType || "ConditionalExpression" === nodeType || "FunctionExpression" === nodeType || "Identifier" === nodeType || "StringLiteral" === nodeType || "NumericLiteral" === nodeType || "NullLiteral" === nodeType || "BooleanLiteral" === nodeType || "RegExpLiteral" === nodeType || "LogicalExpression" === nodeType || "MemberExpression" === nodeType || "NewExpression" === nodeType || "ObjectExpression" === nodeType || "SequenceExpression" === nodeType || "ParenthesizedExpression" === nodeType || "ThisExpression" === nodeType || "UnaryExpression" === nodeType || "UpdateExpression" === nodeType || "ArrowFunctionExpression" === nodeType || "ClassExpression" === nodeType || "MetaProperty" === nodeType || "Super" === nodeType || "TaggedTemplateExpression" === nodeType || "TemplateLiteral" === nodeType || "YieldExpression" === nodeType || "AwaitExpression" === nodeType || "Import" === nodeType || "BigIntLiteral" === nodeType || "OptionalMemberExpression" === nodeType || "OptionalCallExpression" === nodeType || "TypeCastExpression" === nodeType || "JSXElement" === nodeType || "JSXFragment" === nodeType || "BindExpression" === nodeType || "DoExpression" === nodeType || "RecordExpression" === nodeType || "TupleExpression" === nodeType || "DecimalLiteral" === nodeType || "ModuleExpression" === nodeType || "TopicReference" === nodeType || "PipelineTopicExpression" === nodeType || "PipelineBareFunction" === nodeType || "PipelinePrimaryTopicReference" === nodeType || "TSInstantiationExpression" === nodeType || "TSAsExpression" === nodeType || "TSTypeAssertion" === nodeType || "TSNonNullExpression" === nodeType || nodeType === "Placeholder" && ("Expression" === node.expectedNode || "Identifier" === node.expectedNode || "StringLiteral" === node.expectedNode)) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isBinary(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("BinaryExpression" === nodeType || "LogicalExpression" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isScopable(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("BlockStatement" === nodeType || "CatchClause" === nodeType || "DoWhileStatement" === nodeType || "ForInStatement" === nodeType || "ForStatement" === nodeType || "FunctionDeclaration" === nodeType || "FunctionExpression" === nodeType || "Program" === nodeType || "ObjectMethod" === nodeType || "SwitchStatement" === nodeType || "WhileStatement" === nodeType || "ArrowFunctionExpression" === nodeType || "ClassExpression" === nodeType || "ClassDeclaration" === nodeType || "ForOfStatement" === nodeType || "ClassMethod" === nodeType || "ClassPrivateMethod" === nodeType || "StaticBlock" === nodeType || "TSModuleBlock" === nodeType || nodeType === "Placeholder" && "BlockStatement" === node.expectedNode) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isBlockParent(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("BlockStatement" === nodeType || "CatchClause" === nodeType || "DoWhileStatement" === nodeType || "ForInStatement" === nodeType || "ForStatement" === nodeType || "FunctionDeclaration" === nodeType || "FunctionExpression" === nodeType || "Program" === nodeType || "ObjectMethod" === nodeType || "SwitchStatement" === nodeType || "WhileStatement" === nodeType || "ArrowFunctionExpression" === nodeType || "ForOfStatement" === nodeType || "ClassMethod" === nodeType || "ClassPrivateMethod" === nodeType || "StaticBlock" === nodeType || "TSModuleBlock" === nodeType || nodeType === "Placeholder" && "BlockStatement" === node.expectedNode) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isBlock(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("BlockStatement" === nodeType || "Program" === nodeType || "TSModuleBlock" === nodeType || nodeType === "Placeholder" && "BlockStatement" === node.expectedNode) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("BlockStatement" === nodeType || "BreakStatement" === nodeType || "ContinueStatement" === nodeType || "DebuggerStatement" === nodeType || "DoWhileStatement" === nodeType || "EmptyStatement" === nodeType || "ExpressionStatement" === nodeType || "ForInStatement" === nodeType || "ForStatement" === nodeType || "FunctionDeclaration" === nodeType || "IfStatement" === nodeType || "LabeledStatement" === nodeType || "ReturnStatement" === nodeType || "SwitchStatement" === nodeType || "ThrowStatement" === nodeType || "TryStatement" === nodeType || "VariableDeclaration" === nodeType || "WhileStatement" === nodeType || "WithStatement" === nodeType || "ClassDeclaration" === nodeType || "ExportAllDeclaration" === nodeType || "ExportDefaultDeclaration" === nodeType || "ExportNamedDeclaration" === nodeType || "ForOfStatement" === nodeType || "ImportDeclaration" === nodeType || "DeclareClass" === nodeType || "DeclareFunction" === nodeType || "DeclareInterface" === nodeType || "DeclareModule" === nodeType || "DeclareModuleExports" === nodeType || "DeclareTypeAlias" === nodeType || "DeclareOpaqueType" === nodeType || "DeclareVariable" === nodeType || "DeclareExportDeclaration" === nodeType || "DeclareExportAllDeclaration" === nodeType || "InterfaceDeclaration" === nodeType || "OpaqueType" === nodeType || "TypeAlias" === nodeType || "EnumDeclaration" === nodeType || "TSDeclareFunction" === nodeType || "TSInterfaceDeclaration" === nodeType || "TSTypeAliasDeclaration" === nodeType || "TSEnumDeclaration" === nodeType || "TSModuleDeclaration" === nodeType || "TSImportEqualsDeclaration" === nodeType || "TSExportAssignment" === nodeType || "TSNamespaceExportDeclaration" === nodeType || nodeType === "Placeholder" && ("Statement" === node.expectedNode || "Declaration" === node.expectedNode || "BlockStatement" === node.expectedNode)) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTerminatorless(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("BreakStatement" === nodeType || "ContinueStatement" === nodeType || "ReturnStatement" === nodeType || "ThrowStatement" === nodeType || "YieldExpression" === nodeType || "AwaitExpression" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isCompletionStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("BreakStatement" === nodeType || "ContinueStatement" === nodeType || "ReturnStatement" === nodeType || "ThrowStatement" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isConditional(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ConditionalExpression" === nodeType || "IfStatement" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isLoop(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("DoWhileStatement" === nodeType || "ForInStatement" === nodeType || "ForStatement" === nodeType || "WhileStatement" === nodeType || "ForOfStatement" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isWhile(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("DoWhileStatement" === nodeType || "WhileStatement" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isExpressionWrapper(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ExpressionStatement" === nodeType || "ParenthesizedExpression" === nodeType || "TypeCastExpression" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isFor(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ForInStatement" === nodeType || "ForStatement" === nodeType || "ForOfStatement" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isForXStatement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ForInStatement" === nodeType || "ForOfStatement" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isFunction(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("FunctionDeclaration" === nodeType || "FunctionExpression" === nodeType || "ObjectMethod" === nodeType || "ArrowFunctionExpression" === nodeType || "ClassMethod" === nodeType || "ClassPrivateMethod" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isFunctionParent(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("FunctionDeclaration" === nodeType || "FunctionExpression" === nodeType || "ObjectMethod" === nodeType || "ArrowFunctionExpression" === nodeType || "ClassMethod" === nodeType || "ClassPrivateMethod" === nodeType || "StaticBlock" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isPureish(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("FunctionDeclaration" === nodeType || "FunctionExpression" === nodeType || "StringLiteral" === nodeType || "NumericLiteral" === nodeType || "NullLiteral" === nodeType || "BooleanLiteral" === nodeType || "RegExpLiteral" === nodeType || "ArrowFunctionExpression" === nodeType || "BigIntLiteral" === nodeType || "DecimalLiteral" === nodeType || nodeType === "Placeholder" && "StringLiteral" === node.expectedNode) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("FunctionDeclaration" === nodeType || "VariableDeclaration" === nodeType || "ClassDeclaration" === nodeType || "ExportAllDeclaration" === nodeType || "ExportDefaultDeclaration" === nodeType || "ExportNamedDeclaration" === nodeType || "ImportDeclaration" === nodeType || "DeclareClass" === nodeType || "DeclareFunction" === nodeType || "DeclareInterface" === nodeType || "DeclareModule" === nodeType || "DeclareModuleExports" === nodeType || "DeclareTypeAlias" === nodeType || "DeclareOpaqueType" === nodeType || "DeclareVariable" === nodeType || "DeclareExportDeclaration" === nodeType || "DeclareExportAllDeclaration" === nodeType || "InterfaceDeclaration" === nodeType || "OpaqueType" === nodeType || "TypeAlias" === nodeType || "EnumDeclaration" === nodeType || "TSDeclareFunction" === nodeType || "TSInterfaceDeclaration" === nodeType || "TSTypeAliasDeclaration" === nodeType || "TSEnumDeclaration" === nodeType || "TSModuleDeclaration" === nodeType || nodeType === "Placeholder" && "Declaration" === node.expectedNode) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isPatternLike(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("Identifier" === nodeType || "RestElement" === nodeType || "AssignmentPattern" === nodeType || "ArrayPattern" === nodeType || "ObjectPattern" === nodeType || "TSAsExpression" === nodeType || "TSTypeAssertion" === nodeType || "TSNonNullExpression" === nodeType || nodeType === "Placeholder" && ("Pattern" === node.expectedNode || "Identifier" === node.expectedNode)) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isLVal(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("Identifier" === nodeType || "MemberExpression" === nodeType || "RestElement" === nodeType || "AssignmentPattern" === nodeType || "ArrayPattern" === nodeType || "ObjectPattern" === nodeType || "TSParameterProperty" === nodeType || "TSAsExpression" === nodeType || "TSTypeAssertion" === nodeType || "TSNonNullExpression" === nodeType || nodeType === "Placeholder" && ("Pattern" === node.expectedNode || "Identifier" === node.expectedNode)) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSEntityName(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("Identifier" === nodeType || "TSQualifiedName" === nodeType || nodeType === "Placeholder" && "Identifier" === node.expectedNode) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isLiteral(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("StringLiteral" === nodeType || "NumericLiteral" === nodeType || "NullLiteral" === nodeType || "BooleanLiteral" === nodeType || "RegExpLiteral" === nodeType || "TemplateLiteral" === nodeType || "BigIntLiteral" === nodeType || "DecimalLiteral" === nodeType || nodeType === "Placeholder" && "StringLiteral" === node.expectedNode) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isImmutable(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("StringLiteral" === nodeType || "NumericLiteral" === nodeType || "NullLiteral" === nodeType || "BooleanLiteral" === nodeType || "BigIntLiteral" === nodeType || "JSXAttribute" === nodeType || "JSXClosingElement" === nodeType || "JSXElement" === nodeType || "JSXExpressionContainer" === nodeType || "JSXSpreadChild" === nodeType || "JSXOpeningElement" === nodeType || "JSXText" === nodeType || "JSXFragment" === nodeType || "JSXOpeningFragment" === nodeType || "JSXClosingFragment" === nodeType || "DecimalLiteral" === nodeType || nodeType === "Placeholder" && "StringLiteral" === node.expectedNode) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isUserWhitespacable(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ObjectMethod" === nodeType || "ObjectProperty" === nodeType || "ObjectTypeInternalSlot" === nodeType || "ObjectTypeCallProperty" === nodeType || "ObjectTypeIndexer" === nodeType || "ObjectTypeProperty" === nodeType || "ObjectTypeSpreadProperty" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isMethod(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ObjectMethod" === nodeType || "ClassMethod" === nodeType || "ClassPrivateMethod" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isObjectMember(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ObjectMethod" === nodeType || "ObjectProperty" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isProperty(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ObjectProperty" === nodeType || "ClassProperty" === nodeType || "ClassAccessorProperty" === nodeType || "ClassPrivateProperty" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isUnaryLike(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("UnaryExpression" === nodeType || "SpreadElement" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isPattern(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("AssignmentPattern" === nodeType || "ArrayPattern" === nodeType || "ObjectPattern" === nodeType || nodeType === "Placeholder" && "Pattern" === node.expectedNode) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isClass(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ClassExpression" === nodeType || "ClassDeclaration" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isModuleDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ExportAllDeclaration" === nodeType || "ExportDefaultDeclaration" === nodeType || "ExportNamedDeclaration" === nodeType || "ImportDeclaration" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isExportDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ExportAllDeclaration" === nodeType || "ExportDefaultDeclaration" === nodeType || "ExportNamedDeclaration" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isModuleSpecifier(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ExportSpecifier" === nodeType || "ImportDefaultSpecifier" === nodeType || "ImportNamespaceSpecifier" === nodeType || "ImportSpecifier" === nodeType || "ExportNamespaceSpecifier" === nodeType || "ExportDefaultSpecifier" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isAccessor(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ClassAccessorProperty" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isPrivate(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("ClassPrivateProperty" === nodeType || "ClassPrivateMethod" === nodeType || "PrivateName" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isFlow(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("AnyTypeAnnotation" === nodeType || "ArrayTypeAnnotation" === nodeType || "BooleanTypeAnnotation" === nodeType || "BooleanLiteralTypeAnnotation" === nodeType || "NullLiteralTypeAnnotation" === nodeType || "ClassImplements" === nodeType || "DeclareClass" === nodeType || "DeclareFunction" === nodeType || "DeclareInterface" === nodeType || "DeclareModule" === nodeType || "DeclareModuleExports" === nodeType || "DeclareTypeAlias" === nodeType || "DeclareOpaqueType" === nodeType || "DeclareVariable" === nodeType || "DeclareExportDeclaration" === nodeType || "DeclareExportAllDeclaration" === nodeType || "DeclaredPredicate" === nodeType || "ExistsTypeAnnotation" === nodeType || "FunctionTypeAnnotation" === nodeType || "FunctionTypeParam" === nodeType || "GenericTypeAnnotation" === nodeType || "InferredPredicate" === nodeType || "InterfaceExtends" === nodeType || "InterfaceDeclaration" === nodeType || "InterfaceTypeAnnotation" === nodeType || "IntersectionTypeAnnotation" === nodeType || "MixedTypeAnnotation" === nodeType || "EmptyTypeAnnotation" === nodeType || "NullableTypeAnnotation" === nodeType || "NumberLiteralTypeAnnotation" === nodeType || "NumberTypeAnnotation" === nodeType || "ObjectTypeAnnotation" === nodeType || "ObjectTypeInternalSlot" === nodeType || "ObjectTypeCallProperty" === nodeType || "ObjectTypeIndexer" === nodeType || "ObjectTypeProperty" === nodeType || "ObjectTypeSpreadProperty" === nodeType || "OpaqueType" === nodeType || "QualifiedTypeIdentifier" === nodeType || "StringLiteralTypeAnnotation" === nodeType || "StringTypeAnnotation" === nodeType || "SymbolTypeAnnotation" === nodeType || "ThisTypeAnnotation" === nodeType || "TupleTypeAnnotation" === nodeType || "TypeofTypeAnnotation" === nodeType || "TypeAlias" === nodeType || "TypeAnnotation" === nodeType || "TypeCastExpression" === nodeType || "TypeParameter" === nodeType || "TypeParameterDeclaration" === nodeType || "TypeParameterInstantiation" === nodeType || "UnionTypeAnnotation" === nodeType || "Variance" === nodeType || "VoidTypeAnnotation" === nodeType || "EnumDeclaration" === nodeType || "EnumBooleanBody" === nodeType || "EnumNumberBody" === nodeType || "EnumStringBody" === nodeType || "EnumSymbolBody" === nodeType || "EnumBooleanMember" === nodeType || "EnumNumberMember" === nodeType || "EnumStringMember" === nodeType || "EnumDefaultedMember" === nodeType || "IndexedAccessType" === nodeType || "OptionalIndexedAccessType" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isFlowType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("AnyTypeAnnotation" === nodeType || "ArrayTypeAnnotation" === nodeType || "BooleanTypeAnnotation" === nodeType || "BooleanLiteralTypeAnnotation" === nodeType || "NullLiteralTypeAnnotation" === nodeType || "ExistsTypeAnnotation" === nodeType || "FunctionTypeAnnotation" === nodeType || "GenericTypeAnnotation" === nodeType || "InterfaceTypeAnnotation" === nodeType || "IntersectionTypeAnnotation" === nodeType || "MixedTypeAnnotation" === nodeType || "EmptyTypeAnnotation" === nodeType || "NullableTypeAnnotation" === nodeType || "NumberLiteralTypeAnnotation" === nodeType || "NumberTypeAnnotation" === nodeType || "ObjectTypeAnnotation" === nodeType || "StringLiteralTypeAnnotation" === nodeType || "StringTypeAnnotation" === nodeType || "SymbolTypeAnnotation" === nodeType || "ThisTypeAnnotation" === nodeType || "TupleTypeAnnotation" === nodeType || "TypeofTypeAnnotation" === nodeType || "UnionTypeAnnotation" === nodeType || "VoidTypeAnnotation" === nodeType || "IndexedAccessType" === nodeType || "OptionalIndexedAccessType" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isFlowBaseAnnotation(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("AnyTypeAnnotation" === nodeType || "BooleanTypeAnnotation" === nodeType || "NullLiteralTypeAnnotation" === nodeType || "MixedTypeAnnotation" === nodeType || "EmptyTypeAnnotation" === nodeType || "NumberTypeAnnotation" === nodeType || "StringTypeAnnotation" === nodeType || "SymbolTypeAnnotation" === nodeType || "ThisTypeAnnotation" === nodeType || "VoidTypeAnnotation" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isFlowDeclaration(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("DeclareClass" === nodeType || "DeclareFunction" === nodeType || "DeclareInterface" === nodeType || "DeclareModule" === nodeType || "DeclareModuleExports" === nodeType || "DeclareTypeAlias" === nodeType || "DeclareOpaqueType" === nodeType || "DeclareVariable" === nodeType || "DeclareExportDeclaration" === nodeType || "DeclareExportAllDeclaration" === nodeType || "InterfaceDeclaration" === nodeType || "OpaqueType" === nodeType || "TypeAlias" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isFlowPredicate(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("DeclaredPredicate" === nodeType || "InferredPredicate" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isEnumBody(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("EnumBooleanBody" === nodeType || "EnumNumberBody" === nodeType || "EnumStringBody" === nodeType || "EnumSymbolBody" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isEnumMember(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("EnumBooleanMember" === nodeType || "EnumNumberMember" === nodeType || "EnumStringMember" === nodeType || "EnumDefaultedMember" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isJSX(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("JSXAttribute" === nodeType || "JSXClosingElement" === nodeType || "JSXElement" === nodeType || "JSXEmptyExpression" === nodeType || "JSXExpressionContainer" === nodeType || "JSXSpreadChild" === nodeType || "JSXIdentifier" === nodeType || "JSXMemberExpression" === nodeType || "JSXNamespacedName" === nodeType || "JSXOpeningElement" === nodeType || "JSXSpreadAttribute" === nodeType || "JSXText" === nodeType || "JSXFragment" === nodeType || "JSXOpeningFragment" === nodeType || "JSXClosingFragment" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isMiscellaneous(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("Noop" === nodeType || "Placeholder" === nodeType || "V8IntrinsicIdentifier" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTypeScript(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("TSParameterProperty" === nodeType || "TSDeclareFunction" === nodeType || "TSDeclareMethod" === nodeType || "TSQualifiedName" === nodeType || "TSCallSignatureDeclaration" === nodeType || "TSConstructSignatureDeclaration" === nodeType || "TSPropertySignature" === nodeType || "TSMethodSignature" === nodeType || "TSIndexSignature" === nodeType || "TSAnyKeyword" === nodeType || "TSBooleanKeyword" === nodeType || "TSBigIntKeyword" === nodeType || "TSIntrinsicKeyword" === nodeType || "TSNeverKeyword" === nodeType || "TSNullKeyword" === nodeType || "TSNumberKeyword" === nodeType || "TSObjectKeyword" === nodeType || "TSStringKeyword" === nodeType || "TSSymbolKeyword" === nodeType || "TSUndefinedKeyword" === nodeType || "TSUnknownKeyword" === nodeType || "TSVoidKeyword" === nodeType || "TSThisType" === nodeType || "TSFunctionType" === nodeType || "TSConstructorType" === nodeType || "TSTypeReference" === nodeType || "TSTypePredicate" === nodeType || "TSTypeQuery" === nodeType || "TSTypeLiteral" === nodeType || "TSArrayType" === nodeType || "TSTupleType" === nodeType || "TSOptionalType" === nodeType || "TSRestType" === nodeType || "TSNamedTupleMember" === nodeType || "TSUnionType" === nodeType || "TSIntersectionType" === nodeType || "TSConditionalType" === nodeType || "TSInferType" === nodeType || "TSParenthesizedType" === nodeType || "TSTypeOperator" === nodeType || "TSIndexedAccessType" === nodeType || "TSMappedType" === nodeType || "TSLiteralType" === nodeType || "TSExpressionWithTypeArguments" === nodeType || "TSInterfaceDeclaration" === nodeType || "TSInterfaceBody" === nodeType || "TSTypeAliasDeclaration" === nodeType || "TSInstantiationExpression" === nodeType || "TSAsExpression" === nodeType || "TSTypeAssertion" === nodeType || "TSEnumDeclaration" === nodeType || "TSEnumMember" === nodeType || "TSModuleDeclaration" === nodeType || "TSModuleBlock" === nodeType || "TSImportType" === nodeType || "TSImportEqualsDeclaration" === nodeType || "TSExternalModuleReference" === nodeType || "TSNonNullExpression" === nodeType || "TSExportAssignment" === nodeType || "TSNamespaceExportDeclaration" === nodeType || "TSTypeAnnotation" === nodeType || "TSTypeParameterInstantiation" === nodeType || "TSTypeParameterDeclaration" === nodeType || "TSTypeParameter" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSTypeElement(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("TSCallSignatureDeclaration" === nodeType || "TSConstructSignatureDeclaration" === nodeType || "TSPropertySignature" === nodeType || "TSMethodSignature" === nodeType || "TSIndexSignature" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("TSAnyKeyword" === nodeType || "TSBooleanKeyword" === nodeType || "TSBigIntKeyword" === nodeType || "TSIntrinsicKeyword" === nodeType || "TSNeverKeyword" === nodeType || "TSNullKeyword" === nodeType || "TSNumberKeyword" === nodeType || "TSObjectKeyword" === nodeType || "TSStringKeyword" === nodeType || "TSSymbolKeyword" === nodeType || "TSUndefinedKeyword" === nodeType || "TSUnknownKeyword" === nodeType || "TSVoidKeyword" === nodeType || "TSThisType" === nodeType || "TSFunctionType" === nodeType || "TSConstructorType" === nodeType || "TSTypeReference" === nodeType || "TSTypePredicate" === nodeType || "TSTypeQuery" === nodeType || "TSTypeLiteral" === nodeType || "TSArrayType" === nodeType || "TSTupleType" === nodeType || "TSOptionalType" === nodeType || "TSRestType" === nodeType || "TSUnionType" === nodeType || "TSIntersectionType" === nodeType || "TSConditionalType" === nodeType || "TSInferType" === nodeType || "TSParenthesizedType" === nodeType || "TSTypeOperator" === nodeType || "TSIndexedAccessType" === nodeType || "TSMappedType" === nodeType || "TSLiteralType" === nodeType || "TSExpressionWithTypeArguments" === nodeType || "TSImportType" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isTSBaseType(node, opts) {
  if (!node) return false;
  const nodeType = node.type;

  if ("TSAnyKeyword" === nodeType || "TSBooleanKeyword" === nodeType || "TSBigIntKeyword" === nodeType || "TSIntrinsicKeyword" === nodeType || "TSNeverKeyword" === nodeType || "TSNullKeyword" === nodeType || "TSNumberKeyword" === nodeType || "TSObjectKeyword" === nodeType || "TSStringKeyword" === nodeType || "TSSymbolKeyword" === nodeType || "TSUndefinedKeyword" === nodeType || "TSUnknownKeyword" === nodeType || "TSVoidKeyword" === nodeType || "TSThisType" === nodeType || "TSLiteralType" === nodeType) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isNumberLiteral(node, opts) {
  console.trace("The node type NumberLiteral has been renamed to NumericLiteral");
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "NumberLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isRegexLiteral(node, opts) {
  console.trace("The node type RegexLiteral has been renamed to RegExpLiteral");
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "RegexLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isRestProperty(node, opts) {
  console.trace("The node type RestProperty has been renamed to RestElement");
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "RestProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

function isSpreadProperty(node, opts) {
  console.trace("The node type SpreadProperty has been renamed to SpreadElement");
  if (!node) return false;
  const nodeType = node.type;

  if (nodeType === "SpreadProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return (0, _shallowEqual.default)(node, opts);
    }
  }

  return false;
}

/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = shallowEqual;

function shallowEqual(actual, expected) {
  const keys = Object.keys(expected);

  for (const key of keys) {
    if (actual[key] !== expected[key]) {
      return false;
    }
  }

  return true;
}

/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isCompatTag;

function isCompatTag(tagName) {
  return !!tagName && /^[a-z]/.test(tagName);
}

/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = buildChildren;

var _generated = __webpack_require__(50);

var _cleanJSXElementLiteralChild = __webpack_require__(54);

function buildChildren(node) {
  const elements = [];

  for (let i = 0; i < node.children.length; i++) {
    let child = node.children[i];

    if ((0, _generated.isJSXText)(child)) {
      (0, _cleanJSXElementLiteralChild.default)(child, elements);
      continue;
    }

    if ((0, _generated.isJSXExpressionContainer)(child)) child = child.expression;
    if ((0, _generated.isJSXEmptyExpression)(child)) continue;
    elements.push(child);
  }

  return elements;
}

/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = cleanJSXElementLiteralChild;

var _generated = __webpack_require__(55);

function cleanJSXElementLiteralChild(child, args) {
  const lines = child.value.split(/\r\n|\n|\r/);
  let lastNonEmptyLine = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/[^ \t]/)) {
      lastNonEmptyLine = i;
    }
  }

  let str = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isFirstLine = i === 0;
    const isLastLine = i === lines.length - 1;
    const isLastNonEmptyLine = i === lastNonEmptyLine;
    let trimmedLine = line.replace(/\t/g, " ");

    if (!isFirstLine) {
      trimmedLine = trimmedLine.replace(/^[ ]+/, "");
    }

    if (!isLastLine) {
      trimmedLine = trimmedLine.replace(/[ ]+$/, "");
    }

    if (trimmedLine) {
      if (!isLastNonEmptyLine) {
        trimmedLine += " ";
      }

      str += trimmedLine;
    }
  }

  if (str) args.push((0, _generated.stringLiteral)(str));
}

/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var console = __webpack_require__(5);


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.anyTypeAnnotation = anyTypeAnnotation;
exports.argumentPlaceholder = argumentPlaceholder;
exports.arrayExpression = arrayExpression;
exports.arrayPattern = arrayPattern;
exports.arrayTypeAnnotation = arrayTypeAnnotation;
exports.arrowFunctionExpression = arrowFunctionExpression;
exports.assignmentExpression = assignmentExpression;
exports.assignmentPattern = assignmentPattern;
exports.awaitExpression = awaitExpression;
exports.bigIntLiteral = bigIntLiteral;
exports.binaryExpression = binaryExpression;
exports.bindExpression = bindExpression;
exports.blockStatement = blockStatement;
exports.booleanLiteral = booleanLiteral;
exports.booleanLiteralTypeAnnotation = booleanLiteralTypeAnnotation;
exports.booleanTypeAnnotation = booleanTypeAnnotation;
exports.breakStatement = breakStatement;
exports.callExpression = callExpression;
exports.catchClause = catchClause;
exports.classAccessorProperty = classAccessorProperty;
exports.classBody = classBody;
exports.classDeclaration = classDeclaration;
exports.classExpression = classExpression;
exports.classImplements = classImplements;
exports.classMethod = classMethod;
exports.classPrivateMethod = classPrivateMethod;
exports.classPrivateProperty = classPrivateProperty;
exports.classProperty = classProperty;
exports.conditionalExpression = conditionalExpression;
exports.continueStatement = continueStatement;
exports.debuggerStatement = debuggerStatement;
exports.decimalLiteral = decimalLiteral;
exports.declareClass = declareClass;
exports.declareExportAllDeclaration = declareExportAllDeclaration;
exports.declareExportDeclaration = declareExportDeclaration;
exports.declareFunction = declareFunction;
exports.declareInterface = declareInterface;
exports.declareModule = declareModule;
exports.declareModuleExports = declareModuleExports;
exports.declareOpaqueType = declareOpaqueType;
exports.declareTypeAlias = declareTypeAlias;
exports.declareVariable = declareVariable;
exports.declaredPredicate = declaredPredicate;
exports.decorator = decorator;
exports.directive = directive;
exports.directiveLiteral = directiveLiteral;
exports.doExpression = doExpression;
exports.doWhileStatement = doWhileStatement;
exports.emptyStatement = emptyStatement;
exports.emptyTypeAnnotation = emptyTypeAnnotation;
exports.enumBooleanBody = enumBooleanBody;
exports.enumBooleanMember = enumBooleanMember;
exports.enumDeclaration = enumDeclaration;
exports.enumDefaultedMember = enumDefaultedMember;
exports.enumNumberBody = enumNumberBody;
exports.enumNumberMember = enumNumberMember;
exports.enumStringBody = enumStringBody;
exports.enumStringMember = enumStringMember;
exports.enumSymbolBody = enumSymbolBody;
exports.existsTypeAnnotation = existsTypeAnnotation;
exports.exportAllDeclaration = exportAllDeclaration;
exports.exportDefaultDeclaration = exportDefaultDeclaration;
exports.exportDefaultSpecifier = exportDefaultSpecifier;
exports.exportNamedDeclaration = exportNamedDeclaration;
exports.exportNamespaceSpecifier = exportNamespaceSpecifier;
exports.exportSpecifier = exportSpecifier;
exports.expressionStatement = expressionStatement;
exports.file = file;
exports.forInStatement = forInStatement;
exports.forOfStatement = forOfStatement;
exports.forStatement = forStatement;
exports.functionDeclaration = functionDeclaration;
exports.functionExpression = functionExpression;
exports.functionTypeAnnotation = functionTypeAnnotation;
exports.functionTypeParam = functionTypeParam;
exports.genericTypeAnnotation = genericTypeAnnotation;
exports.identifier = identifier;
exports.ifStatement = ifStatement;
exports["import"] = _import;
exports.importAttribute = importAttribute;
exports.importDeclaration = importDeclaration;
exports.importDefaultSpecifier = importDefaultSpecifier;
exports.importNamespaceSpecifier = importNamespaceSpecifier;
exports.importSpecifier = importSpecifier;
exports.indexedAccessType = indexedAccessType;
exports.inferredPredicate = inferredPredicate;
exports.interfaceDeclaration = interfaceDeclaration;
exports.interfaceExtends = interfaceExtends;
exports.interfaceTypeAnnotation = interfaceTypeAnnotation;
exports.interpreterDirective = interpreterDirective;
exports.intersectionTypeAnnotation = intersectionTypeAnnotation;
exports.jSXAttribute = exports.jsxAttribute = jsxAttribute;
exports.jSXClosingElement = exports.jsxClosingElement = jsxClosingElement;
exports.jSXClosingFragment = exports.jsxClosingFragment = jsxClosingFragment;
exports.jSXElement = exports.jsxElement = jsxElement;
exports.jSXEmptyExpression = exports.jsxEmptyExpression = jsxEmptyExpression;
exports.jSXExpressionContainer = exports.jsxExpressionContainer = jsxExpressionContainer;
exports.jSXFragment = exports.jsxFragment = jsxFragment;
exports.jSXIdentifier = exports.jsxIdentifier = jsxIdentifier;
exports.jSXMemberExpression = exports.jsxMemberExpression = jsxMemberExpression;
exports.jSXNamespacedName = exports.jsxNamespacedName = jsxNamespacedName;
exports.jSXOpeningElement = exports.jsxOpeningElement = jsxOpeningElement;
exports.jSXOpeningFragment = exports.jsxOpeningFragment = jsxOpeningFragment;
exports.jSXSpreadAttribute = exports.jsxSpreadAttribute = jsxSpreadAttribute;
exports.jSXSpreadChild = exports.jsxSpreadChild = jsxSpreadChild;
exports.jSXText = exports.jsxText = jsxText;
exports.labeledStatement = labeledStatement;
exports.logicalExpression = logicalExpression;
exports.memberExpression = memberExpression;
exports.metaProperty = metaProperty;
exports.mixedTypeAnnotation = mixedTypeAnnotation;
exports.moduleExpression = moduleExpression;
exports.newExpression = newExpression;
exports.noop = noop;
exports.nullLiteral = nullLiteral;
exports.nullLiteralTypeAnnotation = nullLiteralTypeAnnotation;
exports.nullableTypeAnnotation = nullableTypeAnnotation;
exports.numberLiteral = NumberLiteral;
exports.numberLiteralTypeAnnotation = numberLiteralTypeAnnotation;
exports.numberTypeAnnotation = numberTypeAnnotation;
exports.numericLiteral = numericLiteral;
exports.objectExpression = objectExpression;
exports.objectMethod = objectMethod;
exports.objectPattern = objectPattern;
exports.objectProperty = objectProperty;
exports.objectTypeAnnotation = objectTypeAnnotation;
exports.objectTypeCallProperty = objectTypeCallProperty;
exports.objectTypeIndexer = objectTypeIndexer;
exports.objectTypeInternalSlot = objectTypeInternalSlot;
exports.objectTypeProperty = objectTypeProperty;
exports.objectTypeSpreadProperty = objectTypeSpreadProperty;
exports.opaqueType = opaqueType;
exports.optionalCallExpression = optionalCallExpression;
exports.optionalIndexedAccessType = optionalIndexedAccessType;
exports.optionalMemberExpression = optionalMemberExpression;
exports.parenthesizedExpression = parenthesizedExpression;
exports.pipelineBareFunction = pipelineBareFunction;
exports.pipelinePrimaryTopicReference = pipelinePrimaryTopicReference;
exports.pipelineTopicExpression = pipelineTopicExpression;
exports.placeholder = placeholder;
exports.privateName = privateName;
exports.program = program;
exports.qualifiedTypeIdentifier = qualifiedTypeIdentifier;
exports.recordExpression = recordExpression;
exports.regExpLiteral = regExpLiteral;
exports.regexLiteral = RegexLiteral;
exports.restElement = restElement;
exports.restProperty = RestProperty;
exports.returnStatement = returnStatement;
exports.sequenceExpression = sequenceExpression;
exports.spreadElement = spreadElement;
exports.spreadProperty = SpreadProperty;
exports.staticBlock = staticBlock;
exports.stringLiteral = stringLiteral;
exports.stringLiteralTypeAnnotation = stringLiteralTypeAnnotation;
exports.stringTypeAnnotation = stringTypeAnnotation;
exports["super"] = _super;
exports.switchCase = switchCase;
exports.switchStatement = switchStatement;
exports.symbolTypeAnnotation = symbolTypeAnnotation;
exports.taggedTemplateExpression = taggedTemplateExpression;
exports.templateElement = templateElement;
exports.templateLiteral = templateLiteral;
exports.thisExpression = thisExpression;
exports.thisTypeAnnotation = thisTypeAnnotation;
exports.throwStatement = throwStatement;
exports.topicReference = topicReference;
exports.tryStatement = tryStatement;
exports.tSAnyKeyword = exports.tsAnyKeyword = tsAnyKeyword;
exports.tSArrayType = exports.tsArrayType = tsArrayType;
exports.tSAsExpression = exports.tsAsExpression = tsAsExpression;
exports.tSBigIntKeyword = exports.tsBigIntKeyword = tsBigIntKeyword;
exports.tSBooleanKeyword = exports.tsBooleanKeyword = tsBooleanKeyword;
exports.tSCallSignatureDeclaration = exports.tsCallSignatureDeclaration = tsCallSignatureDeclaration;
exports.tSConditionalType = exports.tsConditionalType = tsConditionalType;
exports.tSConstructSignatureDeclaration = exports.tsConstructSignatureDeclaration = tsConstructSignatureDeclaration;
exports.tSConstructorType = exports.tsConstructorType = tsConstructorType;
exports.tSDeclareFunction = exports.tsDeclareFunction = tsDeclareFunction;
exports.tSDeclareMethod = exports.tsDeclareMethod = tsDeclareMethod;
exports.tSEnumDeclaration = exports.tsEnumDeclaration = tsEnumDeclaration;
exports.tSEnumMember = exports.tsEnumMember = tsEnumMember;
exports.tSExportAssignment = exports.tsExportAssignment = tsExportAssignment;
exports.tSExpressionWithTypeArguments = exports.tsExpressionWithTypeArguments = tsExpressionWithTypeArguments;
exports.tSExternalModuleReference = exports.tsExternalModuleReference = tsExternalModuleReference;
exports.tSFunctionType = exports.tsFunctionType = tsFunctionType;
exports.tSImportEqualsDeclaration = exports.tsImportEqualsDeclaration = tsImportEqualsDeclaration;
exports.tSImportType = exports.tsImportType = tsImportType;
exports.tSIndexSignature = exports.tsIndexSignature = tsIndexSignature;
exports.tSIndexedAccessType = exports.tsIndexedAccessType = tsIndexedAccessType;
exports.tSInferType = exports.tsInferType = tsInferType;
exports.tSInstantiationExpression = exports.tsInstantiationExpression = tsInstantiationExpression;
exports.tSInterfaceBody = exports.tsInterfaceBody = tsInterfaceBody;
exports.tSInterfaceDeclaration = exports.tsInterfaceDeclaration = tsInterfaceDeclaration;
exports.tSIntersectionType = exports.tsIntersectionType = tsIntersectionType;
exports.tSIntrinsicKeyword = exports.tsIntrinsicKeyword = tsIntrinsicKeyword;
exports.tSLiteralType = exports.tsLiteralType = tsLiteralType;
exports.tSMappedType = exports.tsMappedType = tsMappedType;
exports.tSMethodSignature = exports.tsMethodSignature = tsMethodSignature;
exports.tSModuleBlock = exports.tsModuleBlock = tsModuleBlock;
exports.tSModuleDeclaration = exports.tsModuleDeclaration = tsModuleDeclaration;
exports.tSNamedTupleMember = exports.tsNamedTupleMember = tsNamedTupleMember;
exports.tSNamespaceExportDeclaration = exports.tsNamespaceExportDeclaration = tsNamespaceExportDeclaration;
exports.tSNeverKeyword = exports.tsNeverKeyword = tsNeverKeyword;
exports.tSNonNullExpression = exports.tsNonNullExpression = tsNonNullExpression;
exports.tSNullKeyword = exports.tsNullKeyword = tsNullKeyword;
exports.tSNumberKeyword = exports.tsNumberKeyword = tsNumberKeyword;
exports.tSObjectKeyword = exports.tsObjectKeyword = tsObjectKeyword;
exports.tSOptionalType = exports.tsOptionalType = tsOptionalType;
exports.tSParameterProperty = exports.tsParameterProperty = tsParameterProperty;
exports.tSParenthesizedType = exports.tsParenthesizedType = tsParenthesizedType;
exports.tSPropertySignature = exports.tsPropertySignature = tsPropertySignature;
exports.tSQualifiedName = exports.tsQualifiedName = tsQualifiedName;
exports.tSRestType = exports.tsRestType = tsRestType;
exports.tSStringKeyword = exports.tsStringKeyword = tsStringKeyword;
exports.tSSymbolKeyword = exports.tsSymbolKeyword = tsSymbolKeyword;
exports.tSThisType = exports.tsThisType = tsThisType;
exports.tSTupleType = exports.tsTupleType = tsTupleType;
exports.tSTypeAliasDeclaration = exports.tsTypeAliasDeclaration = tsTypeAliasDeclaration;
exports.tSTypeAnnotation = exports.tsTypeAnnotation = tsTypeAnnotation;
exports.tSTypeAssertion = exports.tsTypeAssertion = tsTypeAssertion;
exports.tSTypeLiteral = exports.tsTypeLiteral = tsTypeLiteral;
exports.tSTypeOperator = exports.tsTypeOperator = tsTypeOperator;
exports.tSTypeParameter = exports.tsTypeParameter = tsTypeParameter;
exports.tSTypeParameterDeclaration = exports.tsTypeParameterDeclaration = tsTypeParameterDeclaration;
exports.tSTypeParameterInstantiation = exports.tsTypeParameterInstantiation = tsTypeParameterInstantiation;
exports.tSTypePredicate = exports.tsTypePredicate = tsTypePredicate;
exports.tSTypeQuery = exports.tsTypeQuery = tsTypeQuery;
exports.tSTypeReference = exports.tsTypeReference = tsTypeReference;
exports.tSUndefinedKeyword = exports.tsUndefinedKeyword = tsUndefinedKeyword;
exports.tSUnionType = exports.tsUnionType = tsUnionType;
exports.tSUnknownKeyword = exports.tsUnknownKeyword = tsUnknownKeyword;
exports.tSVoidKeyword = exports.tsVoidKeyword = tsVoidKeyword;
exports.tupleExpression = tupleExpression;
exports.tupleTypeAnnotation = tupleTypeAnnotation;
exports.typeAlias = typeAlias;
exports.typeAnnotation = typeAnnotation;
exports.typeCastExpression = typeCastExpression;
exports.typeParameter = typeParameter;
exports.typeParameterDeclaration = typeParameterDeclaration;
exports.typeParameterInstantiation = typeParameterInstantiation;
exports.typeofTypeAnnotation = typeofTypeAnnotation;
exports.unaryExpression = unaryExpression;
exports.unionTypeAnnotation = unionTypeAnnotation;
exports.updateExpression = updateExpression;
exports.v8IntrinsicIdentifier = v8IntrinsicIdentifier;
exports.variableDeclaration = variableDeclaration;
exports.variableDeclarator = variableDeclarator;
exports.variance = variance;
exports.voidTypeAnnotation = voidTypeAnnotation;
exports.whileStatement = whileStatement;
exports.withStatement = withStatement;
exports.yieldExpression = yieldExpression;

var _validateNode = __webpack_require__(56);

function arrayExpression(elements = []) {
  return (0, _validateNode.default)({
    type: "ArrayExpression",
    elements
  });
}

function assignmentExpression(operator, left, right) {
  return (0, _validateNode.default)({
    type: "AssignmentExpression",
    operator,
    left,
    right
  });
}

function binaryExpression(operator, left, right) {
  return (0, _validateNode.default)({
    type: "BinaryExpression",
    operator,
    left,
    right
  });
}

function interpreterDirective(value) {
  return (0, _validateNode.default)({
    type: "InterpreterDirective",
    value
  });
}

function directive(value) {
  return (0, _validateNode.default)({
    type: "Directive",
    value
  });
}

function directiveLiteral(value) {
  return (0, _validateNode.default)({
    type: "DirectiveLiteral",
    value
  });
}

function blockStatement(body, directives = []) {
  return (0, _validateNode.default)({
    type: "BlockStatement",
    body,
    directives
  });
}

function breakStatement(label = null) {
  return (0, _validateNode.default)({
    type: "BreakStatement",
    label
  });
}

function callExpression(callee, _arguments) {
  return (0, _validateNode.default)({
    type: "CallExpression",
    callee,
    arguments: _arguments
  });
}

function catchClause(param = null, body) {
  return (0, _validateNode.default)({
    type: "CatchClause",
    param,
    body
  });
}

function conditionalExpression(test, consequent, alternate) {
  return (0, _validateNode.default)({
    type: "ConditionalExpression",
    test,
    consequent,
    alternate
  });
}

function continueStatement(label = null) {
  return (0, _validateNode.default)({
    type: "ContinueStatement",
    label
  });
}

function debuggerStatement() {
  return {
    type: "DebuggerStatement"
  };
}

function doWhileStatement(test, body) {
  return (0, _validateNode.default)({
    type: "DoWhileStatement",
    test,
    body
  });
}

function emptyStatement() {
  return {
    type: "EmptyStatement"
  };
}

function expressionStatement(expression) {
  return (0, _validateNode.default)({
    type: "ExpressionStatement",
    expression
  });
}

function file(program, comments = null, tokens = null) {
  return (0, _validateNode.default)({
    type: "File",
    program,
    comments,
    tokens
  });
}

function forInStatement(left, right, body) {
  return (0, _validateNode.default)({
    type: "ForInStatement",
    left,
    right,
    body
  });
}

function forStatement(init = null, test = null, update = null, body) {
  return (0, _validateNode.default)({
    type: "ForStatement",
    init,
    test,
    update,
    body
  });
}

function functionDeclaration(id = null, params, body, generator = false, async = false) {
  return (0, _validateNode.default)({
    type: "FunctionDeclaration",
    id,
    params,
    body,
    generator,
    async
  });
}

function functionExpression(id = null, params, body, generator = false, async = false) {
  return (0, _validateNode.default)({
    type: "FunctionExpression",
    id,
    params,
    body,
    generator,
    async
  });
}

function identifier(name) {
  return (0, _validateNode.default)({
    type: "Identifier",
    name
  });
}

function ifStatement(test, consequent, alternate = null) {
  return (0, _validateNode.default)({
    type: "IfStatement",
    test,
    consequent,
    alternate
  });
}

function labeledStatement(label, body) {
  return (0, _validateNode.default)({
    type: "LabeledStatement",
    label,
    body
  });
}

function stringLiteral(value) {
  return (0, _validateNode.default)({
    type: "StringLiteral",
    value
  });
}

function numericLiteral(value) {
  return (0, _validateNode.default)({
    type: "NumericLiteral",
    value
  });
}

function nullLiteral() {
  return {
    type: "NullLiteral"
  };
}

function booleanLiteral(value) {
  return (0, _validateNode.default)({
    type: "BooleanLiteral",
    value
  });
}

function regExpLiteral(pattern, flags = "") {
  return (0, _validateNode.default)({
    type: "RegExpLiteral",
    pattern,
    flags
  });
}

function logicalExpression(operator, left, right) {
  return (0, _validateNode.default)({
    type: "LogicalExpression",
    operator,
    left,
    right
  });
}

function memberExpression(object, property, computed = false, optional = null) {
  return (0, _validateNode.default)({
    type: "MemberExpression",
    object,
    property,
    computed,
    optional
  });
}

function newExpression(callee, _arguments) {
  return (0, _validateNode.default)({
    type: "NewExpression",
    callee,
    arguments: _arguments
  });
}

function program(body, directives = [], sourceType = "script", interpreter = null) {
  return (0, _validateNode.default)({
    type: "Program",
    body,
    directives,
    sourceType,
    interpreter,
    sourceFile: null
  });
}

function objectExpression(properties) {
  return (0, _validateNode.default)({
    type: "ObjectExpression",
    properties
  });
}

function objectMethod(kind = "method", key, params, body, computed = false, generator = false, async = false) {
  return (0, _validateNode.default)({
    type: "ObjectMethod",
    kind,
    key,
    params,
    body,
    computed,
    generator,
    async
  });
}

function objectProperty(key, value, computed = false, shorthand = false, decorators = null) {
  return (0, _validateNode.default)({
    type: "ObjectProperty",
    key,
    value,
    computed,
    shorthand,
    decorators
  });
}

function restElement(argument) {
  return (0, _validateNode.default)({
    type: "RestElement",
    argument
  });
}

function returnStatement(argument = null) {
  return (0, _validateNode.default)({
    type: "ReturnStatement",
    argument
  });
}

function sequenceExpression(expressions) {
  return (0, _validateNode.default)({
    type: "SequenceExpression",
    expressions
  });
}

function parenthesizedExpression(expression) {
  return (0, _validateNode.default)({
    type: "ParenthesizedExpression",
    expression
  });
}

function switchCase(test = null, consequent) {
  return (0, _validateNode.default)({
    type: "SwitchCase",
    test,
    consequent
  });
}

function switchStatement(discriminant, cases) {
  return (0, _validateNode.default)({
    type: "SwitchStatement",
    discriminant,
    cases
  });
}

function thisExpression() {
  return {
    type: "ThisExpression"
  };
}

function throwStatement(argument) {
  return (0, _validateNode.default)({
    type: "ThrowStatement",
    argument
  });
}

function tryStatement(block, handler = null, finalizer = null) {
  return (0, _validateNode.default)({
    type: "TryStatement",
    block,
    handler,
    finalizer
  });
}

function unaryExpression(operator, argument, prefix = true) {
  return (0, _validateNode.default)({
    type: "UnaryExpression",
    operator,
    argument,
    prefix
  });
}

function updateExpression(operator, argument, prefix = false) {
  return (0, _validateNode.default)({
    type: "UpdateExpression",
    operator,
    argument,
    prefix
  });
}

function variableDeclaration(kind, declarations) {
  return (0, _validateNode.default)({
    type: "VariableDeclaration",
    kind,
    declarations
  });
}

function variableDeclarator(id, init = null) {
  return (0, _validateNode.default)({
    type: "VariableDeclarator",
    id,
    init
  });
}

function whileStatement(test, body) {
  return (0, _validateNode.default)({
    type: "WhileStatement",
    test,
    body
  });
}

function withStatement(object, body) {
  return (0, _validateNode.default)({
    type: "WithStatement",
    object,
    body
  });
}

function assignmentPattern(left, right) {
  return (0, _validateNode.default)({
    type: "AssignmentPattern",
    left,
    right
  });
}

function arrayPattern(elements) {
  return (0, _validateNode.default)({
    type: "ArrayPattern",
    elements
  });
}

function arrowFunctionExpression(params, body, async = false) {
  return (0, _validateNode.default)({
    type: "ArrowFunctionExpression",
    params,
    body,
    async,
    expression: null
  });
}

function classBody(body) {
  return (0, _validateNode.default)({
    type: "ClassBody",
    body
  });
}

function classExpression(id = null, superClass = null, body, decorators = null) {
  return (0, _validateNode.default)({
    type: "ClassExpression",
    id,
    superClass,
    body,
    decorators
  });
}

function classDeclaration(id, superClass = null, body, decorators = null) {
  return (0, _validateNode.default)({
    type: "ClassDeclaration",
    id,
    superClass,
    body,
    decorators
  });
}

function exportAllDeclaration(source) {
  return (0, _validateNode.default)({
    type: "ExportAllDeclaration",
    source
  });
}

function exportDefaultDeclaration(declaration) {
  return (0, _validateNode.default)({
    type: "ExportDefaultDeclaration",
    declaration
  });
}

function exportNamedDeclaration(declaration = null, specifiers = [], source = null) {
  return (0, _validateNode.default)({
    type: "ExportNamedDeclaration",
    declaration,
    specifiers,
    source
  });
}

function exportSpecifier(local, exported) {
  return (0, _validateNode.default)({
    type: "ExportSpecifier",
    local,
    exported
  });
}

function forOfStatement(left, right, body, _await = false) {
  return (0, _validateNode.default)({
    type: "ForOfStatement",
    left,
    right,
    body,
    await: _await
  });
}

function importDeclaration(specifiers, source) {
  return (0, _validateNode.default)({
    type: "ImportDeclaration",
    specifiers,
    source
  });
}

function importDefaultSpecifier(local) {
  return (0, _validateNode.default)({
    type: "ImportDefaultSpecifier",
    local
  });
}

function importNamespaceSpecifier(local) {
  return (0, _validateNode.default)({
    type: "ImportNamespaceSpecifier",
    local
  });
}

function importSpecifier(local, imported) {
  return (0, _validateNode.default)({
    type: "ImportSpecifier",
    local,
    imported
  });
}

function metaProperty(meta, property) {
  return (0, _validateNode.default)({
    type: "MetaProperty",
    meta,
    property
  });
}

function classMethod(kind = "method", key, params, body, computed = false, _static = false, generator = false, async = false) {
  return (0, _validateNode.default)({
    type: "ClassMethod",
    kind,
    key,
    params,
    body,
    computed,
    static: _static,
    generator,
    async
  });
}

function objectPattern(properties) {
  return (0, _validateNode.default)({
    type: "ObjectPattern",
    properties
  });
}

function spreadElement(argument) {
  return (0, _validateNode.default)({
    type: "SpreadElement",
    argument
  });
}

function _super() {
  return {
    type: "Super"
  };
}

function taggedTemplateExpression(tag, quasi) {
  return (0, _validateNode.default)({
    type: "TaggedTemplateExpression",
    tag,
    quasi
  });
}

function templateElement(value, tail = false) {
  return (0, _validateNode.default)({
    type: "TemplateElement",
    value,
    tail
  });
}

function templateLiteral(quasis, expressions) {
  return (0, _validateNode.default)({
    type: "TemplateLiteral",
    quasis,
    expressions
  });
}

function yieldExpression(argument = null, delegate = false) {
  return (0, _validateNode.default)({
    type: "YieldExpression",
    argument,
    delegate
  });
}

function awaitExpression(argument) {
  return (0, _validateNode.default)({
    type: "AwaitExpression",
    argument
  });
}

function _import() {
  return {
    type: "Import"
  };
}

function bigIntLiteral(value) {
  return (0, _validateNode.default)({
    type: "BigIntLiteral",
    value
  });
}

function exportNamespaceSpecifier(exported) {
  return (0, _validateNode.default)({
    type: "ExportNamespaceSpecifier",
    exported
  });
}

function optionalMemberExpression(object, property, computed = false, optional) {
  return (0, _validateNode.default)({
    type: "OptionalMemberExpression",
    object,
    property,
    computed,
    optional
  });
}

function optionalCallExpression(callee, _arguments, optional) {
  return (0, _validateNode.default)({
    type: "OptionalCallExpression",
    callee,
    arguments: _arguments,
    optional
  });
}

function classProperty(key, value = null, typeAnnotation = null, decorators = null, computed = false, _static = false) {
  return (0, _validateNode.default)({
    type: "ClassProperty",
    key,
    value,
    typeAnnotation,
    decorators,
    computed,
    static: _static
  });
}

function classAccessorProperty(key, value = null, typeAnnotation = null, decorators = null, computed = false, _static = false) {
  return (0, _validateNode.default)({
    type: "ClassAccessorProperty",
    key,
    value,
    typeAnnotation,
    decorators,
    computed,
    static: _static
  });
}

function classPrivateProperty(key, value = null, decorators = null, _static = false) {
  return (0, _validateNode.default)({
    type: "ClassPrivateProperty",
    key,
    value,
    decorators,
    static: _static
  });
}

function classPrivateMethod(kind = "method", key, params, body, _static = false) {
  return (0, _validateNode.default)({
    type: "ClassPrivateMethod",
    kind,
    key,
    params,
    body,
    static: _static
  });
}

function privateName(id) {
  return (0, _validateNode.default)({
    type: "PrivateName",
    id
  });
}

function staticBlock(body) {
  return (0, _validateNode.default)({
    type: "StaticBlock",
    body
  });
}

function anyTypeAnnotation() {
  return {
    type: "AnyTypeAnnotation"
  };
}

function arrayTypeAnnotation(elementType) {
  return (0, _validateNode.default)({
    type: "ArrayTypeAnnotation",
    elementType
  });
}

function booleanTypeAnnotation() {
  return {
    type: "BooleanTypeAnnotation"
  };
}

function booleanLiteralTypeAnnotation(value) {
  return (0, _validateNode.default)({
    type: "BooleanLiteralTypeAnnotation",
    value
  });
}

function nullLiteralTypeAnnotation() {
  return {
    type: "NullLiteralTypeAnnotation"
  };
}

function classImplements(id, typeParameters = null) {
  return (0, _validateNode.default)({
    type: "ClassImplements",
    id,
    typeParameters
  });
}

function declareClass(id, typeParameters = null, _extends = null, body) {
  return (0, _validateNode.default)({
    type: "DeclareClass",
    id,
    typeParameters,
    extends: _extends,
    body
  });
}

function declareFunction(id) {
  return (0, _validateNode.default)({
    type: "DeclareFunction",
    id
  });
}

function declareInterface(id, typeParameters = null, _extends = null, body) {
  return (0, _validateNode.default)({
    type: "DeclareInterface",
    id,
    typeParameters,
    extends: _extends,
    body
  });
}

function declareModule(id, body, kind = null) {
  return (0, _validateNode.default)({
    type: "DeclareModule",
    id,
    body,
    kind
  });
}

function declareModuleExports(typeAnnotation) {
  return (0, _validateNode.default)({
    type: "DeclareModuleExports",
    typeAnnotation
  });
}

function declareTypeAlias(id, typeParameters = null, right) {
  return (0, _validateNode.default)({
    type: "DeclareTypeAlias",
    id,
    typeParameters,
    right
  });
}

function declareOpaqueType(id, typeParameters = null, supertype = null) {
  return (0, _validateNode.default)({
    type: "DeclareOpaqueType",
    id,
    typeParameters,
    supertype
  });
}

function declareVariable(id) {
  return (0, _validateNode.default)({
    type: "DeclareVariable",
    id
  });
}

function declareExportDeclaration(declaration = null, specifiers = null, source = null) {
  return (0, _validateNode.default)({
    type: "DeclareExportDeclaration",
    declaration,
    specifiers,
    source
  });
}

function declareExportAllDeclaration(source) {
  return (0, _validateNode.default)({
    type: "DeclareExportAllDeclaration",
    source
  });
}

function declaredPredicate(value) {
  return (0, _validateNode.default)({
    type: "DeclaredPredicate",
    value
  });
}

function existsTypeAnnotation() {
  return {
    type: "ExistsTypeAnnotation"
  };
}

function functionTypeAnnotation(typeParameters = null, params, rest = null, returnType) {
  return (0, _validateNode.default)({
    type: "FunctionTypeAnnotation",
    typeParameters,
    params,
    rest,
    returnType
  });
}

function functionTypeParam(name = null, typeAnnotation) {
  return (0, _validateNode.default)({
    type: "FunctionTypeParam",
    name,
    typeAnnotation
  });
}

function genericTypeAnnotation(id, typeParameters = null) {
  return (0, _validateNode.default)({
    type: "GenericTypeAnnotation",
    id,
    typeParameters
  });
}

function inferredPredicate() {
  return {
    type: "InferredPredicate"
  };
}

function interfaceExtends(id, typeParameters = null) {
  return (0, _validateNode.default)({
    type: "InterfaceExtends",
    id,
    typeParameters
  });
}

function interfaceDeclaration(id, typeParameters = null, _extends = null, body) {
  return (0, _validateNode.default)({
    type: "InterfaceDeclaration",
    id,
    typeParameters,
    extends: _extends,
    body
  });
}

function interfaceTypeAnnotation(_extends = null, body) {
  return (0, _validateNode.default)({
    type: "InterfaceTypeAnnotation",
    extends: _extends,
    body
  });
}

function intersectionTypeAnnotation(types) {
  return (0, _validateNode.default)({
    type: "IntersectionTypeAnnotation",
    types
  });
}

function mixedTypeAnnotation() {
  return {
    type: "MixedTypeAnnotation"
  };
}

function emptyTypeAnnotation() {
  return {
    type: "EmptyTypeAnnotation"
  };
}

function nullableTypeAnnotation(typeAnnotation) {
  return (0, _validateNode.default)({
    type: "NullableTypeAnnotation",
    typeAnnotation
  });
}

function numberLiteralTypeAnnotation(value) {
  return (0, _validateNode.default)({
    type: "NumberLiteralTypeAnnotation",
    value
  });
}

function numberTypeAnnotation() {
  return {
    type: "NumberTypeAnnotation"
  };
}

function objectTypeAnnotation(properties, indexers = [], callProperties = [], internalSlots = [], exact = false) {
  return (0, _validateNode.default)({
    type: "ObjectTypeAnnotation",
    properties,
    indexers,
    callProperties,
    internalSlots,
    exact
  });
}

function objectTypeInternalSlot(id, value, optional, _static, method) {
  return (0, _validateNode.default)({
    type: "ObjectTypeInternalSlot",
    id,
    value,
    optional,
    static: _static,
    method
  });
}

function objectTypeCallProperty(value) {
  return (0, _validateNode.default)({
    type: "ObjectTypeCallProperty",
    value,
    static: null
  });
}

function objectTypeIndexer(id = null, key, value, variance = null) {
  return (0, _validateNode.default)({
    type: "ObjectTypeIndexer",
    id,
    key,
    value,
    variance,
    static: null
  });
}

function objectTypeProperty(key, value, variance = null) {
  return (0, _validateNode.default)({
    type: "ObjectTypeProperty",
    key,
    value,
    variance,
    kind: null,
    method: null,
    optional: null,
    proto: null,
    static: null
  });
}

function objectTypeSpreadProperty(argument) {
  return (0, _validateNode.default)({
    type: "ObjectTypeSpreadProperty",
    argument
  });
}

function opaqueType(id, typeParameters = null, supertype = null, impltype) {
  return (0, _validateNode.default)({
    type: "OpaqueType",
    id,
    typeParameters,
    supertype,
    impltype
  });
}

function qualifiedTypeIdentifier(id, qualification) {
  return (0, _validateNode.default)({
    type: "QualifiedTypeIdentifier",
    id,
    qualification
  });
}

function stringLiteralTypeAnnotation(value) {
  return (0, _validateNode.default)({
    type: "StringLiteralTypeAnnotation",
    value
  });
}

function stringTypeAnnotation() {
  return {
    type: "StringTypeAnnotation"
  };
}

function symbolTypeAnnotation() {
  return {
    type: "SymbolTypeAnnotation"
  };
}

function thisTypeAnnotation() {
  return {
    type: "ThisTypeAnnotation"
  };
}

function tupleTypeAnnotation(types) {
  return (0, _validateNode.default)({
    type: "TupleTypeAnnotation",
    types
  });
}

function typeofTypeAnnotation(argument) {
  return (0, _validateNode.default)({
    type: "TypeofTypeAnnotation",
    argument
  });
}

function typeAlias(id, typeParameters = null, right) {
  return (0, _validateNode.default)({
    type: "TypeAlias",
    id,
    typeParameters,
    right
  });
}

function typeAnnotation(typeAnnotation) {
  return (0, _validateNode.default)({
    type: "TypeAnnotation",
    typeAnnotation
  });
}

function typeCastExpression(expression, typeAnnotation) {
  return (0, _validateNode.default)({
    type: "TypeCastExpression",
    expression,
    typeAnnotation
  });
}

function typeParameter(bound = null, _default = null, variance = null) {
  return (0, _validateNode.default)({
    type: "TypeParameter",
    bound,
    default: _default,
    variance,
    name: null
  });
}

function typeParameterDeclaration(params) {
  return (0, _validateNode.default)({
    type: "TypeParameterDeclaration",
    params
  });
}

function typeParameterInstantiation(params) {
  return (0, _validateNode.default)({
    type: "TypeParameterInstantiation",
    params
  });
}

function unionTypeAnnotation(types) {
  return (0, _validateNode.default)({
    type: "UnionTypeAnnotation",
    types
  });
}

function variance(kind) {
  return (0, _validateNode.default)({
    type: "Variance",
    kind
  });
}

function voidTypeAnnotation() {
  return {
    type: "VoidTypeAnnotation"
  };
}

function enumDeclaration(id, body) {
  return (0, _validateNode.default)({
    type: "EnumDeclaration",
    id,
    body
  });
}

function enumBooleanBody(members) {
  return (0, _validateNode.default)({
    type: "EnumBooleanBody",
    members,
    explicitType: null,
    hasUnknownMembers: null
  });
}

function enumNumberBody(members) {
  return (0, _validateNode.default)({
    type: "EnumNumberBody",
    members,
    explicitType: null,
    hasUnknownMembers: null
  });
}

function enumStringBody(members) {
  return (0, _validateNode.default)({
    type: "EnumStringBody",
    members,
    explicitType: null,
    hasUnknownMembers: null
  });
}

function enumSymbolBody(members) {
  return (0, _validateNode.default)({
    type: "EnumSymbolBody",
    members,
    hasUnknownMembers: null
  });
}

function enumBooleanMember(id) {
  return (0, _validateNode.default)({
    type: "EnumBooleanMember",
    id,
    init: null
  });
}

function enumNumberMember(id, init) {
  return (0, _validateNode.default)({
    type: "EnumNumberMember",
    id,
    init
  });
}

function enumStringMember(id, init) {
  return (0, _validateNode.default)({
    type: "EnumStringMember",
    id,
    init
  });
}

function enumDefaultedMember(id) {
  return (0, _validateNode.default)({
    type: "EnumDefaultedMember",
    id
  });
}

function indexedAccessType(objectType, indexType) {
  return (0, _validateNode.default)({
    type: "IndexedAccessType",
    objectType,
    indexType
  });
}

function optionalIndexedAccessType(objectType, indexType) {
  return (0, _validateNode.default)({
    type: "OptionalIndexedAccessType",
    objectType,
    indexType,
    optional: null
  });
}

function jsxAttribute(name, value = null) {
  return (0, _validateNode.default)({
    type: "JSXAttribute",
    name,
    value
  });
}

function jsxClosingElement(name) {
  return (0, _validateNode.default)({
    type: "JSXClosingElement",
    name
  });
}

function jsxElement(openingElement, closingElement = null, children, selfClosing = null) {
  return (0, _validateNode.default)({
    type: "JSXElement",
    openingElement,
    closingElement,
    children,
    selfClosing
  });
}

function jsxEmptyExpression() {
  return {
    type: "JSXEmptyExpression"
  };
}

function jsxExpressionContainer(expression) {
  return (0, _validateNode.default)({
    type: "JSXExpressionContainer",
    expression
  });
}

function jsxSpreadChild(expression) {
  return (0, _validateNode.default)({
    type: "JSXSpreadChild",
    expression
  });
}

function jsxIdentifier(name) {
  return (0, _validateNode.default)({
    type: "JSXIdentifier",
    name
  });
}

function jsxMemberExpression(object, property) {
  return (0, _validateNode.default)({
    type: "JSXMemberExpression",
    object,
    property
  });
}

function jsxNamespacedName(namespace, name) {
  return (0, _validateNode.default)({
    type: "JSXNamespacedName",
    namespace,
    name
  });
}

function jsxOpeningElement(name, attributes, selfClosing = false) {
  return (0, _validateNode.default)({
    type: "JSXOpeningElement",
    name,
    attributes,
    selfClosing
  });
}

function jsxSpreadAttribute(argument) {
  return (0, _validateNode.default)({
    type: "JSXSpreadAttribute",
    argument
  });
}

function jsxText(value) {
  return (0, _validateNode.default)({
    type: "JSXText",
    value
  });
}

function jsxFragment(openingFragment, closingFragment, children) {
  return (0, _validateNode.default)({
    type: "JSXFragment",
    openingFragment,
    closingFragment,
    children
  });
}

function jsxOpeningFragment() {
  return {
    type: "JSXOpeningFragment"
  };
}

function jsxClosingFragment() {
  return {
    type: "JSXClosingFragment"
  };
}

function noop() {
  return {
    type: "Noop"
  };
}

function placeholder(expectedNode, name) {
  return (0, _validateNode.default)({
    type: "Placeholder",
    expectedNode,
    name
  });
}

function v8IntrinsicIdentifier(name) {
  return (0, _validateNode.default)({
    type: "V8IntrinsicIdentifier",
    name
  });
}

function argumentPlaceholder() {
  return {
    type: "ArgumentPlaceholder"
  };
}

function bindExpression(object, callee) {
  return (0, _validateNode.default)({
    type: "BindExpression",
    object,
    callee
  });
}

function importAttribute(key, value) {
  return (0, _validateNode.default)({
    type: "ImportAttribute",
    key,
    value
  });
}

function decorator(expression) {
  return (0, _validateNode.default)({
    type: "Decorator",
    expression
  });
}

function doExpression(body, async = false) {
  return (0, _validateNode.default)({
    type: "DoExpression",
    body,
    async
  });
}

function exportDefaultSpecifier(exported) {
  return (0, _validateNode.default)({
    type: "ExportDefaultSpecifier",
    exported
  });
}

function recordExpression(properties) {
  return (0, _validateNode.default)({
    type: "RecordExpression",
    properties
  });
}

function tupleExpression(elements = []) {
  return (0, _validateNode.default)({
    type: "TupleExpression",
    elements
  });
}

function decimalLiteral(value) {
  return (0, _validateNode.default)({
    type: "DecimalLiteral",
    value
  });
}

function moduleExpression(body) {
  return (0, _validateNode.default)({
    type: "ModuleExpression",
    body
  });
}

function topicReference() {
  return {
    type: "TopicReference"
  };
}

function pipelineTopicExpression(expression) {
  return (0, _validateNode.default)({
    type: "PipelineTopicExpression",
    expression
  });
}

function pipelineBareFunction(callee) {
  return (0, _validateNode.default)({
    type: "PipelineBareFunction",
    callee
  });
}

function pipelinePrimaryTopicReference() {
  return {
    type: "PipelinePrimaryTopicReference"
  };
}

function tsParameterProperty(parameter) {
  return (0, _validateNode.default)({
    type: "TSParameterProperty",
    parameter
  });
}

function tsDeclareFunction(id = null, typeParameters = null, params, returnType = null) {
  return (0, _validateNode.default)({
    type: "TSDeclareFunction",
    id,
    typeParameters,
    params,
    returnType
  });
}

function tsDeclareMethod(decorators = null, key, typeParameters = null, params, returnType = null) {
  return (0, _validateNode.default)({
    type: "TSDeclareMethod",
    decorators,
    key,
    typeParameters,
    params,
    returnType
  });
}

function tsQualifiedName(left, right) {
  return (0, _validateNode.default)({
    type: "TSQualifiedName",
    left,
    right
  });
}

function tsCallSignatureDeclaration(typeParameters = null, parameters, typeAnnotation = null) {
  return (0, _validateNode.default)({
    type: "TSCallSignatureDeclaration",
    typeParameters,
    parameters,
    typeAnnotation
  });
}

function tsConstructSignatureDeclaration(typeParameters = null, parameters, typeAnnotation = null) {
  return (0, _validateNode.default)({
    type: "TSConstructSignatureDeclaration",
    typeParameters,
    parameters,
    typeAnnotation
  });
}

function tsPropertySignature(key, typeAnnotation = null, initializer = null) {
  return (0, _validateNode.default)({
    type: "TSPropertySignature",
    key,
    typeAnnotation,
    initializer,
    kind: null
  });
}

function tsMethodSignature(key, typeParameters = null, parameters, typeAnnotation = null) {
  return (0, _validateNode.default)({
    type: "TSMethodSignature",
    key,
    typeParameters,
    parameters,
    typeAnnotation,
    kind: null
  });
}

function tsIndexSignature(parameters, typeAnnotation = null) {
  return (0, _validateNode.default)({
    type: "TSIndexSignature",
    parameters,
    typeAnnotation
  });
}

function tsAnyKeyword() {
  return {
    type: "TSAnyKeyword"
  };
}

function tsBooleanKeyword() {
  return {
    type: "TSBooleanKeyword"
  };
}

function tsBigIntKeyword() {
  return {
    type: "TSBigIntKeyword"
  };
}

function tsIntrinsicKeyword() {
  return {
    type: "TSIntrinsicKeyword"
  };
}

function tsNeverKeyword() {
  return {
    type: "TSNeverKeyword"
  };
}

function tsNullKeyword() {
  return {
    type: "TSNullKeyword"
  };
}

function tsNumberKeyword() {
  return {
    type: "TSNumberKeyword"
  };
}

function tsObjectKeyword() {
  return {
    type: "TSObjectKeyword"
  };
}

function tsStringKeyword() {
  return {
    type: "TSStringKeyword"
  };
}

function tsSymbolKeyword() {
  return {
    type: "TSSymbolKeyword"
  };
}

function tsUndefinedKeyword() {
  return {
    type: "TSUndefinedKeyword"
  };
}

function tsUnknownKeyword() {
  return {
    type: "TSUnknownKeyword"
  };
}

function tsVoidKeyword() {
  return {
    type: "TSVoidKeyword"
  };
}

function tsThisType() {
  return {
    type: "TSThisType"
  };
}

function tsFunctionType(typeParameters = null, parameters, typeAnnotation = null) {
  return (0, _validateNode.default)({
    type: "TSFunctionType",
    typeParameters,
    parameters,
    typeAnnotation
  });
}

function tsConstructorType(typeParameters = null, parameters, typeAnnotation = null) {
  return (0, _validateNode.default)({
    type: "TSConstructorType",
    typeParameters,
    parameters,
    typeAnnotation
  });
}

function tsTypeReference(typeName, typeParameters = null) {
  return (0, _validateNode.default)({
    type: "TSTypeReference",
    typeName,
    typeParameters
  });
}

function tsTypePredicate(parameterName, typeAnnotation = null, asserts = null) {
  return (0, _validateNode.default)({
    type: "TSTypePredicate",
    parameterName,
    typeAnnotation,
    asserts
  });
}

function tsTypeQuery(exprName, typeParameters = null) {
  return (0, _validateNode.default)({
    type: "TSTypeQuery",
    exprName,
    typeParameters
  });
}

function tsTypeLiteral(members) {
  return (0, _validateNode.default)({
    type: "TSTypeLiteral",
    members
  });
}

function tsArrayType(elementType) {
  return (0, _validateNode.default)({
    type: "TSArrayType",
    elementType
  });
}

function tsTupleType(elementTypes) {
  return (0, _validateNode.default)({
    type: "TSTupleType",
    elementTypes
  });
}

function tsOptionalType(typeAnnotation) {
  return (0, _validateNode.default)({
    type: "TSOptionalType",
    typeAnnotation
  });
}

function tsRestType(typeAnnotation) {
  return (0, _validateNode.default)({
    type: "TSRestType",
    typeAnnotation
  });
}

function tsNamedTupleMember(label, elementType, optional = false) {
  return (0, _validateNode.default)({
    type: "TSNamedTupleMember",
    label,
    elementType,
    optional
  });
}

function tsUnionType(types) {
  return (0, _validateNode.default)({
    type: "TSUnionType",
    types
  });
}

function tsIntersectionType(types) {
  return (0, _validateNode.default)({
    type: "TSIntersectionType",
    types
  });
}

function tsConditionalType(checkType, extendsType, trueType, falseType) {
  return (0, _validateNode.default)({
    type: "TSConditionalType",
    checkType,
    extendsType,
    trueType,
    falseType
  });
}

function tsInferType(typeParameter) {
  return (0, _validateNode.default)({
    type: "TSInferType",
    typeParameter
  });
}

function tsParenthesizedType(typeAnnotation) {
  return (0, _validateNode.default)({
    type: "TSParenthesizedType",
    typeAnnotation
  });
}

function tsTypeOperator(typeAnnotation) {
  return (0, _validateNode.default)({
    type: "TSTypeOperator",
    typeAnnotation,
    operator: null
  });
}

function tsIndexedAccessType(objectType, indexType) {
  return (0, _validateNode.default)({
    type: "TSIndexedAccessType",
    objectType,
    indexType
  });
}

function tsMappedType(typeParameter, typeAnnotation = null, nameType = null) {
  return (0, _validateNode.default)({
    type: "TSMappedType",
    typeParameter,
    typeAnnotation,
    nameType
  });
}

function tsLiteralType(literal) {
  return (0, _validateNode.default)({
    type: "TSLiteralType",
    literal
  });
}

function tsExpressionWithTypeArguments(expression, typeParameters = null) {
  return (0, _validateNode.default)({
    type: "TSExpressionWithTypeArguments",
    expression,
    typeParameters
  });
}

function tsInterfaceDeclaration(id, typeParameters = null, _extends = null, body) {
  return (0, _validateNode.default)({
    type: "TSInterfaceDeclaration",
    id,
    typeParameters,
    extends: _extends,
    body
  });
}

function tsInterfaceBody(body) {
  return (0, _validateNode.default)({
    type: "TSInterfaceBody",
    body
  });
}

function tsTypeAliasDeclaration(id, typeParameters = null, typeAnnotation) {
  return (0, _validateNode.default)({
    type: "TSTypeAliasDeclaration",
    id,
    typeParameters,
    typeAnnotation
  });
}

function tsInstantiationExpression(expression, typeParameters = null) {
  return (0, _validateNode.default)({
    type: "TSInstantiationExpression",
    expression,
    typeParameters
  });
}

function tsAsExpression(expression, typeAnnotation) {
  return (0, _validateNode.default)({
    type: "TSAsExpression",
    expression,
    typeAnnotation
  });
}

function tsTypeAssertion(typeAnnotation, expression) {
  return (0, _validateNode.default)({
    type: "TSTypeAssertion",
    typeAnnotation,
    expression
  });
}

function tsEnumDeclaration(id, members) {
  return (0, _validateNode.default)({
    type: "TSEnumDeclaration",
    id,
    members
  });
}

function tsEnumMember(id, initializer = null) {
  return (0, _validateNode.default)({
    type: "TSEnumMember",
    id,
    initializer
  });
}

function tsModuleDeclaration(id, body) {
  return (0, _validateNode.default)({
    type: "TSModuleDeclaration",
    id,
    body
  });
}

function tsModuleBlock(body) {
  return (0, _validateNode.default)({
    type: "TSModuleBlock",
    body
  });
}

function tsImportType(argument, qualifier = null, typeParameters = null) {
  return (0, _validateNode.default)({
    type: "TSImportType",
    argument,
    qualifier,
    typeParameters
  });
}

function tsImportEqualsDeclaration(id, moduleReference) {
  return (0, _validateNode.default)({
    type: "TSImportEqualsDeclaration",
    id,
    moduleReference,
    isExport: null
  });
}

function tsExternalModuleReference(expression) {
  return (0, _validateNode.default)({
    type: "TSExternalModuleReference",
    expression
  });
}

function tsNonNullExpression(expression) {
  return (0, _validateNode.default)({
    type: "TSNonNullExpression",
    expression
  });
}

function tsExportAssignment(expression) {
  return (0, _validateNode.default)({
    type: "TSExportAssignment",
    expression
  });
}

function tsNamespaceExportDeclaration(id) {
  return (0, _validateNode.default)({
    type: "TSNamespaceExportDeclaration",
    id
  });
}

function tsTypeAnnotation(typeAnnotation) {
  return (0, _validateNode.default)({
    type: "TSTypeAnnotation",
    typeAnnotation
  });
}

function tsTypeParameterInstantiation(params) {
  return (0, _validateNode.default)({
    type: "TSTypeParameterInstantiation",
    params
  });
}

function tsTypeParameterDeclaration(params) {
  return (0, _validateNode.default)({
    type: "TSTypeParameterDeclaration",
    params
  });
}

function tsTypeParameter(constraint = null, _default = null, name) {
  return (0, _validateNode.default)({
    type: "TSTypeParameter",
    constraint,
    default: _default,
    name
  });
}

function NumberLiteral(value) {
  console.trace("The node type NumberLiteral has been renamed to NumericLiteral");
  return numericLiteral(value);
}

function RegexLiteral(pattern, flags = "") {
  console.trace("The node type RegexLiteral has been renamed to RegExpLiteral");
  return regExpLiteral(pattern, flags);
}

function RestProperty(argument) {
  console.trace("The node type RestProperty has been renamed to RestElement");
  return restElement(argument);
}

function SpreadProperty(argument) {
  console.trace("The node type SpreadProperty has been renamed to SpreadElement");
  return spreadElement(argument);
}

/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = validateNode;

var _validate = __webpack_require__(57);

var _ = __webpack_require__(46);

function validateNode(node) {
  const keys = _.BUILDER_KEYS[node.type];

  for (const key of keys) {
    (0, _validate.default)(node, key, node[key]);
  }

  return node;
}

/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = validate;
exports.validateChild = validateChild;
exports.validateField = validateField;

var _definitions = __webpack_require__(58);

function validate(node, key, val) {
  if (!node) return;
  const fields = _definitions.NODE_FIELDS[node.type];
  if (!fields) return;
  const field = fields[key];
  validateField(node, key, val, field);
  validateChild(node, key, val);
}

function validateField(node, key, val, field) {
  if (!(field != null && field.validate)) return;
  if (field.optional && val == null) return;
  field.validate(node, key, val);
}

function validateChild(node, key, val) {
  if (val == null) return;
  const validate = _definitions.NODE_PARENT_VALIDATIONS[val.type];
  if (!validate) return;
  validate(node, key, val);
}

/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "ALIAS_KEYS", ({
  enumerable: true,
  get: function () {
    return _utils.ALIAS_KEYS;
  }
}));
Object.defineProperty(exports, "BUILDER_KEYS", ({
  enumerable: true,
  get: function () {
    return _utils.BUILDER_KEYS;
  }
}));
Object.defineProperty(exports, "DEPRECATED_KEYS", ({
  enumerable: true,
  get: function () {
    return _utils.DEPRECATED_KEYS;
  }
}));
Object.defineProperty(exports, "FLIPPED_ALIAS_KEYS", ({
  enumerable: true,
  get: function () {
    return _utils.FLIPPED_ALIAS_KEYS;
  }
}));
Object.defineProperty(exports, "NODE_FIELDS", ({
  enumerable: true,
  get: function () {
    return _utils.NODE_FIELDS;
  }
}));
Object.defineProperty(exports, "NODE_PARENT_VALIDATIONS", ({
  enumerable: true,
  get: function () {
    return _utils.NODE_PARENT_VALIDATIONS;
  }
}));
Object.defineProperty(exports, "PLACEHOLDERS", ({
  enumerable: true,
  get: function () {
    return _placeholders.PLACEHOLDERS;
  }
}));
Object.defineProperty(exports, "PLACEHOLDERS_ALIAS", ({
  enumerable: true,
  get: function () {
    return _placeholders.PLACEHOLDERS_ALIAS;
  }
}));
Object.defineProperty(exports, "PLACEHOLDERS_FLIPPED_ALIAS", ({
  enumerable: true,
  get: function () {
    return _placeholders.PLACEHOLDERS_FLIPPED_ALIAS;
  }
}));
exports.TYPES = void 0;
Object.defineProperty(exports, "VISITOR_KEYS", ({
  enumerable: true,
  get: function () {
    return _utils.VISITOR_KEYS;
  }
}));

var _toFastProperties = __webpack_require__(59);

__webpack_require__(60);

__webpack_require__(71);

__webpack_require__(72);

__webpack_require__(73);

__webpack_require__(75);

__webpack_require__(76);

var _utils = __webpack_require__(70);

var _placeholders = __webpack_require__(74);

_toFastProperties(_utils.VISITOR_KEYS);

_toFastProperties(_utils.ALIAS_KEYS);

_toFastProperties(_utils.FLIPPED_ALIAS_KEYS);

_toFastProperties(_utils.NODE_FIELDS);

_toFastProperties(_utils.BUILDER_KEYS);

_toFastProperties(_utils.DEPRECATED_KEYS);

_toFastProperties(_placeholders.PLACEHOLDERS_ALIAS);

_toFastProperties(_placeholders.PLACEHOLDERS_FLIPPED_ALIAS);

const TYPES = [].concat(Object.keys(_utils.VISITOR_KEYS), Object.keys(_utils.FLIPPED_ALIAS_KEYS), Object.keys(_utils.DEPRECATED_KEYS));
exports.TYPES = TYPES;

/***/ }),
/* 59 */
/***/ ((module) => {

"use strict";


let fastProto = null; // Creates an object with permanently fast properties in V8. See Toon Verwaest's
// post https://medium.com/@tverwaes/setting-up-prototypes-in-v8-ec9c9491dfe2#5f62
// for more details. Use %HasFastProperties(object) and the Node.js flag
// --allow-natives-syntax to check whether an object has fast properties.

function FastObject(o) {
  // A prototype object will have "fast properties" enabled once it is checked
  // against the inline property cache of a function, e.g. fastProto.property:
  // https://github.com/v8/v8/blob/6.0.122/test/mjsunit/fast-prototype.js#L48-L63
  if (fastProto !== null && typeof fastProto.property) {
    const result = fastProto;
    fastProto = FastObject.prototype = null;
    return result;
  }

  fastProto = FastObject.prototype = o == null ? Object.create(null) : o;
  return new FastObject();
} // Initialize the inline property cache of FastObject


FastObject();

module.exports = function toFastproperties(o) {
  return FastObject(o);
};

/***/ }),
/* 60 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(4);


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.patternLikeCommon = exports.functionTypeAnnotationCommon = exports.functionDeclarationCommon = exports.functionCommon = exports.classMethodOrPropertyCommon = exports.classMethodOrDeclareMethodCommon = void 0;

var _is = __webpack_require__(61);

var _isValidIdentifier = __webpack_require__(64);

var _helperValidatorIdentifier = __webpack_require__(65);

var _helperStringParser = __webpack_require__(68);

var _constants = __webpack_require__(69);

var _utils = __webpack_require__(70);

const defineType = (0, _utils.defineAliasedType)("Standardized");
defineType("ArrayExpression", {
  fields: {
    elements: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeOrValueType)("null", "Expression", "SpreadElement"))),
      default: !process.env.BABEL_TYPES_8_BREAKING ? [] : undefined
    }
  },
  visitor: ["elements"],
  aliases: ["Expression"]
});
defineType("AssignmentExpression", {
  fields: {
    operator: {
      validate: function () {
        if (!process.env.BABEL_TYPES_8_BREAKING) {
          return (0, _utils.assertValueType)("string");
        }

        const identifier = (0, _utils.assertOneOf)(..._constants.ASSIGNMENT_OPERATORS);
        const pattern = (0, _utils.assertOneOf)("=");
        return function (node, key, val) {
          const validator = (0, _is.default)("Pattern", node.left) ? pattern : identifier;
          validator(node, key, val);
        };
      }()
    },
    left: {
      validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, _utils.assertNodeType)("LVal") : (0, _utils.assertNodeType)("Identifier", "MemberExpression", "ArrayPattern", "ObjectPattern", "TSAsExpression", "TSTypeAssertion", "TSNonNullExpression")
    },
    right: {
      validate: (0, _utils.assertNodeType)("Expression")
    }
  },
  builder: ["operator", "left", "right"],
  visitor: ["left", "right"],
  aliases: ["Expression"]
});
defineType("BinaryExpression", {
  builder: ["operator", "left", "right"],
  fields: {
    operator: {
      validate: (0, _utils.assertOneOf)(..._constants.BINARY_OPERATORS)
    },
    left: {
      validate: function () {
        const expression = (0, _utils.assertNodeType)("Expression");
        const inOp = (0, _utils.assertNodeType)("Expression", "PrivateName");
        const validator = Object.assign(function (node, key, val) {
          const validator = node.operator === "in" ? inOp : expression;
          validator(node, key, val);
        }, {
          oneOfNodeTypes: ["Expression", "PrivateName"]
        });
        return validator;
      }()
    },
    right: {
      validate: (0, _utils.assertNodeType)("Expression")
    }
  },
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"]
});
defineType("InterpreterDirective", {
  builder: ["value"],
  fields: {
    value: {
      validate: (0, _utils.assertValueType)("string")
    }
  }
});
defineType("Directive", {
  visitor: ["value"],
  fields: {
    value: {
      validate: (0, _utils.assertNodeType)("DirectiveLiteral")
    }
  }
});
defineType("DirectiveLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: (0, _utils.assertValueType)("string")
    }
  }
});
defineType("BlockStatement", {
  builder: ["body", "directives"],
  visitor: ["directives", "body"],
  fields: {
    directives: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Directive"))),
      default: []
    },
    body: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Statement")))
    }
  },
  aliases: ["Scopable", "BlockParent", "Block", "Statement"]
});
defineType("BreakStatement", {
  visitor: ["label"],
  fields: {
    label: {
      validate: (0, _utils.assertNodeType)("Identifier"),
      optional: true
    }
  },
  aliases: ["Statement", "Terminatorless", "CompletionStatement"]
});
defineType("CallExpression", {
  visitor: ["callee", "arguments", "typeParameters", "typeArguments"],
  builder: ["callee", "arguments"],
  aliases: ["Expression"],
  fields: Object.assign({
    callee: {
      validate: (0, _utils.assertNodeType)("Expression", "Super", "V8IntrinsicIdentifier")
    },
    arguments: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Expression", "SpreadElement", "JSXNamespacedName", "ArgumentPlaceholder")))
    }
  }, !process.env.BABEL_TYPES_8_BREAKING ? {
    optional: {
      validate: (0, _utils.assertOneOf)(true, false),
      optional: true
    }
  } : {}, {
    typeArguments: {
      validate: (0, _utils.assertNodeType)("TypeParameterInstantiation"),
      optional: true
    },
    typeParameters: {
      validate: (0, _utils.assertNodeType)("TSTypeParameterInstantiation"),
      optional: true
    }
  })
});
defineType("CatchClause", {
  visitor: ["param", "body"],
  fields: {
    param: {
      validate: (0, _utils.assertNodeType)("Identifier", "ArrayPattern", "ObjectPattern"),
      optional: true
    },
    body: {
      validate: (0, _utils.assertNodeType)("BlockStatement")
    }
  },
  aliases: ["Scopable", "BlockParent"]
});
defineType("ConditionalExpression", {
  visitor: ["test", "consequent", "alternate"],
  fields: {
    test: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    consequent: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    alternate: {
      validate: (0, _utils.assertNodeType)("Expression")
    }
  },
  aliases: ["Expression", "Conditional"]
});
defineType("ContinueStatement", {
  visitor: ["label"],
  fields: {
    label: {
      validate: (0, _utils.assertNodeType)("Identifier"),
      optional: true
    }
  },
  aliases: ["Statement", "Terminatorless", "CompletionStatement"]
});
defineType("DebuggerStatement", {
  aliases: ["Statement"]
});
defineType("DoWhileStatement", {
  visitor: ["test", "body"],
  fields: {
    test: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    body: {
      validate: (0, _utils.assertNodeType)("Statement")
    }
  },
  aliases: ["Statement", "BlockParent", "Loop", "While", "Scopable"]
});
defineType("EmptyStatement", {
  aliases: ["Statement"]
});
defineType("ExpressionStatement", {
  visitor: ["expression"],
  fields: {
    expression: {
      validate: (0, _utils.assertNodeType)("Expression")
    }
  },
  aliases: ["Statement", "ExpressionWrapper"]
});
defineType("File", {
  builder: ["program", "comments", "tokens"],
  visitor: ["program"],
  fields: {
    program: {
      validate: (0, _utils.assertNodeType)("Program")
    },
    comments: {
      validate: !process.env.BABEL_TYPES_8_BREAKING ? Object.assign(() => {}, {
        each: {
          oneOfNodeTypes: ["CommentBlock", "CommentLine"]
        }
      }) : (0, _utils.assertEach)((0, _utils.assertNodeType)("CommentBlock", "CommentLine")),
      optional: true
    },
    tokens: {
      validate: (0, _utils.assertEach)(Object.assign(() => {}, {
        type: "any"
      })),
      optional: true
    }
  }
});
defineType("ForInStatement", {
  visitor: ["left", "right", "body"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop", "ForXStatement"],
  fields: {
    left: {
      validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, _utils.assertNodeType)("VariableDeclaration", "LVal") : (0, _utils.assertNodeType)("VariableDeclaration", "Identifier", "MemberExpression", "ArrayPattern", "ObjectPattern", "TSAsExpression", "TSTypeAssertion", "TSNonNullExpression")
    },
    right: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    body: {
      validate: (0, _utils.assertNodeType)("Statement")
    }
  }
});
defineType("ForStatement", {
  visitor: ["init", "test", "update", "body"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop"],
  fields: {
    init: {
      validate: (0, _utils.assertNodeType)("VariableDeclaration", "Expression"),
      optional: true
    },
    test: {
      validate: (0, _utils.assertNodeType)("Expression"),
      optional: true
    },
    update: {
      validate: (0, _utils.assertNodeType)("Expression"),
      optional: true
    },
    body: {
      validate: (0, _utils.assertNodeType)("Statement")
    }
  }
});

const functionCommon = () => ({
  params: {
    validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Identifier", "Pattern", "RestElement")))
  },
  generator: {
    default: false
  },
  async: {
    default: false
  }
});

exports.functionCommon = functionCommon;

const functionTypeAnnotationCommon = () => ({
  returnType: {
    validate: (0, _utils.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
    optional: true
  },
  typeParameters: {
    validate: (0, _utils.assertNodeType)("TypeParameterDeclaration", "TSTypeParameterDeclaration", "Noop"),
    optional: true
  }
});

exports.functionTypeAnnotationCommon = functionTypeAnnotationCommon;

const functionDeclarationCommon = () => Object.assign({}, functionCommon(), {
  declare: {
    validate: (0, _utils.assertValueType)("boolean"),
    optional: true
  },
  id: {
    validate: (0, _utils.assertNodeType)("Identifier"),
    optional: true
  }
});

exports.functionDeclarationCommon = functionDeclarationCommon;
defineType("FunctionDeclaration", {
  builder: ["id", "params", "body", "generator", "async"],
  visitor: ["id", "params", "body", "returnType", "typeParameters"],
  fields: Object.assign({}, functionDeclarationCommon(), functionTypeAnnotationCommon(), {
    body: {
      validate: (0, _utils.assertNodeType)("BlockStatement")
    },
    predicate: {
      validate: (0, _utils.assertNodeType)("DeclaredPredicate", "InferredPredicate"),
      optional: true
    }
  }),
  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Statement", "Pureish", "Declaration"],
  validate: function () {
    if (!process.env.BABEL_TYPES_8_BREAKING) return () => {};
    const identifier = (0, _utils.assertNodeType)("Identifier");
    return function (parent, key, node) {
      if (!(0, _is.default)("ExportDefaultDeclaration", parent)) {
        identifier(node, "id", node.id);
      }
    };
  }()
});
defineType("FunctionExpression", {
  inherits: "FunctionDeclaration",
  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Expression", "Pureish"],
  fields: Object.assign({}, functionCommon(), functionTypeAnnotationCommon(), {
    id: {
      validate: (0, _utils.assertNodeType)("Identifier"),
      optional: true
    },
    body: {
      validate: (0, _utils.assertNodeType)("BlockStatement")
    },
    predicate: {
      validate: (0, _utils.assertNodeType)("DeclaredPredicate", "InferredPredicate"),
      optional: true
    }
  })
});

const patternLikeCommon = () => ({
  typeAnnotation: {
    validate: (0, _utils.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
    optional: true
  },
  decorators: {
    validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Decorator"))),
    optional: true
  }
});

exports.patternLikeCommon = patternLikeCommon;
defineType("Identifier", {
  builder: ["name"],
  visitor: ["typeAnnotation", "decorators"],
  aliases: ["Expression", "PatternLike", "LVal", "TSEntityName"],
  fields: Object.assign({}, patternLikeCommon(), {
    name: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("string"), Object.assign(function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;

        if (!(0, _isValidIdentifier.default)(val, false)) {
          throw new TypeError(`"${val}" is not a valid identifier name`);
        }
      }, {
        type: "string"
      }))
    },
    optional: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    }
  }),

  validate(parent, key, node) {
    if (!process.env.BABEL_TYPES_8_BREAKING) return;
    const match = /\.(\w+)$/.exec(key);
    if (!match) return;
    const [, parentKey] = match;
    const nonComp = {
      computed: false
    };

    if (parentKey === "property") {
      if ((0, _is.default)("MemberExpression", parent, nonComp)) return;
      if ((0, _is.default)("OptionalMemberExpression", parent, nonComp)) return;
    } else if (parentKey === "key") {
      if ((0, _is.default)("Property", parent, nonComp)) return;
      if ((0, _is.default)("Method", parent, nonComp)) return;
    } else if (parentKey === "exported") {
      if ((0, _is.default)("ExportSpecifier", parent)) return;
    } else if (parentKey === "imported") {
      if ((0, _is.default)("ImportSpecifier", parent, {
        imported: node
      })) return;
    } else if (parentKey === "meta") {
      if ((0, _is.default)("MetaProperty", parent, {
        meta: node
      })) return;
    }

    if (((0, _helperValidatorIdentifier.isKeyword)(node.name) || (0, _helperValidatorIdentifier.isReservedWord)(node.name, false)) && node.name !== "this") {
      throw new TypeError(`"${node.name}" is not a valid identifier`);
    }
  }

});
defineType("IfStatement", {
  visitor: ["test", "consequent", "alternate"],
  aliases: ["Statement", "Conditional"],
  fields: {
    test: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    consequent: {
      validate: (0, _utils.assertNodeType)("Statement")
    },
    alternate: {
      optional: true,
      validate: (0, _utils.assertNodeType)("Statement")
    }
  }
});
defineType("LabeledStatement", {
  visitor: ["label", "body"],
  aliases: ["Statement"],
  fields: {
    label: {
      validate: (0, _utils.assertNodeType)("Identifier")
    },
    body: {
      validate: (0, _utils.assertNodeType)("Statement")
    }
  }
});
defineType("StringLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: (0, _utils.assertValueType)("string")
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
defineType("NumericLiteral", {
  builder: ["value"],
  deprecatedAlias: "NumberLiteral",
  fields: {
    value: {
      validate: (0, _utils.assertValueType)("number")
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
defineType("NullLiteral", {
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
defineType("BooleanLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: (0, _utils.assertValueType)("boolean")
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
defineType("RegExpLiteral", {
  builder: ["pattern", "flags"],
  deprecatedAlias: "RegexLiteral",
  aliases: ["Expression", "Pureish", "Literal"],
  fields: {
    pattern: {
      validate: (0, _utils.assertValueType)("string")
    },
    flags: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("string"), Object.assign(function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;
        const invalid = /[^gimsuy]/.exec(val);

        if (invalid) {
          throw new TypeError(`"${invalid[0]}" is not a valid RegExp flag`);
        }
      }, {
        type: "string"
      })),
      default: ""
    }
  }
});
defineType("LogicalExpression", {
  builder: ["operator", "left", "right"],
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"],
  fields: {
    operator: {
      validate: (0, _utils.assertOneOf)(..._constants.LOGICAL_OPERATORS)
    },
    left: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    right: {
      validate: (0, _utils.assertNodeType)("Expression")
    }
  }
});
defineType("MemberExpression", {
  builder: ["object", "property", "computed", ...(!process.env.BABEL_TYPES_8_BREAKING ? ["optional"] : [])],
  visitor: ["object", "property"],
  aliases: ["Expression", "LVal"],
  fields: Object.assign({
    object: {
      validate: (0, _utils.assertNodeType)("Expression", "Super")
    },
    property: {
      validate: function () {
        const normal = (0, _utils.assertNodeType)("Identifier", "PrivateName");
        const computed = (0, _utils.assertNodeType)("Expression");

        const validator = function (node, key, val) {
          const validator = node.computed ? computed : normal;
          validator(node, key, val);
        };

        validator.oneOfNodeTypes = ["Expression", "Identifier", "PrivateName"];
        return validator;
      }()
    },
    computed: {
      default: false
    }
  }, !process.env.BABEL_TYPES_8_BREAKING ? {
    optional: {
      validate: (0, _utils.assertOneOf)(true, false),
      optional: true
    }
  } : {})
});
defineType("NewExpression", {
  inherits: "CallExpression"
});
defineType("Program", {
  visitor: ["directives", "body"],
  builder: ["body", "directives", "sourceType", "interpreter"],
  fields: {
    sourceFile: {
      validate: (0, _utils.assertValueType)("string")
    },
    sourceType: {
      validate: (0, _utils.assertOneOf)("script", "module"),
      default: "script"
    },
    interpreter: {
      validate: (0, _utils.assertNodeType)("InterpreterDirective"),
      default: null,
      optional: true
    },
    directives: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Directive"))),
      default: []
    },
    body: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Statement")))
    }
  },
  aliases: ["Scopable", "BlockParent", "Block"]
});
defineType("ObjectExpression", {
  visitor: ["properties"],
  aliases: ["Expression"],
  fields: {
    properties: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("ObjectMethod", "ObjectProperty", "SpreadElement")))
    }
  }
});
defineType("ObjectMethod", {
  builder: ["kind", "key", "params", "body", "computed", "generator", "async"],
  fields: Object.assign({}, functionCommon(), functionTypeAnnotationCommon(), {
    kind: Object.assign({
      validate: (0, _utils.assertOneOf)("method", "get", "set")
    }, !process.env.BABEL_TYPES_8_BREAKING ? {
      default: "method"
    } : {}),
    computed: {
      default: false
    },
    key: {
      validate: function () {
        const normal = (0, _utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral");
        const computed = (0, _utils.assertNodeType)("Expression");

        const validator = function (node, key, val) {
          const validator = node.computed ? computed : normal;
          validator(node, key, val);
        };

        validator.oneOfNodeTypes = ["Expression", "Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral"];
        return validator;
      }()
    },
    decorators: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Decorator"))),
      optional: true
    },
    body: {
      validate: (0, _utils.assertNodeType)("BlockStatement")
    }
  }),
  visitor: ["key", "params", "body", "decorators", "returnType", "typeParameters"],
  aliases: ["UserWhitespacable", "Function", "Scopable", "BlockParent", "FunctionParent", "Method", "ObjectMember"]
});
defineType("ObjectProperty", {
  builder: ["key", "value", "computed", "shorthand", ...(!process.env.BABEL_TYPES_8_BREAKING ? ["decorators"] : [])],
  fields: {
    computed: {
      default: false
    },
    key: {
      validate: function () {
        const normal = (0, _utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "DecimalLiteral", "PrivateName");
        const computed = (0, _utils.assertNodeType)("Expression");
        const validator = Object.assign(function (node, key, val) {
          const validator = node.computed ? computed : normal;
          validator(node, key, val);
        }, {
          oneOfNodeTypes: ["Expression", "Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "DecimalLiteral", "PrivateName"]
        });
        return validator;
      }()
    },
    value: {
      validate: (0, _utils.assertNodeType)("Expression", "PatternLike")
    },
    shorthand: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("boolean"), Object.assign(function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;

        if (val && node.computed) {
          throw new TypeError("Property shorthand of ObjectProperty cannot be true if computed is true");
        }
      }, {
        type: "boolean"
      }), function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;

        if (val && !(0, _is.default)("Identifier", node.key)) {
          throw new TypeError("Property shorthand of ObjectProperty cannot be true if key is not an Identifier");
        }
      }),
      default: false
    },
    decorators: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Decorator"))),
      optional: true
    }
  },
  visitor: ["key", "value", "decorators"],
  aliases: ["UserWhitespacable", "Property", "ObjectMember"],
  validate: function () {
    const pattern = (0, _utils.assertNodeType)("Identifier", "Pattern", "TSAsExpression", "TSNonNullExpression", "TSTypeAssertion");
    const expression = (0, _utils.assertNodeType)("Expression");
    return function (parent, key, node) {
      if (!process.env.BABEL_TYPES_8_BREAKING) return;
      const validator = (0, _is.default)("ObjectPattern", parent) ? pattern : expression;
      validator(node, "value", node.value);
    };
  }()
});
defineType("RestElement", {
  visitor: ["argument", "typeAnnotation"],
  builder: ["argument"],
  aliases: ["LVal", "PatternLike"],
  deprecatedAlias: "RestProperty",
  fields: Object.assign({}, patternLikeCommon(), {
    argument: {
      validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, _utils.assertNodeType)("LVal") : (0, _utils.assertNodeType)("Identifier", "ArrayPattern", "ObjectPattern", "MemberExpression", "TSAsExpression", "TSTypeAssertion", "TSNonNullExpression")
    },
    optional: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    }
  }),

  validate(parent, key) {
    if (!process.env.BABEL_TYPES_8_BREAKING) return;
    const match = /(\w+)\[(\d+)\]/.exec(key);
    if (!match) throw new Error("Internal Babel error: malformed key.");
    const [, listKey, index] = match;

    if (parent[listKey].length > +index + 1) {
      throw new TypeError(`RestElement must be last element of ${listKey}`);
    }
  }

});
defineType("ReturnStatement", {
  visitor: ["argument"],
  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
  fields: {
    argument: {
      validate: (0, _utils.assertNodeType)("Expression"),
      optional: true
    }
  }
});
defineType("SequenceExpression", {
  visitor: ["expressions"],
  fields: {
    expressions: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Expression")))
    }
  },
  aliases: ["Expression"]
});
defineType("ParenthesizedExpression", {
  visitor: ["expression"],
  aliases: ["Expression", "ExpressionWrapper"],
  fields: {
    expression: {
      validate: (0, _utils.assertNodeType)("Expression")
    }
  }
});
defineType("SwitchCase", {
  visitor: ["test", "consequent"],
  fields: {
    test: {
      validate: (0, _utils.assertNodeType)("Expression"),
      optional: true
    },
    consequent: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Statement")))
    }
  }
});
defineType("SwitchStatement", {
  visitor: ["discriminant", "cases"],
  aliases: ["Statement", "BlockParent", "Scopable"],
  fields: {
    discriminant: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    cases: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("SwitchCase")))
    }
  }
});
defineType("ThisExpression", {
  aliases: ["Expression"]
});
defineType("ThrowStatement", {
  visitor: ["argument"],
  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
  fields: {
    argument: {
      validate: (0, _utils.assertNodeType)("Expression")
    }
  }
});
defineType("TryStatement", {
  visitor: ["block", "handler", "finalizer"],
  aliases: ["Statement"],
  fields: {
    block: {
      validate: (0, _utils.chain)((0, _utils.assertNodeType)("BlockStatement"), Object.assign(function (node) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;

        if (!node.handler && !node.finalizer) {
          throw new TypeError("TryStatement expects either a handler or finalizer, or both");
        }
      }, {
        oneOfNodeTypes: ["BlockStatement"]
      }))
    },
    handler: {
      optional: true,
      validate: (0, _utils.assertNodeType)("CatchClause")
    },
    finalizer: {
      optional: true,
      validate: (0, _utils.assertNodeType)("BlockStatement")
    }
  }
});
defineType("UnaryExpression", {
  builder: ["operator", "argument", "prefix"],
  fields: {
    prefix: {
      default: true
    },
    argument: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    operator: {
      validate: (0, _utils.assertOneOf)(..._constants.UNARY_OPERATORS)
    }
  },
  visitor: ["argument"],
  aliases: ["UnaryLike", "Expression"]
});
defineType("UpdateExpression", {
  builder: ["operator", "argument", "prefix"],
  fields: {
    prefix: {
      default: false
    },
    argument: {
      validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, _utils.assertNodeType)("Expression") : (0, _utils.assertNodeType)("Identifier", "MemberExpression")
    },
    operator: {
      validate: (0, _utils.assertOneOf)(..._constants.UPDATE_OPERATORS)
    }
  },
  visitor: ["argument"],
  aliases: ["Expression"]
});
defineType("VariableDeclaration", {
  builder: ["kind", "declarations"],
  visitor: ["declarations"],
  aliases: ["Statement", "Declaration"],
  fields: {
    declare: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    },
    kind: {
      validate: (0, _utils.assertOneOf)("var", "let", "const")
    },
    declarations: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("VariableDeclarator")))
    }
  },

  validate(parent, key, node) {
    if (!process.env.BABEL_TYPES_8_BREAKING) return;
    if (!(0, _is.default)("ForXStatement", parent, {
      left: node
    })) return;

    if (node.declarations.length !== 1) {
      throw new TypeError(`Exactly one VariableDeclarator is required in the VariableDeclaration of a ${parent.type}`);
    }
  }

});
defineType("VariableDeclarator", {
  visitor: ["id", "init"],
  fields: {
    id: {
      validate: function () {
        if (!process.env.BABEL_TYPES_8_BREAKING) {
          return (0, _utils.assertNodeType)("LVal");
        }

        const normal = (0, _utils.assertNodeType)("Identifier", "ArrayPattern", "ObjectPattern");
        const without = (0, _utils.assertNodeType)("Identifier");
        return function (node, key, val) {
          const validator = node.init ? normal : without;
          validator(node, key, val);
        };
      }()
    },
    definite: {
      optional: true,
      validate: (0, _utils.assertValueType)("boolean")
    },
    init: {
      optional: true,
      validate: (0, _utils.assertNodeType)("Expression")
    }
  }
});
defineType("WhileStatement", {
  visitor: ["test", "body"],
  aliases: ["Statement", "BlockParent", "Loop", "While", "Scopable"],
  fields: {
    test: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    body: {
      validate: (0, _utils.assertNodeType)("Statement")
    }
  }
});
defineType("WithStatement", {
  visitor: ["object", "body"],
  aliases: ["Statement"],
  fields: {
    object: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    body: {
      validate: (0, _utils.assertNodeType)("Statement")
    }
  }
});
defineType("AssignmentPattern", {
  visitor: ["left", "right", "decorators"],
  builder: ["left", "right"],
  aliases: ["Pattern", "PatternLike", "LVal"],
  fields: Object.assign({}, patternLikeCommon(), {
    left: {
      validate: (0, _utils.assertNodeType)("Identifier", "ObjectPattern", "ArrayPattern", "MemberExpression", "TSAsExpression", "TSTypeAssertion", "TSNonNullExpression")
    },
    right: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    decorators: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Decorator"))),
      optional: true
    }
  })
});
defineType("ArrayPattern", {
  visitor: ["elements", "typeAnnotation"],
  builder: ["elements"],
  aliases: ["Pattern", "PatternLike", "LVal"],
  fields: Object.assign({}, patternLikeCommon(), {
    elements: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeOrValueType)("null", "PatternLike", "LVal")))
    },
    decorators: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Decorator"))),
      optional: true
    },
    optional: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    }
  })
});
defineType("ArrowFunctionExpression", {
  builder: ["params", "body", "async"],
  visitor: ["params", "body", "returnType", "typeParameters"],
  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Expression", "Pureish"],
  fields: Object.assign({}, functionCommon(), functionTypeAnnotationCommon(), {
    expression: {
      validate: (0, _utils.assertValueType)("boolean")
    },
    body: {
      validate: (0, _utils.assertNodeType)("BlockStatement", "Expression")
    },
    predicate: {
      validate: (0, _utils.assertNodeType)("DeclaredPredicate", "InferredPredicate"),
      optional: true
    }
  })
});
defineType("ClassBody", {
  visitor: ["body"],
  fields: {
    body: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("ClassMethod", "ClassPrivateMethod", "ClassProperty", "ClassPrivateProperty", "ClassAccessorProperty", "TSDeclareMethod", "TSIndexSignature", "StaticBlock")))
    }
  }
});
defineType("ClassExpression", {
  builder: ["id", "superClass", "body", "decorators"],
  visitor: ["id", "body", "superClass", "mixins", "typeParameters", "superTypeParameters", "implements", "decorators"],
  aliases: ["Scopable", "Class", "Expression"],
  fields: {
    id: {
      validate: (0, _utils.assertNodeType)("Identifier"),
      optional: true
    },
    typeParameters: {
      validate: (0, _utils.assertNodeType)("TypeParameterDeclaration", "TSTypeParameterDeclaration", "Noop"),
      optional: true
    },
    body: {
      validate: (0, _utils.assertNodeType)("ClassBody")
    },
    superClass: {
      optional: true,
      validate: (0, _utils.assertNodeType)("Expression")
    },
    superTypeParameters: {
      validate: (0, _utils.assertNodeType)("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
      optional: true
    },
    implements: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("TSExpressionWithTypeArguments", "ClassImplements"))),
      optional: true
    },
    decorators: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Decorator"))),
      optional: true
    },
    mixins: {
      validate: (0, _utils.assertNodeType)("InterfaceExtends"),
      optional: true
    }
  }
});
defineType("ClassDeclaration", {
  inherits: "ClassExpression",
  aliases: ["Scopable", "Class", "Statement", "Declaration"],
  fields: {
    id: {
      validate: (0, _utils.assertNodeType)("Identifier")
    },
    typeParameters: {
      validate: (0, _utils.assertNodeType)("TypeParameterDeclaration", "TSTypeParameterDeclaration", "Noop"),
      optional: true
    },
    body: {
      validate: (0, _utils.assertNodeType)("ClassBody")
    },
    superClass: {
      optional: true,
      validate: (0, _utils.assertNodeType)("Expression")
    },
    superTypeParameters: {
      validate: (0, _utils.assertNodeType)("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
      optional: true
    },
    implements: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("TSExpressionWithTypeArguments", "ClassImplements"))),
      optional: true
    },
    decorators: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Decorator"))),
      optional: true
    },
    mixins: {
      validate: (0, _utils.assertNodeType)("InterfaceExtends"),
      optional: true
    },
    declare: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    },
    abstract: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    }
  },
  validate: function () {
    const identifier = (0, _utils.assertNodeType)("Identifier");
    return function (parent, key, node) {
      if (!process.env.BABEL_TYPES_8_BREAKING) return;

      if (!(0, _is.default)("ExportDefaultDeclaration", parent)) {
        identifier(node, "id", node.id);
      }
    };
  }()
});
defineType("ExportAllDeclaration", {
  visitor: ["source"],
  aliases: ["Statement", "Declaration", "ModuleDeclaration", "ExportDeclaration"],
  fields: {
    source: {
      validate: (0, _utils.assertNodeType)("StringLiteral")
    },
    exportKind: (0, _utils.validateOptional)((0, _utils.assertOneOf)("type", "value")),
    assertions: {
      optional: true,
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("ImportAttribute")))
    }
  }
});
defineType("ExportDefaultDeclaration", {
  visitor: ["declaration"],
  aliases: ["Statement", "Declaration", "ModuleDeclaration", "ExportDeclaration"],
  fields: {
    declaration: {
      validate: (0, _utils.assertNodeType)("TSDeclareFunction", "FunctionDeclaration", "ClassDeclaration", "Expression")
    },
    exportKind: (0, _utils.validateOptional)((0, _utils.assertOneOf)("value"))
  }
});
defineType("ExportNamedDeclaration", {
  visitor: ["declaration", "specifiers", "source"],
  aliases: ["Statement", "Declaration", "ModuleDeclaration", "ExportDeclaration"],
  fields: {
    declaration: {
      optional: true,
      validate: (0, _utils.chain)((0, _utils.assertNodeType)("Declaration"), Object.assign(function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;

        if (val && node.specifiers.length) {
          throw new TypeError("Only declaration or specifiers is allowed on ExportNamedDeclaration");
        }
      }, {
        oneOfNodeTypes: ["Declaration"]
      }), function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;

        if (val && node.source) {
          throw new TypeError("Cannot export a declaration from a source");
        }
      })
    },
    assertions: {
      optional: true,
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("ImportAttribute")))
    },
    specifiers: {
      default: [],
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)(function () {
        const sourced = (0, _utils.assertNodeType)("ExportSpecifier", "ExportDefaultSpecifier", "ExportNamespaceSpecifier");
        const sourceless = (0, _utils.assertNodeType)("ExportSpecifier");
        if (!process.env.BABEL_TYPES_8_BREAKING) return sourced;
        return function (node, key, val) {
          const validator = node.source ? sourced : sourceless;
          validator(node, key, val);
        };
      }()))
    },
    source: {
      validate: (0, _utils.assertNodeType)("StringLiteral"),
      optional: true
    },
    exportKind: (0, _utils.validateOptional)((0, _utils.assertOneOf)("type", "value"))
  }
});
defineType("ExportSpecifier", {
  visitor: ["local", "exported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: (0, _utils.assertNodeType)("Identifier")
    },
    exported: {
      validate: (0, _utils.assertNodeType)("Identifier", "StringLiteral")
    },
    exportKind: {
      validate: (0, _utils.assertOneOf)("type", "value"),
      optional: true
    }
  }
});
defineType("ForOfStatement", {
  visitor: ["left", "right", "body"],
  builder: ["left", "right", "body", "await"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop", "ForXStatement"],
  fields: {
    left: {
      validate: function () {
        if (!process.env.BABEL_TYPES_8_BREAKING) {
          return (0, _utils.assertNodeType)("VariableDeclaration", "LVal");
        }

        const declaration = (0, _utils.assertNodeType)("VariableDeclaration");
        const lval = (0, _utils.assertNodeType)("Identifier", "MemberExpression", "ArrayPattern", "ObjectPattern", "TSAsExpression", "TSTypeAssertion", "TSNonNullExpression");
        return function (node, key, val) {
          if ((0, _is.default)("VariableDeclaration", val)) {
            declaration(node, key, val);
          } else {
            lval(node, key, val);
          }
        };
      }()
    },
    right: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    body: {
      validate: (0, _utils.assertNodeType)("Statement")
    },
    await: {
      default: false
    }
  }
});
defineType("ImportDeclaration", {
  visitor: ["specifiers", "source"],
  aliases: ["Statement", "Declaration", "ModuleDeclaration"],
  fields: {
    assertions: {
      optional: true,
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("ImportAttribute")))
    },
    specifiers: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("ImportSpecifier", "ImportDefaultSpecifier", "ImportNamespaceSpecifier")))
    },
    source: {
      validate: (0, _utils.assertNodeType)("StringLiteral")
    },
    importKind: {
      validate: (0, _utils.assertOneOf)("type", "typeof", "value"),
      optional: true
    }
  }
});
defineType("ImportDefaultSpecifier", {
  visitor: ["local"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: (0, _utils.assertNodeType)("Identifier")
    }
  }
});
defineType("ImportNamespaceSpecifier", {
  visitor: ["local"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: (0, _utils.assertNodeType)("Identifier")
    }
  }
});
defineType("ImportSpecifier", {
  visitor: ["local", "imported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: {
      validate: (0, _utils.assertNodeType)("Identifier")
    },
    imported: {
      validate: (0, _utils.assertNodeType)("Identifier", "StringLiteral")
    },
    importKind: {
      validate: (0, _utils.assertOneOf)("type", "typeof", "value"),
      optional: true
    }
  }
});
defineType("MetaProperty", {
  visitor: ["meta", "property"],
  aliases: ["Expression"],
  fields: {
    meta: {
      validate: (0, _utils.chain)((0, _utils.assertNodeType)("Identifier"), Object.assign(function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;
        let property;

        switch (val.name) {
          case "function":
            property = "sent";
            break;

          case "new":
            property = "target";
            break;

          case "import":
            property = "meta";
            break;
        }

        if (!(0, _is.default)("Identifier", node.property, {
          name: property
        })) {
          throw new TypeError("Unrecognised MetaProperty");
        }
      }, {
        oneOfNodeTypes: ["Identifier"]
      }))
    },
    property: {
      validate: (0, _utils.assertNodeType)("Identifier")
    }
  }
});

const classMethodOrPropertyCommon = () => ({
  abstract: {
    validate: (0, _utils.assertValueType)("boolean"),
    optional: true
  },
  accessibility: {
    validate: (0, _utils.assertOneOf)("public", "private", "protected"),
    optional: true
  },
  static: {
    default: false
  },
  override: {
    default: false
  },
  computed: {
    default: false
  },
  optional: {
    validate: (0, _utils.assertValueType)("boolean"),
    optional: true
  },
  key: {
    validate: (0, _utils.chain)(function () {
      const normal = (0, _utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral");
      const computed = (0, _utils.assertNodeType)("Expression");
      return function (node, key, val) {
        const validator = node.computed ? computed : normal;
        validator(node, key, val);
      };
    }(), (0, _utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "Expression"))
  }
});

exports.classMethodOrPropertyCommon = classMethodOrPropertyCommon;

const classMethodOrDeclareMethodCommon = () => Object.assign({}, functionCommon(), classMethodOrPropertyCommon(), {
  params: {
    validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Identifier", "Pattern", "RestElement", "TSParameterProperty")))
  },
  kind: {
    validate: (0, _utils.assertOneOf)("get", "set", "method", "constructor"),
    default: "method"
  },
  access: {
    validate: (0, _utils.chain)((0, _utils.assertValueType)("string"), (0, _utils.assertOneOf)("public", "private", "protected")),
    optional: true
  },
  decorators: {
    validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Decorator"))),
    optional: true
  }
});

exports.classMethodOrDeclareMethodCommon = classMethodOrDeclareMethodCommon;
defineType("ClassMethod", {
  aliases: ["Function", "Scopable", "BlockParent", "FunctionParent", "Method"],
  builder: ["kind", "key", "params", "body", "computed", "static", "generator", "async"],
  visitor: ["key", "params", "body", "decorators", "returnType", "typeParameters"],
  fields: Object.assign({}, classMethodOrDeclareMethodCommon(), functionTypeAnnotationCommon(), {
    body: {
      validate: (0, _utils.assertNodeType)("BlockStatement")
    }
  })
});
defineType("ObjectPattern", {
  visitor: ["properties", "typeAnnotation", "decorators"],
  builder: ["properties"],
  aliases: ["Pattern", "PatternLike", "LVal"],
  fields: Object.assign({}, patternLikeCommon(), {
    properties: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("RestElement", "ObjectProperty")))
    }
  })
});
defineType("SpreadElement", {
  visitor: ["argument"],
  aliases: ["UnaryLike"],
  deprecatedAlias: "SpreadProperty",
  fields: {
    argument: {
      validate: (0, _utils.assertNodeType)("Expression")
    }
  }
});
defineType("Super", {
  aliases: ["Expression"]
});
defineType("TaggedTemplateExpression", {
  visitor: ["tag", "quasi", "typeParameters"],
  builder: ["tag", "quasi"],
  aliases: ["Expression"],
  fields: {
    tag: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    quasi: {
      validate: (0, _utils.assertNodeType)("TemplateLiteral")
    },
    typeParameters: {
      validate: (0, _utils.assertNodeType)("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
      optional: true
    }
  }
});
defineType("TemplateElement", {
  builder: ["value", "tail"],
  fields: {
    value: {
      validate: (0, _utils.chain)((0, _utils.assertShape)({
        raw: {
          validate: (0, _utils.assertValueType)("string")
        },
        cooked: {
          validate: (0, _utils.assertValueType)("string"),
          optional: true
        }
      }), function templateElementCookedValidator(node) {
        const raw = node.value.raw;
        let str,
            containsInvalid,
            unterminatedCalled = false;

        try {
          const error = () => {
            throw new Error();
          };

          ({
            str,
            containsInvalid
          } = (0, _helperStringParser.readStringContents)("template", raw, 0, 0, 0, {
            unterminated() {
              unterminatedCalled = true;
            },

            strictNumericEscape: error,
            invalidEscapeSequence: error,
            numericSeparatorInEscapeSequence: error,
            unexpectedNumericSeparator: error,
            invalidDigit: error,
            invalidCodePoint: error
          }));
        } catch (_unused) {
          unterminatedCalled = true;
          containsInvalid = true;
        }

        if (!unterminatedCalled) throw new Error("Invalid raw");
        node.value.cooked = containsInvalid ? null : str;
      })
    },
    tail: {
      default: false
    }
  }
});
defineType("TemplateLiteral", {
  visitor: ["quasis", "expressions"],
  aliases: ["Expression", "Literal"],
  fields: {
    quasis: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("TemplateElement")))
    },
    expressions: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Expression", "TSType")), function (node, key, val) {
        if (node.quasis.length !== val.length + 1) {
          throw new TypeError(`Number of ${node.type} quasis should be exactly one more than the number of expressions.\nExpected ${val.length + 1} quasis but got ${node.quasis.length}`);
        }
      })
    }
  }
});
defineType("YieldExpression", {
  builder: ["argument", "delegate"],
  visitor: ["argument"],
  aliases: ["Expression", "Terminatorless"],
  fields: {
    delegate: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("boolean"), Object.assign(function (node, key, val) {
        if (!process.env.BABEL_TYPES_8_BREAKING) return;

        if (val && !node.argument) {
          throw new TypeError("Property delegate of YieldExpression cannot be true if there is no argument");
        }
      }, {
        type: "boolean"
      })),
      default: false
    },
    argument: {
      optional: true,
      validate: (0, _utils.assertNodeType)("Expression")
    }
  }
});
defineType("AwaitExpression", {
  builder: ["argument"],
  visitor: ["argument"],
  aliases: ["Expression", "Terminatorless"],
  fields: {
    argument: {
      validate: (0, _utils.assertNodeType)("Expression")
    }
  }
});
defineType("Import", {
  aliases: ["Expression"]
});
defineType("BigIntLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: (0, _utils.assertValueType)("string")
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
defineType("ExportNamespaceSpecifier", {
  visitor: ["exported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    exported: {
      validate: (0, _utils.assertNodeType)("Identifier")
    }
  }
});
defineType("OptionalMemberExpression", {
  builder: ["object", "property", "computed", "optional"],
  visitor: ["object", "property"],
  aliases: ["Expression"],
  fields: {
    object: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    property: {
      validate: function () {
        const normal = (0, _utils.assertNodeType)("Identifier");
        const computed = (0, _utils.assertNodeType)("Expression");
        const validator = Object.assign(function (node, key, val) {
          const validator = node.computed ? computed : normal;
          validator(node, key, val);
        }, {
          oneOfNodeTypes: ["Expression", "Identifier"]
        });
        return validator;
      }()
    },
    computed: {
      default: false
    },
    optional: {
      validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, _utils.assertValueType)("boolean") : (0, _utils.chain)((0, _utils.assertValueType)("boolean"), (0, _utils.assertOptionalChainStart)())
    }
  }
});
defineType("OptionalCallExpression", {
  visitor: ["callee", "arguments", "typeParameters", "typeArguments"],
  builder: ["callee", "arguments", "optional"],
  aliases: ["Expression"],
  fields: {
    callee: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    arguments: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Expression", "SpreadElement", "JSXNamespacedName", "ArgumentPlaceholder")))
    },
    optional: {
      validate: !process.env.BABEL_TYPES_8_BREAKING ? (0, _utils.assertValueType)("boolean") : (0, _utils.chain)((0, _utils.assertValueType)("boolean"), (0, _utils.assertOptionalChainStart)())
    },
    typeArguments: {
      validate: (0, _utils.assertNodeType)("TypeParameterInstantiation"),
      optional: true
    },
    typeParameters: {
      validate: (0, _utils.assertNodeType)("TSTypeParameterInstantiation"),
      optional: true
    }
  }
});
defineType("ClassProperty", {
  visitor: ["key", "value", "typeAnnotation", "decorators"],
  builder: ["key", "value", "typeAnnotation", "decorators", "computed", "static"],
  aliases: ["Property"],
  fields: Object.assign({}, classMethodOrPropertyCommon(), {
    value: {
      validate: (0, _utils.assertNodeType)("Expression"),
      optional: true
    },
    definite: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    },
    typeAnnotation: {
      validate: (0, _utils.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
      optional: true
    },
    decorators: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Decorator"))),
      optional: true
    },
    readonly: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    },
    declare: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    },
    variance: {
      validate: (0, _utils.assertNodeType)("Variance"),
      optional: true
    }
  })
});
defineType("ClassAccessorProperty", {
  visitor: ["key", "value", "typeAnnotation", "decorators"],
  builder: ["key", "value", "typeAnnotation", "decorators", "computed", "static"],
  aliases: ["Property", "Accessor"],
  fields: Object.assign({}, classMethodOrPropertyCommon(), {
    key: {
      validate: (0, _utils.chain)(function () {
        const normal = (0, _utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "PrivateName");
        const computed = (0, _utils.assertNodeType)("Expression");
        return function (node, key, val) {
          const validator = node.computed ? computed : normal;
          validator(node, key, val);
        };
      }(), (0, _utils.assertNodeType)("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "Expression", "PrivateName"))
    },
    value: {
      validate: (0, _utils.assertNodeType)("Expression"),
      optional: true
    },
    definite: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    },
    typeAnnotation: {
      validate: (0, _utils.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
      optional: true
    },
    decorators: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Decorator"))),
      optional: true
    },
    readonly: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    },
    declare: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    },
    variance: {
      validate: (0, _utils.assertNodeType)("Variance"),
      optional: true
    }
  })
});
defineType("ClassPrivateProperty", {
  visitor: ["key", "value", "decorators", "typeAnnotation"],
  builder: ["key", "value", "decorators", "static"],
  aliases: ["Property", "Private"],
  fields: {
    key: {
      validate: (0, _utils.assertNodeType)("PrivateName")
    },
    value: {
      validate: (0, _utils.assertNodeType)("Expression"),
      optional: true
    },
    typeAnnotation: {
      validate: (0, _utils.assertNodeType)("TypeAnnotation", "TSTypeAnnotation", "Noop"),
      optional: true
    },
    decorators: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Decorator"))),
      optional: true
    },
    static: {
      validate: (0, _utils.assertValueType)("boolean"),
      default: false
    },
    readonly: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    },
    definite: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    },
    variance: {
      validate: (0, _utils.assertNodeType)("Variance"),
      optional: true
    }
  }
});
defineType("ClassPrivateMethod", {
  builder: ["kind", "key", "params", "body", "static"],
  visitor: ["key", "params", "body", "decorators", "returnType", "typeParameters"],
  aliases: ["Function", "Scopable", "BlockParent", "FunctionParent", "Method", "Private"],
  fields: Object.assign({}, classMethodOrDeclareMethodCommon(), functionTypeAnnotationCommon(), {
    kind: {
      validate: (0, _utils.assertOneOf)("get", "set", "method"),
      default: "method"
    },
    key: {
      validate: (0, _utils.assertNodeType)("PrivateName")
    },
    body: {
      validate: (0, _utils.assertNodeType)("BlockStatement")
    }
  })
});
defineType("PrivateName", {
  visitor: ["id"],
  aliases: ["Private"],
  fields: {
    id: {
      validate: (0, _utils.assertNodeType)("Identifier")
    }
  }
});
defineType("StaticBlock", {
  visitor: ["body"],
  fields: {
    body: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Statement")))
    }
  },
  aliases: ["Scopable", "BlockParent", "FunctionParent"]
});

/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = is;

var _shallowEqual = __webpack_require__(51);

var _isType = __webpack_require__(62);

var _isPlaceholderType = __webpack_require__(63);

var _definitions = __webpack_require__(58);

function is(type, node, opts) {
  if (!node) return false;
  const matches = (0, _isType.default)(node.type, type);

  if (!matches) {
    if (!opts && node.type === "Placeholder" && type in _definitions.FLIPPED_ALIAS_KEYS) {
      return (0, _isPlaceholderType.default)(node.expectedNode, type);
    }

    return false;
  }

  if (typeof opts === "undefined") {
    return true;
  } else {
    return (0, _shallowEqual.default)(node, opts);
  }
}

/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isType;

var _definitions = __webpack_require__(58);

function isType(nodeType, targetType) {
  if (nodeType === targetType) return true;
  if (_definitions.ALIAS_KEYS[targetType]) return false;
  const aliases = _definitions.FLIPPED_ALIAS_KEYS[targetType];

  if (aliases) {
    if (aliases[0] === nodeType) return true;

    for (const alias of aliases) {
      if (nodeType === alias) return true;
    }
  }

  return false;
}

/***/ }),
/* 63 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isPlaceholderType;

var _definitions = __webpack_require__(58);

function isPlaceholderType(placeholderType, targetType) {
  if (placeholderType === targetType) return true;
  const aliases = _definitions.PLACEHOLDERS_ALIAS[placeholderType];

  if (aliases) {
    for (const alias of aliases) {
      if (targetType === alias) return true;
    }
  }

  return false;
}

/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isValidIdentifier;

var _helperValidatorIdentifier = __webpack_require__(65);

function isValidIdentifier(name, reserved = true) {
  if (typeof name !== "string") return false;

  if (reserved) {
    if ((0, _helperValidatorIdentifier.isKeyword)(name) || (0, _helperValidatorIdentifier.isStrictReservedWord)(name, true)) {
      return false;
    }
  }

  return (0, _helperValidatorIdentifier.isIdentifierName)(name);
}

/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "isIdentifierChar", ({
  enumerable: true,
  get: function () {
    return _identifier.isIdentifierChar;
  }
}));
Object.defineProperty(exports, "isIdentifierName", ({
  enumerable: true,
  get: function () {
    return _identifier.isIdentifierName;
  }
}));
Object.defineProperty(exports, "isIdentifierStart", ({
  enumerable: true,
  get: function () {
    return _identifier.isIdentifierStart;
  }
}));
Object.defineProperty(exports, "isKeyword", ({
  enumerable: true,
  get: function () {
    return _keyword.isKeyword;
  }
}));
Object.defineProperty(exports, "isReservedWord", ({
  enumerable: true,
  get: function () {
    return _keyword.isReservedWord;
  }
}));
Object.defineProperty(exports, "isStrictBindOnlyReservedWord", ({
  enumerable: true,
  get: function () {
    return _keyword.isStrictBindOnlyReservedWord;
  }
}));
Object.defineProperty(exports, "isStrictBindReservedWord", ({
  enumerable: true,
  get: function () {
    return _keyword.isStrictBindReservedWord;
  }
}));
Object.defineProperty(exports, "isStrictReservedWord", ({
  enumerable: true,
  get: function () {
    return _keyword.isStrictReservedWord;
  }
}));

var _identifier = __webpack_require__(66);

var _keyword = __webpack_require__(67);

/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isIdentifierChar = isIdentifierChar;
exports.isIdentifierName = isIdentifierName;
exports.isIdentifierStart = isIdentifierStart;
let nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0560-\u0588\u05d0-\u05ea\u05ef-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u0860-\u086a\u0870-\u0887\u0889-\u088e\u08a0-\u08c9\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u09fc\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c5d\u0c60\u0c61\u0c80\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cdd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d04-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d54-\u0d56\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e86-\u0e8a\u0e8c-\u0ea3\u0ea5\u0ea7-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u1711\u171f-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1878\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4c\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1c80-\u1c88\u1c90-\u1cba\u1cbd-\u1cbf\u1ce9-\u1cec\u1cee-\u1cf3\u1cf5\u1cf6\u1cfa\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312f\u3131-\u318e\u31a0-\u31bf\u31f0-\u31ff\u3400-\u4dbf\u4e00-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7ca\ua7d0\ua7d1\ua7d3\ua7d5-\ua7d9\ua7f2-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua8fe\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab69\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
let nonASCIIidentifierChars = "\u200c\u200d\xb7\u0300-\u036f\u0387\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u07fd\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u0898-\u089f\u08ca-\u08e1\u08e3-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u09fe\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0afa-\u0aff\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b55-\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c00-\u0c04\u0c3c\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0d00-\u0d03\u0d3b\u0d3c\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d81-\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0ebc\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u180f-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19d0-\u19da\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1ab0-\u1abd\u1abf-\u1ace\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf4\u1cf7-\u1cf9\u1dc0-\u1dff\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69e\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua82c\ua880\ua881\ua8b4-\ua8c5\ua8d0-\ua8d9\ua8e0-\ua8f1\ua8ff-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\ua9e5\ua9f0-\ua9f9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b-\uaa7d\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
const nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
const nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
const astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 68, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 190, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1070, 4050, 582, 8634, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8936, 3, 2, 6, 2, 1, 2, 290, 46, 2, 18, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 482, 44, 11, 6, 17, 0, 322, 29, 19, 43, 1269, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4152, 8, 221, 3, 5761, 15, 7472, 3104, 541, 1507, 4938];
const astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 154, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 161, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 19306, 9, 87, 9, 39, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4706, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 262, 6, 10, 9, 357, 0, 62, 13, 1495, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];

function isInAstralSet(code, set) {
  let pos = 0x10000;

  for (let i = 0, length = set.length; i < length; i += 2) {
    pos += set[i];
    if (pos > code) return false;
    pos += set[i + 1];
    if (pos >= code) return true;
  }

  return false;
}

function isIdentifierStart(code) {
  if (code < 65) return code === 36;
  if (code <= 90) return true;
  if (code < 97) return code === 95;
  if (code <= 122) return true;

  if (code <= 0xffff) {
    return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
  }

  return isInAstralSet(code, astralIdentifierStartCodes);
}

function isIdentifierChar(code) {
  if (code < 48) return code === 36;
  if (code < 58) return true;
  if (code < 65) return false;
  if (code <= 90) return true;
  if (code < 97) return code === 95;
  if (code <= 122) return true;

  if (code <= 0xffff) {
    return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
  }

  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
}

function isIdentifierName(name) {
  let isFirst = true;

  for (let i = 0; i < name.length; i++) {
    let cp = name.charCodeAt(i);

    if ((cp & 0xfc00) === 0xd800 && i + 1 < name.length) {
      const trail = name.charCodeAt(++i);

      if ((trail & 0xfc00) === 0xdc00) {
        cp = 0x10000 + ((cp & 0x3ff) << 10) + (trail & 0x3ff);
      }
    }

    if (isFirst) {
      isFirst = false;

      if (!isIdentifierStart(cp)) {
        return false;
      }
    } else if (!isIdentifierChar(cp)) {
      return false;
    }
  }

  return !isFirst;
}

/***/ }),
/* 67 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isKeyword = isKeyword;
exports.isReservedWord = isReservedWord;
exports.isStrictBindOnlyReservedWord = isStrictBindOnlyReservedWord;
exports.isStrictBindReservedWord = isStrictBindReservedWord;
exports.isStrictReservedWord = isStrictReservedWord;
const reservedWords = {
  keyword: ["break", "case", "catch", "continue", "debugger", "default", "do", "else", "finally", "for", "function", "if", "return", "switch", "throw", "try", "var", "const", "while", "with", "new", "this", "super", "class", "extends", "export", "import", "null", "true", "false", "in", "instanceof", "typeof", "void", "delete"],
  strict: ["implements", "interface", "let", "package", "private", "protected", "public", "static", "yield"],
  strictBind: ["eval", "arguments"]
};
const keywords = new Set(reservedWords.keyword);
const reservedWordsStrictSet = new Set(reservedWords.strict);
const reservedWordsStrictBindSet = new Set(reservedWords.strictBind);

function isReservedWord(word, inModule) {
  return inModule && word === "await" || word === "enum";
}

function isStrictReservedWord(word, inModule) {
  return isReservedWord(word, inModule) || reservedWordsStrictSet.has(word);
}

function isStrictBindOnlyReservedWord(word) {
  return reservedWordsStrictBindSet.has(word);
}

function isStrictBindReservedWord(word, inModule) {
  return isStrictReservedWord(word, inModule) || isStrictBindOnlyReservedWord(word);
}

function isKeyword(word) {
  return keywords.has(word);
}

/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.readCodePoint = readCodePoint;
exports.readInt = readInt;
exports.readStringContents = readStringContents;

var _isDigit = function isDigit(code) {
  return code >= 48 && code <= 57;
};

const forbiddenNumericSeparatorSiblings = {
  decBinOct: new Set([46, 66, 69, 79, 95, 98, 101, 111]),
  hex: new Set([46, 88, 95, 120])
};
const isAllowedNumericSeparatorSibling = {
  bin: ch => ch === 48 || ch === 49,
  oct: ch => ch >= 48 && ch <= 55,
  dec: ch => ch >= 48 && ch <= 57,
  hex: ch => ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102
};

function readStringContents(type, input, pos, lineStart, curLine, errors) {
  const initialPos = pos;
  const initialLineStart = lineStart;
  const initialCurLine = curLine;
  let out = "";
  let containsInvalid = false;
  let chunkStart = pos;
  const {
    length
  } = input;

  for (;;) {
    if (pos >= length) {
      errors.unterminated(initialPos, initialLineStart, initialCurLine);
      out += input.slice(chunkStart, pos);
      break;
    }

    const ch = input.charCodeAt(pos);

    if (isStringEnd(type, ch, input, pos)) {
      out += input.slice(chunkStart, pos);
      break;
    }

    if (ch === 92) {
      out += input.slice(chunkStart, pos);
      let escaped;
      ({
        ch: escaped,
        pos,
        lineStart,
        curLine
      } = readEscapedChar(input, pos, lineStart, curLine, type === "template", errors));

      if (escaped === null) {
        containsInvalid = true;
      } else {
        out += escaped;
      }

      chunkStart = pos;
    } else if (ch === 8232 || ch === 8233) {
      ++pos;
      ++curLine;
      lineStart = pos;
    } else if (ch === 10 || ch === 13) {
      if (type === "template") {
        out += input.slice(chunkStart, pos) + "\n";
        ++pos;

        if (ch === 13 && input.charCodeAt(pos) === 10) {
          ++pos;
        }

        ++curLine;
        chunkStart = lineStart = pos;
      } else {
        errors.unterminated(initialPos, initialLineStart, initialCurLine);
      }
    } else {
      ++pos;
    }
  }

  return {
    pos,
    str: out,
    containsInvalid,
    lineStart,
    curLine
  };
}

function isStringEnd(type, ch, input, pos) {
  if (type === "template") {
    return ch === 96 || ch === 36 && input.charCodeAt(pos + 1) === 123;
  }

  return ch === (type === "double" ? 34 : 39);
}

function readEscapedChar(input, pos, lineStart, curLine, inTemplate, errors) {
  const throwOnInvalid = !inTemplate;
  pos++;

  const res = ch => ({
    pos,
    ch,
    lineStart,
    curLine
  });

  const ch = input.charCodeAt(pos++);

  switch (ch) {
    case 110:
      return res("\n");

    case 114:
      return res("\r");

    case 120:
      {
        let code;
        ({
          code,
          pos
        } = readHexChar(input, pos, lineStart, curLine, 2, false, throwOnInvalid, errors));
        return res(code === null ? null : String.fromCharCode(code));
      }

    case 117:
      {
        let code;
        ({
          code,
          pos
        } = readCodePoint(input, pos, lineStart, curLine, throwOnInvalid, errors));
        return res(code === null ? null : String.fromCodePoint(code));
      }

    case 116:
      return res("\t");

    case 98:
      return res("\b");

    case 118:
      return res("\u000b");

    case 102:
      return res("\f");

    case 13:
      if (input.charCodeAt(pos) === 10) {
        ++pos;
      }

    case 10:
      lineStart = pos;
      ++curLine;

    case 8232:
    case 8233:
      return res("");

    case 56:
    case 57:
      if (inTemplate) {
        return res(null);
      } else {
        errors.strictNumericEscape(pos - 1, lineStart, curLine);
      }

    default:
      if (ch >= 48 && ch <= 55) {
        const startPos = pos - 1;
        const match = input.slice(startPos, pos + 2).match(/^[0-7]+/);
        let octalStr = match[0];
        let octal = parseInt(octalStr, 8);

        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }

        pos += octalStr.length - 1;
        const next = input.charCodeAt(pos);

        if (octalStr !== "0" || next === 56 || next === 57) {
          if (inTemplate) {
            return res(null);
          } else {
            errors.strictNumericEscape(startPos, lineStart, curLine);
          }
        }

        return res(String.fromCharCode(octal));
      }

      return res(String.fromCharCode(ch));
  }
}

function readHexChar(input, pos, lineStart, curLine, len, forceLen, throwOnInvalid, errors) {
  const initialPos = pos;
  let n;
  ({
    n,
    pos
  } = readInt(input, pos, lineStart, curLine, 16, len, forceLen, false, errors));

  if (n === null) {
    if (throwOnInvalid) {
      errors.invalidEscapeSequence(initialPos, lineStart, curLine);
    } else {
      pos = initialPos - 1;
    }
  }

  return {
    code: n,
    pos
  };
}

function readInt(input, pos, lineStart, curLine, radix, len, forceLen, allowNumSeparator, errors) {
  const start = pos;
  const forbiddenSiblings = radix === 16 ? forbiddenNumericSeparatorSiblings.hex : forbiddenNumericSeparatorSiblings.decBinOct;
  const isAllowedSibling = radix === 16 ? isAllowedNumericSeparatorSibling.hex : radix === 10 ? isAllowedNumericSeparatorSibling.dec : radix === 8 ? isAllowedNumericSeparatorSibling.oct : isAllowedNumericSeparatorSibling.bin;
  let invalid = false;
  let total = 0;

  for (let i = 0, e = len == null ? Infinity : len; i < e; ++i) {
    const code = input.charCodeAt(pos);
    let val;

    if (code === 95 && allowNumSeparator !== "bail") {
      const prev = input.charCodeAt(pos - 1);
      const next = input.charCodeAt(pos + 1);

      if (!allowNumSeparator) {
        errors.numericSeparatorInEscapeSequence(pos, lineStart, curLine);
      } else if (Number.isNaN(next) || !isAllowedSibling(next) || forbiddenSiblings.has(prev) || forbiddenSiblings.has(next)) {
        errors.unexpectedNumericSeparator(pos, lineStart, curLine);
      }

      ++pos;
      continue;
    }

    if (code >= 97) {
      val = code - 97 + 10;
    } else if (code >= 65) {
      val = code - 65 + 10;
    } else if (_isDigit(code)) {
      val = code - 48;
    } else {
      val = Infinity;
    }

    if (val >= radix) {
      if (val <= 9 && errors.invalidDigit(pos, lineStart, curLine, radix)) {
        val = 0;
      } else if (forceLen) {
        val = 0;
        invalid = true;
      } else {
        break;
      }
    }

    ++pos;
    total = total * radix + val;
  }

  if (pos === start || len != null && pos - start !== len || invalid) {
    return {
      n: null,
      pos
    };
  }

  return {
    n: total,
    pos
  };
}

function readCodePoint(input, pos, lineStart, curLine, throwOnInvalid, errors) {
  const ch = input.charCodeAt(pos);
  let code;

  if (ch === 123) {
    ++pos;
    ({
      code,
      pos
    } = readHexChar(input, pos, lineStart, curLine, input.indexOf("}", pos) - pos, true, throwOnInvalid, errors));
    ++pos;

    if (code !== null && code > 0x10ffff) {
      if (throwOnInvalid) {
        errors.invalidCodePoint(pos, lineStart, curLine);
      } else {
        return {
          code: null,
          pos
        };
      }
    }
  } else {
    ({
      code,
      pos
    } = readHexChar(input, pos, lineStart, curLine, 4, false, throwOnInvalid, errors));
  }

  return {
    code,
    pos
  };
}

/***/ }),
/* 69 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.UPDATE_OPERATORS = exports.UNARY_OPERATORS = exports.STRING_UNARY_OPERATORS = exports.STATEMENT_OR_BLOCK_KEYS = exports.NUMBER_UNARY_OPERATORS = exports.NUMBER_BINARY_OPERATORS = exports.NOT_LOCAL_BINDING = exports.LOGICAL_OPERATORS = exports.INHERIT_KEYS = exports.FOR_INIT_KEYS = exports.FLATTENABLE_KEYS = exports.EQUALITY_BINARY_OPERATORS = exports.COMPARISON_BINARY_OPERATORS = exports.COMMENT_KEYS = exports.BOOLEAN_UNARY_OPERATORS = exports.BOOLEAN_NUMBER_BINARY_OPERATORS = exports.BOOLEAN_BINARY_OPERATORS = exports.BLOCK_SCOPED_SYMBOL = exports.BINARY_OPERATORS = exports.ASSIGNMENT_OPERATORS = void 0;
const STATEMENT_OR_BLOCK_KEYS = ["consequent", "body", "alternate"];
exports.STATEMENT_OR_BLOCK_KEYS = STATEMENT_OR_BLOCK_KEYS;
const FLATTENABLE_KEYS = ["body", "expressions"];
exports.FLATTENABLE_KEYS = FLATTENABLE_KEYS;
const FOR_INIT_KEYS = ["left", "init"];
exports.FOR_INIT_KEYS = FOR_INIT_KEYS;
const COMMENT_KEYS = ["leadingComments", "trailingComments", "innerComments"];
exports.COMMENT_KEYS = COMMENT_KEYS;
const LOGICAL_OPERATORS = ["||", "&&", "??"];
exports.LOGICAL_OPERATORS = LOGICAL_OPERATORS;
const UPDATE_OPERATORS = ["++", "--"];
exports.UPDATE_OPERATORS = UPDATE_OPERATORS;
const BOOLEAN_NUMBER_BINARY_OPERATORS = [">", "<", ">=", "<="];
exports.BOOLEAN_NUMBER_BINARY_OPERATORS = BOOLEAN_NUMBER_BINARY_OPERATORS;
const EQUALITY_BINARY_OPERATORS = ["==", "===", "!=", "!=="];
exports.EQUALITY_BINARY_OPERATORS = EQUALITY_BINARY_OPERATORS;
const COMPARISON_BINARY_OPERATORS = [...EQUALITY_BINARY_OPERATORS, "in", "instanceof"];
exports.COMPARISON_BINARY_OPERATORS = COMPARISON_BINARY_OPERATORS;
const BOOLEAN_BINARY_OPERATORS = [...COMPARISON_BINARY_OPERATORS, ...BOOLEAN_NUMBER_BINARY_OPERATORS];
exports.BOOLEAN_BINARY_OPERATORS = BOOLEAN_BINARY_OPERATORS;
const NUMBER_BINARY_OPERATORS = ["-", "/", "%", "*", "**", "&", "|", ">>", ">>>", "<<", "^"];
exports.NUMBER_BINARY_OPERATORS = NUMBER_BINARY_OPERATORS;
const BINARY_OPERATORS = ["+", ...NUMBER_BINARY_OPERATORS, ...BOOLEAN_BINARY_OPERATORS, "|>"];
exports.BINARY_OPERATORS = BINARY_OPERATORS;
const ASSIGNMENT_OPERATORS = ["=", "+=", ...NUMBER_BINARY_OPERATORS.map(op => op + "="), ...LOGICAL_OPERATORS.map(op => op + "=")];
exports.ASSIGNMENT_OPERATORS = ASSIGNMENT_OPERATORS;
const BOOLEAN_UNARY_OPERATORS = ["delete", "!"];
exports.BOOLEAN_UNARY_OPERATORS = BOOLEAN_UNARY_OPERATORS;
const NUMBER_UNARY_OPERATORS = ["+", "-", "~"];
exports.NUMBER_UNARY_OPERATORS = NUMBER_UNARY_OPERATORS;
const STRING_UNARY_OPERATORS = ["typeof"];
exports.STRING_UNARY_OPERATORS = STRING_UNARY_OPERATORS;
const UNARY_OPERATORS = ["void", "throw", ...BOOLEAN_UNARY_OPERATORS, ...NUMBER_UNARY_OPERATORS, ...STRING_UNARY_OPERATORS];
exports.UNARY_OPERATORS = UNARY_OPERATORS;
const INHERIT_KEYS = {
  optional: ["typeAnnotation", "typeParameters", "returnType"],
  force: ["start", "loc", "end"]
};
exports.INHERIT_KEYS = INHERIT_KEYS;
const BLOCK_SCOPED_SYMBOL = Symbol.for("var used to be block scoped");
exports.BLOCK_SCOPED_SYMBOL = BLOCK_SCOPED_SYMBOL;
const NOT_LOCAL_BINDING = Symbol.for("should not be considered a local binding");
exports.NOT_LOCAL_BINDING = NOT_LOCAL_BINDING;

/***/ }),
/* 70 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(4);


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VISITOR_KEYS = exports.NODE_PARENT_VALIDATIONS = exports.NODE_FIELDS = exports.FLIPPED_ALIAS_KEYS = exports.DEPRECATED_KEYS = exports.BUILDER_KEYS = exports.ALIAS_KEYS = void 0;
exports.arrayOf = arrayOf;
exports.arrayOfType = arrayOfType;
exports.assertEach = assertEach;
exports.assertNodeOrValueType = assertNodeOrValueType;
exports.assertNodeType = assertNodeType;
exports.assertOneOf = assertOneOf;
exports.assertOptionalChainStart = assertOptionalChainStart;
exports.assertShape = assertShape;
exports.assertValueType = assertValueType;
exports.chain = chain;
exports["default"] = defineType;
exports.defineAliasedType = defineAliasedType;
exports.typeIs = typeIs;
exports.validate = validate;
exports.validateArrayOfType = validateArrayOfType;
exports.validateOptional = validateOptional;
exports.validateOptionalType = validateOptionalType;
exports.validateType = validateType;

var _is = __webpack_require__(61);

var _validate = __webpack_require__(57);

const VISITOR_KEYS = {};
exports.VISITOR_KEYS = VISITOR_KEYS;
const ALIAS_KEYS = {};
exports.ALIAS_KEYS = ALIAS_KEYS;
const FLIPPED_ALIAS_KEYS = {};
exports.FLIPPED_ALIAS_KEYS = FLIPPED_ALIAS_KEYS;
const NODE_FIELDS = {};
exports.NODE_FIELDS = NODE_FIELDS;
const BUILDER_KEYS = {};
exports.BUILDER_KEYS = BUILDER_KEYS;
const DEPRECATED_KEYS = {};
exports.DEPRECATED_KEYS = DEPRECATED_KEYS;
const NODE_PARENT_VALIDATIONS = {};
exports.NODE_PARENT_VALIDATIONS = NODE_PARENT_VALIDATIONS;

function getType(val) {
  if (Array.isArray(val)) {
    return "array";
  } else if (val === null) {
    return "null";
  } else {
    return typeof val;
  }
}

function validate(validate) {
  return {
    validate
  };
}

function typeIs(typeName) {
  return typeof typeName === "string" ? assertNodeType(typeName) : assertNodeType(...typeName);
}

function validateType(typeName) {
  return validate(typeIs(typeName));
}

function validateOptional(validate) {
  return {
    validate,
    optional: true
  };
}

function validateOptionalType(typeName) {
  return {
    validate: typeIs(typeName),
    optional: true
  };
}

function arrayOf(elementType) {
  return chain(assertValueType("array"), assertEach(elementType));
}

function arrayOfType(typeName) {
  return arrayOf(typeIs(typeName));
}

function validateArrayOfType(typeName) {
  return validate(arrayOfType(typeName));
}

function assertEach(callback) {
  function validator(node, key, val) {
    if (!Array.isArray(val)) return;

    for (let i = 0; i < val.length; i++) {
      const subkey = `${key}[${i}]`;
      const v = val[i];
      callback(node, subkey, v);
      if (process.env.BABEL_TYPES_8_BREAKING) (0, _validate.validateChild)(node, subkey, v);
    }
  }

  validator.each = callback;
  return validator;
}

function assertOneOf(...values) {
  function validate(node, key, val) {
    if (values.indexOf(val) < 0) {
      throw new TypeError(`Property ${key} expected value to be one of ${JSON.stringify(values)} but got ${JSON.stringify(val)}`);
    }
  }

  validate.oneOf = values;
  return validate;
}

function assertNodeType(...types) {
  function validate(node, key, val) {
    for (const type of types) {
      if ((0, _is.default)(type, val)) {
        (0, _validate.validateChild)(node, key, val);
        return;
      }
    }

    throw new TypeError(`Property ${key} of ${node.type} expected node to be of a type ${JSON.stringify(types)} but instead got ${JSON.stringify(val == null ? void 0 : val.type)}`);
  }

  validate.oneOfNodeTypes = types;
  return validate;
}

function assertNodeOrValueType(...types) {
  function validate(node, key, val) {
    for (const type of types) {
      if (getType(val) === type || (0, _is.default)(type, val)) {
        (0, _validate.validateChild)(node, key, val);
        return;
      }
    }

    throw new TypeError(`Property ${key} of ${node.type} expected node to be of a type ${JSON.stringify(types)} but instead got ${JSON.stringify(val == null ? void 0 : val.type)}`);
  }

  validate.oneOfNodeOrValueTypes = types;
  return validate;
}

function assertValueType(type) {
  function validate(node, key, val) {
    const valid = getType(val) === type;

    if (!valid) {
      throw new TypeError(`Property ${key} expected type of ${type} but got ${getType(val)}`);
    }
  }

  validate.type = type;
  return validate;
}

function assertShape(shape) {
  function validate(node, key, val) {
    const errors = [];

    for (const property of Object.keys(shape)) {
      try {
        (0, _validate.validateField)(node, property, val[property], shape[property]);
      } catch (error) {
        if (error instanceof TypeError) {
          errors.push(error.message);
          continue;
        }

        throw error;
      }
    }

    if (errors.length) {
      throw new TypeError(`Property ${key} of ${node.type} expected to have the following:\n${errors.join("\n")}`);
    }
  }

  validate.shapeOf = shape;
  return validate;
}

function assertOptionalChainStart() {
  function validate(node) {
    var _current;

    let current = node;

    while (node) {
      const {
        type
      } = current;

      if (type === "OptionalCallExpression") {
        if (current.optional) return;
        current = current.callee;
        continue;
      }

      if (type === "OptionalMemberExpression") {
        if (current.optional) return;
        current = current.object;
        continue;
      }

      break;
    }

    throw new TypeError(`Non-optional ${node.type} must chain from an optional OptionalMemberExpression or OptionalCallExpression. Found chain from ${(_current = current) == null ? void 0 : _current.type}`);
  }

  return validate;
}

function chain(...fns) {
  function validate(...args) {
    for (const fn of fns) {
      fn(...args);
    }
  }

  validate.chainOf = fns;

  if (fns.length >= 2 && "type" in fns[0] && fns[0].type === "array" && !("each" in fns[1])) {
    throw new Error(`An assertValueType("array") validator can only be followed by an assertEach(...) validator.`);
  }

  return validate;
}

const validTypeOpts = ["aliases", "builder", "deprecatedAlias", "fields", "inherits", "visitor", "validate"];
const validFieldKeys = ["default", "optional", "validate"];

function defineAliasedType(...aliases) {
  return (type, opts = {}) => {
    let defined = opts.aliases;

    if (!defined) {
      var _store$opts$inherits$, _defined;

      if (opts.inherits) defined = (_store$opts$inherits$ = store[opts.inherits].aliases) == null ? void 0 : _store$opts$inherits$.slice();
      (_defined = defined) != null ? _defined : defined = [];
      opts.aliases = defined;
    }

    const additional = aliases.filter(a => !defined.includes(a));
    defined.unshift(...additional);
    return defineType(type, opts);
  };
}

function defineType(type, opts = {}) {
  const inherits = opts.inherits && store[opts.inherits] || {};
  let fields = opts.fields;

  if (!fields) {
    fields = {};

    if (inherits.fields) {
      const keys = Object.getOwnPropertyNames(inherits.fields);

      for (const key of keys) {
        const field = inherits.fields[key];
        const def = field.default;

        if (Array.isArray(def) ? def.length > 0 : def && typeof def === "object") {
          throw new Error("field defaults can only be primitives or empty arrays currently");
        }

        fields[key] = {
          default: Array.isArray(def) ? [] : def,
          optional: field.optional,
          validate: field.validate
        };
      }
    }
  }

  const visitor = opts.visitor || inherits.visitor || [];
  const aliases = opts.aliases || inherits.aliases || [];
  const builder = opts.builder || inherits.builder || opts.visitor || [];

  for (const k of Object.keys(opts)) {
    if (validTypeOpts.indexOf(k) === -1) {
      throw new Error(`Unknown type option "${k}" on ${type}`);
    }
  }

  if (opts.deprecatedAlias) {
    DEPRECATED_KEYS[opts.deprecatedAlias] = type;
  }

  for (const key of visitor.concat(builder)) {
    fields[key] = fields[key] || {};
  }

  for (const key of Object.keys(fields)) {
    const field = fields[key];

    if (field.default !== undefined && builder.indexOf(key) === -1) {
      field.optional = true;
    }

    if (field.default === undefined) {
      field.default = null;
    } else if (!field.validate && field.default != null) {
      field.validate = assertValueType(getType(field.default));
    }

    for (const k of Object.keys(field)) {
      if (validFieldKeys.indexOf(k) === -1) {
        throw new Error(`Unknown field key "${k}" on ${type}.${key}`);
      }
    }
  }

  VISITOR_KEYS[type] = opts.visitor = visitor;
  BUILDER_KEYS[type] = opts.builder = builder;
  NODE_FIELDS[type] = opts.fields = fields;
  ALIAS_KEYS[type] = opts.aliases = aliases;
  aliases.forEach(alias => {
    FLIPPED_ALIAS_KEYS[alias] = FLIPPED_ALIAS_KEYS[alias] || [];
    FLIPPED_ALIAS_KEYS[alias].push(type);
  });

  if (opts.validate) {
    NODE_PARENT_VALIDATIONS[type] = opts.validate;
  }

  store[type] = opts;
}

const store = {};

/***/ }),
/* 71 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _utils = __webpack_require__(70);

const defineType = (0, _utils.defineAliasedType)("Flow");

const defineInterfaceishType = name => {
  defineType(name, {
    builder: ["id", "typeParameters", "extends", "body"],
    visitor: ["id", "typeParameters", "extends", "mixins", "implements", "body"],
    aliases: ["FlowDeclaration", "Statement", "Declaration"],
    fields: {
      id: (0, _utils.validateType)("Identifier"),
      typeParameters: (0, _utils.validateOptionalType)("TypeParameterDeclaration"),
      extends: (0, _utils.validateOptional)((0, _utils.arrayOfType)("InterfaceExtends")),
      mixins: (0, _utils.validateOptional)((0, _utils.arrayOfType)("InterfaceExtends")),
      implements: (0, _utils.validateOptional)((0, _utils.arrayOfType)("ClassImplements")),
      body: (0, _utils.validateType)("ObjectTypeAnnotation")
    }
  });
};

defineType("AnyTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType("ArrayTypeAnnotation", {
  visitor: ["elementType"],
  aliases: ["FlowType"],
  fields: {
    elementType: (0, _utils.validateType)("FlowType")
  }
});
defineType("BooleanTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType("BooleanLiteralTypeAnnotation", {
  builder: ["value"],
  aliases: ["FlowType"],
  fields: {
    value: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
  }
});
defineType("NullLiteralTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType("ClassImplements", {
  visitor: ["id", "typeParameters"],
  fields: {
    id: (0, _utils.validateType)("Identifier"),
    typeParameters: (0, _utils.validateOptionalType)("TypeParameterInstantiation")
  }
});
defineInterfaceishType("DeclareClass");
defineType("DeclareFunction", {
  visitor: ["id"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: (0, _utils.validateType)("Identifier"),
    predicate: (0, _utils.validateOptionalType)("DeclaredPredicate")
  }
});
defineInterfaceishType("DeclareInterface");
defineType("DeclareModule", {
  builder: ["id", "body", "kind"],
  visitor: ["id", "body"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: (0, _utils.validateType)(["Identifier", "StringLiteral"]),
    body: (0, _utils.validateType)("BlockStatement"),
    kind: (0, _utils.validateOptional)((0, _utils.assertOneOf)("CommonJS", "ES"))
  }
});
defineType("DeclareModuleExports", {
  visitor: ["typeAnnotation"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    typeAnnotation: (0, _utils.validateType)("TypeAnnotation")
  }
});
defineType("DeclareTypeAlias", {
  visitor: ["id", "typeParameters", "right"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: (0, _utils.validateType)("Identifier"),
    typeParameters: (0, _utils.validateOptionalType)("TypeParameterDeclaration"),
    right: (0, _utils.validateType)("FlowType")
  }
});
defineType("DeclareOpaqueType", {
  visitor: ["id", "typeParameters", "supertype"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: (0, _utils.validateType)("Identifier"),
    typeParameters: (0, _utils.validateOptionalType)("TypeParameterDeclaration"),
    supertype: (0, _utils.validateOptionalType)("FlowType"),
    impltype: (0, _utils.validateOptionalType)("FlowType")
  }
});
defineType("DeclareVariable", {
  visitor: ["id"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: (0, _utils.validateType)("Identifier")
  }
});
defineType("DeclareExportDeclaration", {
  visitor: ["declaration", "specifiers", "source"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    declaration: (0, _utils.validateOptionalType)("Flow"),
    specifiers: (0, _utils.validateOptional)((0, _utils.arrayOfType)(["ExportSpecifier", "ExportNamespaceSpecifier"])),
    source: (0, _utils.validateOptionalType)("StringLiteral"),
    default: (0, _utils.validateOptional)((0, _utils.assertValueType)("boolean"))
  }
});
defineType("DeclareExportAllDeclaration", {
  visitor: ["source"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    source: (0, _utils.validateType)("StringLiteral"),
    exportKind: (0, _utils.validateOptional)((0, _utils.assertOneOf)("type", "value"))
  }
});
defineType("DeclaredPredicate", {
  visitor: ["value"],
  aliases: ["FlowPredicate"],
  fields: {
    value: (0, _utils.validateType)("Flow")
  }
});
defineType("ExistsTypeAnnotation", {
  aliases: ["FlowType"]
});
defineType("FunctionTypeAnnotation", {
  visitor: ["typeParameters", "params", "rest", "returnType"],
  aliases: ["FlowType"],
  fields: {
    typeParameters: (0, _utils.validateOptionalType)("TypeParameterDeclaration"),
    params: (0, _utils.validate)((0, _utils.arrayOfType)("FunctionTypeParam")),
    rest: (0, _utils.validateOptionalType)("FunctionTypeParam"),
    this: (0, _utils.validateOptionalType)("FunctionTypeParam"),
    returnType: (0, _utils.validateType)("FlowType")
  }
});
defineType("FunctionTypeParam", {
  visitor: ["name", "typeAnnotation"],
  fields: {
    name: (0, _utils.validateOptionalType)("Identifier"),
    typeAnnotation: (0, _utils.validateType)("FlowType"),
    optional: (0, _utils.validateOptional)((0, _utils.assertValueType)("boolean"))
  }
});
defineType("GenericTypeAnnotation", {
  visitor: ["id", "typeParameters"],
  aliases: ["FlowType"],
  fields: {
    id: (0, _utils.validateType)(["Identifier", "QualifiedTypeIdentifier"]),
    typeParameters: (0, _utils.validateOptionalType)("TypeParameterInstantiation")
  }
});
defineType("InferredPredicate", {
  aliases: ["FlowPredicate"]
});
defineType("InterfaceExtends", {
  visitor: ["id", "typeParameters"],
  fields: {
    id: (0, _utils.validateType)(["Identifier", "QualifiedTypeIdentifier"]),
    typeParameters: (0, _utils.validateOptionalType)("TypeParameterInstantiation")
  }
});
defineInterfaceishType("InterfaceDeclaration");
defineType("InterfaceTypeAnnotation", {
  visitor: ["extends", "body"],
  aliases: ["FlowType"],
  fields: {
    extends: (0, _utils.validateOptional)((0, _utils.arrayOfType)("InterfaceExtends")),
    body: (0, _utils.validateType)("ObjectTypeAnnotation")
  }
});
defineType("IntersectionTypeAnnotation", {
  visitor: ["types"],
  aliases: ["FlowType"],
  fields: {
    types: (0, _utils.validate)((0, _utils.arrayOfType)("FlowType"))
  }
});
defineType("MixedTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType("EmptyTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType("NullableTypeAnnotation", {
  visitor: ["typeAnnotation"],
  aliases: ["FlowType"],
  fields: {
    typeAnnotation: (0, _utils.validateType)("FlowType")
  }
});
defineType("NumberLiteralTypeAnnotation", {
  builder: ["value"],
  aliases: ["FlowType"],
  fields: {
    value: (0, _utils.validate)((0, _utils.assertValueType)("number"))
  }
});
defineType("NumberTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType("ObjectTypeAnnotation", {
  visitor: ["properties", "indexers", "callProperties", "internalSlots"],
  aliases: ["FlowType"],
  builder: ["properties", "indexers", "callProperties", "internalSlots", "exact"],
  fields: {
    properties: (0, _utils.validate)((0, _utils.arrayOfType)(["ObjectTypeProperty", "ObjectTypeSpreadProperty"])),
    indexers: {
      validate: (0, _utils.arrayOfType)("ObjectTypeIndexer"),
      optional: true,
      default: []
    },
    callProperties: {
      validate: (0, _utils.arrayOfType)("ObjectTypeCallProperty"),
      optional: true,
      default: []
    },
    internalSlots: {
      validate: (0, _utils.arrayOfType)("ObjectTypeInternalSlot"),
      optional: true,
      default: []
    },
    exact: {
      validate: (0, _utils.assertValueType)("boolean"),
      default: false
    },
    inexact: (0, _utils.validateOptional)((0, _utils.assertValueType)("boolean"))
  }
});
defineType("ObjectTypeInternalSlot", {
  visitor: ["id", "value", "optional", "static", "method"],
  aliases: ["UserWhitespacable"],
  fields: {
    id: (0, _utils.validateType)("Identifier"),
    value: (0, _utils.validateType)("FlowType"),
    optional: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
    static: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
    method: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
  }
});
defineType("ObjectTypeCallProperty", {
  visitor: ["value"],
  aliases: ["UserWhitespacable"],
  fields: {
    value: (0, _utils.validateType)("FlowType"),
    static: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
  }
});
defineType("ObjectTypeIndexer", {
  visitor: ["id", "key", "value", "variance"],
  aliases: ["UserWhitespacable"],
  fields: {
    id: (0, _utils.validateOptionalType)("Identifier"),
    key: (0, _utils.validateType)("FlowType"),
    value: (0, _utils.validateType)("FlowType"),
    static: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
    variance: (0, _utils.validateOptionalType)("Variance")
  }
});
defineType("ObjectTypeProperty", {
  visitor: ["key", "value", "variance"],
  aliases: ["UserWhitespacable"],
  fields: {
    key: (0, _utils.validateType)(["Identifier", "StringLiteral"]),
    value: (0, _utils.validateType)("FlowType"),
    kind: (0, _utils.validate)((0, _utils.assertOneOf)("init", "get", "set")),
    static: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
    proto: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
    optional: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
    variance: (0, _utils.validateOptionalType)("Variance"),
    method: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
  }
});
defineType("ObjectTypeSpreadProperty", {
  visitor: ["argument"],
  aliases: ["UserWhitespacable"],
  fields: {
    argument: (0, _utils.validateType)("FlowType")
  }
});
defineType("OpaqueType", {
  visitor: ["id", "typeParameters", "supertype", "impltype"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: (0, _utils.validateType)("Identifier"),
    typeParameters: (0, _utils.validateOptionalType)("TypeParameterDeclaration"),
    supertype: (0, _utils.validateOptionalType)("FlowType"),
    impltype: (0, _utils.validateType)("FlowType")
  }
});
defineType("QualifiedTypeIdentifier", {
  visitor: ["id", "qualification"],
  fields: {
    id: (0, _utils.validateType)("Identifier"),
    qualification: (0, _utils.validateType)(["Identifier", "QualifiedTypeIdentifier"])
  }
});
defineType("StringLiteralTypeAnnotation", {
  builder: ["value"],
  aliases: ["FlowType"],
  fields: {
    value: (0, _utils.validate)((0, _utils.assertValueType)("string"))
  }
});
defineType("StringTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType("SymbolTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType("ThisTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType("TupleTypeAnnotation", {
  visitor: ["types"],
  aliases: ["FlowType"],
  fields: {
    types: (0, _utils.validate)((0, _utils.arrayOfType)("FlowType"))
  }
});
defineType("TypeofTypeAnnotation", {
  visitor: ["argument"],
  aliases: ["FlowType"],
  fields: {
    argument: (0, _utils.validateType)("FlowType")
  }
});
defineType("TypeAlias", {
  visitor: ["id", "typeParameters", "right"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: (0, _utils.validateType)("Identifier"),
    typeParameters: (0, _utils.validateOptionalType)("TypeParameterDeclaration"),
    right: (0, _utils.validateType)("FlowType")
  }
});
defineType("TypeAnnotation", {
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: (0, _utils.validateType)("FlowType")
  }
});
defineType("TypeCastExpression", {
  visitor: ["expression", "typeAnnotation"],
  aliases: ["ExpressionWrapper", "Expression"],
  fields: {
    expression: (0, _utils.validateType)("Expression"),
    typeAnnotation: (0, _utils.validateType)("TypeAnnotation")
  }
});
defineType("TypeParameter", {
  visitor: ["bound", "default", "variance"],
  fields: {
    name: (0, _utils.validate)((0, _utils.assertValueType)("string")),
    bound: (0, _utils.validateOptionalType)("TypeAnnotation"),
    default: (0, _utils.validateOptionalType)("FlowType"),
    variance: (0, _utils.validateOptionalType)("Variance")
  }
});
defineType("TypeParameterDeclaration", {
  visitor: ["params"],
  fields: {
    params: (0, _utils.validate)((0, _utils.arrayOfType)("TypeParameter"))
  }
});
defineType("TypeParameterInstantiation", {
  visitor: ["params"],
  fields: {
    params: (0, _utils.validate)((0, _utils.arrayOfType)("FlowType"))
  }
});
defineType("UnionTypeAnnotation", {
  visitor: ["types"],
  aliases: ["FlowType"],
  fields: {
    types: (0, _utils.validate)((0, _utils.arrayOfType)("FlowType"))
  }
});
defineType("Variance", {
  builder: ["kind"],
  fields: {
    kind: (0, _utils.validate)((0, _utils.assertOneOf)("minus", "plus"))
  }
});
defineType("VoidTypeAnnotation", {
  aliases: ["FlowType", "FlowBaseAnnotation"]
});
defineType("EnumDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "body"],
  fields: {
    id: (0, _utils.validateType)("Identifier"),
    body: (0, _utils.validateType)(["EnumBooleanBody", "EnumNumberBody", "EnumStringBody", "EnumSymbolBody"])
  }
});
defineType("EnumBooleanBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    explicitType: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
    members: (0, _utils.validateArrayOfType)("EnumBooleanMember"),
    hasUnknownMembers: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
  }
});
defineType("EnumNumberBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    explicitType: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
    members: (0, _utils.validateArrayOfType)("EnumNumberMember"),
    hasUnknownMembers: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
  }
});
defineType("EnumStringBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    explicitType: (0, _utils.validate)((0, _utils.assertValueType)("boolean")),
    members: (0, _utils.validateArrayOfType)(["EnumStringMember", "EnumDefaultedMember"]),
    hasUnknownMembers: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
  }
});
defineType("EnumSymbolBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    members: (0, _utils.validateArrayOfType)("EnumDefaultedMember"),
    hasUnknownMembers: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
  }
});
defineType("EnumBooleanMember", {
  aliases: ["EnumMember"],
  visitor: ["id"],
  fields: {
    id: (0, _utils.validateType)("Identifier"),
    init: (0, _utils.validateType)("BooleanLiteral")
  }
});
defineType("EnumNumberMember", {
  aliases: ["EnumMember"],
  visitor: ["id", "init"],
  fields: {
    id: (0, _utils.validateType)("Identifier"),
    init: (0, _utils.validateType)("NumericLiteral")
  }
});
defineType("EnumStringMember", {
  aliases: ["EnumMember"],
  visitor: ["id", "init"],
  fields: {
    id: (0, _utils.validateType)("Identifier"),
    init: (0, _utils.validateType)("StringLiteral")
  }
});
defineType("EnumDefaultedMember", {
  aliases: ["EnumMember"],
  visitor: ["id"],
  fields: {
    id: (0, _utils.validateType)("Identifier")
  }
});
defineType("IndexedAccessType", {
  visitor: ["objectType", "indexType"],
  aliases: ["FlowType"],
  fields: {
    objectType: (0, _utils.validateType)("FlowType"),
    indexType: (0, _utils.validateType)("FlowType")
  }
});
defineType("OptionalIndexedAccessType", {
  visitor: ["objectType", "indexType"],
  aliases: ["FlowType"],
  fields: {
    objectType: (0, _utils.validateType)("FlowType"),
    indexType: (0, _utils.validateType)("FlowType"),
    optional: (0, _utils.validate)((0, _utils.assertValueType)("boolean"))
  }
});

/***/ }),
/* 72 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _utils = __webpack_require__(70);

const defineType = (0, _utils.defineAliasedType)("JSX");
defineType("JSXAttribute", {
  visitor: ["name", "value"],
  aliases: ["Immutable"],
  fields: {
    name: {
      validate: (0, _utils.assertNodeType)("JSXIdentifier", "JSXNamespacedName")
    },
    value: {
      optional: true,
      validate: (0, _utils.assertNodeType)("JSXElement", "JSXFragment", "StringLiteral", "JSXExpressionContainer")
    }
  }
});
defineType("JSXClosingElement", {
  visitor: ["name"],
  aliases: ["Immutable"],
  fields: {
    name: {
      validate: (0, _utils.assertNodeType)("JSXIdentifier", "JSXMemberExpression", "JSXNamespacedName")
    }
  }
});
defineType("JSXElement", {
  builder: ["openingElement", "closingElement", "children", "selfClosing"],
  visitor: ["openingElement", "children", "closingElement"],
  aliases: ["Immutable", "Expression"],
  fields: Object.assign({
    openingElement: {
      validate: (0, _utils.assertNodeType)("JSXOpeningElement")
    },
    closingElement: {
      optional: true,
      validate: (0, _utils.assertNodeType)("JSXClosingElement")
    },
    children: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("JSXText", "JSXExpressionContainer", "JSXSpreadChild", "JSXElement", "JSXFragment")))
    }
  }, {
    selfClosing: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    }
  })
});
defineType("JSXEmptyExpression", {});
defineType("JSXExpressionContainer", {
  visitor: ["expression"],
  aliases: ["Immutable"],
  fields: {
    expression: {
      validate: (0, _utils.assertNodeType)("Expression", "JSXEmptyExpression")
    }
  }
});
defineType("JSXSpreadChild", {
  visitor: ["expression"],
  aliases: ["Immutable"],
  fields: {
    expression: {
      validate: (0, _utils.assertNodeType)("Expression")
    }
  }
});
defineType("JSXIdentifier", {
  builder: ["name"],
  fields: {
    name: {
      validate: (0, _utils.assertValueType)("string")
    }
  }
});
defineType("JSXMemberExpression", {
  visitor: ["object", "property"],
  fields: {
    object: {
      validate: (0, _utils.assertNodeType)("JSXMemberExpression", "JSXIdentifier")
    },
    property: {
      validate: (0, _utils.assertNodeType)("JSXIdentifier")
    }
  }
});
defineType("JSXNamespacedName", {
  visitor: ["namespace", "name"],
  fields: {
    namespace: {
      validate: (0, _utils.assertNodeType)("JSXIdentifier")
    },
    name: {
      validate: (0, _utils.assertNodeType)("JSXIdentifier")
    }
  }
});
defineType("JSXOpeningElement", {
  builder: ["name", "attributes", "selfClosing"],
  visitor: ["name", "attributes"],
  aliases: ["Immutable"],
  fields: {
    name: {
      validate: (0, _utils.assertNodeType)("JSXIdentifier", "JSXMemberExpression", "JSXNamespacedName")
    },
    selfClosing: {
      default: false
    },
    attributes: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("JSXAttribute", "JSXSpreadAttribute")))
    },
    typeParameters: {
      validate: (0, _utils.assertNodeType)("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
      optional: true
    }
  }
});
defineType("JSXSpreadAttribute", {
  visitor: ["argument"],
  fields: {
    argument: {
      validate: (0, _utils.assertNodeType)("Expression")
    }
  }
});
defineType("JSXText", {
  aliases: ["Immutable"],
  builder: ["value"],
  fields: {
    value: {
      validate: (0, _utils.assertValueType)("string")
    }
  }
});
defineType("JSXFragment", {
  builder: ["openingFragment", "closingFragment", "children"],
  visitor: ["openingFragment", "children", "closingFragment"],
  aliases: ["Immutable", "Expression"],
  fields: {
    openingFragment: {
      validate: (0, _utils.assertNodeType)("JSXOpeningFragment")
    },
    closingFragment: {
      validate: (0, _utils.assertNodeType)("JSXClosingFragment")
    },
    children: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("JSXText", "JSXExpressionContainer", "JSXSpreadChild", "JSXElement", "JSXFragment")))
    }
  }
});
defineType("JSXOpeningFragment", {
  aliases: ["Immutable"]
});
defineType("JSXClosingFragment", {
  aliases: ["Immutable"]
});

/***/ }),
/* 73 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _utils = __webpack_require__(70);

var _placeholders = __webpack_require__(74);

const defineType = (0, _utils.defineAliasedType)("Miscellaneous");
{
  defineType("Noop", {
    visitor: []
  });
}
defineType("Placeholder", {
  visitor: [],
  builder: ["expectedNode", "name"],
  fields: {
    name: {
      validate: (0, _utils.assertNodeType)("Identifier")
    },
    expectedNode: {
      validate: (0, _utils.assertOneOf)(..._placeholders.PLACEHOLDERS)
    }
  }
});
defineType("V8IntrinsicIdentifier", {
  builder: ["name"],
  fields: {
    name: {
      validate: (0, _utils.assertValueType)("string")
    }
  }
});

/***/ }),
/* 74 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PLACEHOLDERS_FLIPPED_ALIAS = exports.PLACEHOLDERS_ALIAS = exports.PLACEHOLDERS = void 0;

var _utils = __webpack_require__(70);

const PLACEHOLDERS = ["Identifier", "StringLiteral", "Expression", "Statement", "Declaration", "BlockStatement", "ClassBody", "Pattern"];
exports.PLACEHOLDERS = PLACEHOLDERS;
const PLACEHOLDERS_ALIAS = {
  Declaration: ["Statement"],
  Pattern: ["PatternLike", "LVal"]
};
exports.PLACEHOLDERS_ALIAS = PLACEHOLDERS_ALIAS;

for (const type of PLACEHOLDERS) {
  const alias = _utils.ALIAS_KEYS[type];
  if (alias != null && alias.length) PLACEHOLDERS_ALIAS[type] = alias;
}

const PLACEHOLDERS_FLIPPED_ALIAS = {};
exports.PLACEHOLDERS_FLIPPED_ALIAS = PLACEHOLDERS_FLIPPED_ALIAS;
Object.keys(PLACEHOLDERS_ALIAS).forEach(type => {
  PLACEHOLDERS_ALIAS[type].forEach(alias => {
    if (!Object.hasOwnProperty.call(PLACEHOLDERS_FLIPPED_ALIAS, alias)) {
      PLACEHOLDERS_FLIPPED_ALIAS[alias] = [];
    }

    PLACEHOLDERS_FLIPPED_ALIAS[alias].push(type);
  });
});

/***/ }),
/* 75 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(4);


var _utils = __webpack_require__(70);

(0, _utils.default)("ArgumentPlaceholder", {});
(0, _utils.default)("BindExpression", {
  visitor: ["object", "callee"],
  aliases: ["Expression"],
  fields: !process.env.BABEL_TYPES_8_BREAKING ? {
    object: {
      validate: Object.assign(() => {}, {
        oneOfNodeTypes: ["Expression"]
      })
    },
    callee: {
      validate: Object.assign(() => {}, {
        oneOfNodeTypes: ["Expression"]
      })
    }
  } : {
    object: {
      validate: (0, _utils.assertNodeType)("Expression")
    },
    callee: {
      validate: (0, _utils.assertNodeType)("Expression")
    }
  }
});
(0, _utils.default)("ImportAttribute", {
  visitor: ["key", "value"],
  fields: {
    key: {
      validate: (0, _utils.assertNodeType)("Identifier", "StringLiteral")
    },
    value: {
      validate: (0, _utils.assertNodeType)("StringLiteral")
    }
  }
});
(0, _utils.default)("Decorator", {
  visitor: ["expression"],
  fields: {
    expression: {
      validate: (0, _utils.assertNodeType)("Expression")
    }
  }
});
(0, _utils.default)("DoExpression", {
  visitor: ["body"],
  builder: ["body", "async"],
  aliases: ["Expression"],
  fields: {
    body: {
      validate: (0, _utils.assertNodeType)("BlockStatement")
    },
    async: {
      validate: (0, _utils.assertValueType)("boolean"),
      default: false
    }
  }
});
(0, _utils.default)("ExportDefaultSpecifier", {
  visitor: ["exported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    exported: {
      validate: (0, _utils.assertNodeType)("Identifier")
    }
  }
});
(0, _utils.default)("RecordExpression", {
  visitor: ["properties"],
  aliases: ["Expression"],
  fields: {
    properties: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("ObjectProperty", "SpreadElement")))
    }
  }
});
(0, _utils.default)("TupleExpression", {
  fields: {
    elements: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Expression", "SpreadElement"))),
      default: []
    }
  },
  visitor: ["elements"],
  aliases: ["Expression"]
});
(0, _utils.default)("DecimalLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: (0, _utils.assertValueType)("string")
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
(0, _utils.default)("ModuleExpression", {
  visitor: ["body"],
  fields: {
    body: {
      validate: (0, _utils.assertNodeType)("Program")
    }
  },
  aliases: ["Expression"]
});
(0, _utils.default)("TopicReference", {
  aliases: ["Expression"]
});
(0, _utils.default)("PipelineTopicExpression", {
  builder: ["expression"],
  visitor: ["expression"],
  fields: {
    expression: {
      validate: (0, _utils.assertNodeType)("Expression")
    }
  },
  aliases: ["Expression"]
});
(0, _utils.default)("PipelineBareFunction", {
  builder: ["callee"],
  visitor: ["callee"],
  fields: {
    callee: {
      validate: (0, _utils.assertNodeType)("Expression")
    }
  },
  aliases: ["Expression"]
});
(0, _utils.default)("PipelinePrimaryTopicReference", {
  aliases: ["Expression"]
});

/***/ }),
/* 76 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _utils = __webpack_require__(70);

var _core = __webpack_require__(60);

var _is = __webpack_require__(61);

const defineType = (0, _utils.defineAliasedType)("TypeScript");
const bool = (0, _utils.assertValueType)("boolean");

const tSFunctionTypeAnnotationCommon = () => ({
  returnType: {
    validate: (0, _utils.assertNodeType)("TSTypeAnnotation", "Noop"),
    optional: true
  },
  typeParameters: {
    validate: (0, _utils.assertNodeType)("TSTypeParameterDeclaration", "Noop"),
    optional: true
  }
});

defineType("TSParameterProperty", {
  aliases: ["LVal"],
  visitor: ["parameter"],
  fields: {
    accessibility: {
      validate: (0, _utils.assertOneOf)("public", "private", "protected"),
      optional: true
    },
    readonly: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    },
    parameter: {
      validate: (0, _utils.assertNodeType)("Identifier", "AssignmentPattern")
    },
    override: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    },
    decorators: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("Decorator"))),
      optional: true
    }
  }
});
defineType("TSDeclareFunction", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "typeParameters", "params", "returnType"],
  fields: Object.assign({}, (0, _core.functionDeclarationCommon)(), tSFunctionTypeAnnotationCommon())
});
defineType("TSDeclareMethod", {
  visitor: ["decorators", "key", "typeParameters", "params", "returnType"],
  fields: Object.assign({}, (0, _core.classMethodOrDeclareMethodCommon)(), tSFunctionTypeAnnotationCommon())
});
defineType("TSQualifiedName", {
  aliases: ["TSEntityName"],
  visitor: ["left", "right"],
  fields: {
    left: (0, _utils.validateType)("TSEntityName"),
    right: (0, _utils.validateType)("Identifier")
  }
});

const signatureDeclarationCommon = () => ({
  typeParameters: (0, _utils.validateOptionalType)("TSTypeParameterDeclaration"),
  ["parameters"]: (0, _utils.validateArrayOfType)(["Identifier", "RestElement"]),
  ["typeAnnotation"]: (0, _utils.validateOptionalType)("TSTypeAnnotation")
});

const callConstructSignatureDeclaration = {
  aliases: ["TSTypeElement"],
  visitor: ["typeParameters", "parameters", "typeAnnotation"],
  fields: signatureDeclarationCommon()
};
defineType("TSCallSignatureDeclaration", callConstructSignatureDeclaration);
defineType("TSConstructSignatureDeclaration", callConstructSignatureDeclaration);

const namedTypeElementCommon = () => ({
  key: (0, _utils.validateType)("Expression"),
  computed: {
    default: false
  },
  optional: (0, _utils.validateOptional)(bool)
});

defineType("TSPropertySignature", {
  aliases: ["TSTypeElement"],
  visitor: ["key", "typeAnnotation", "initializer"],
  fields: Object.assign({}, namedTypeElementCommon(), {
    readonly: (0, _utils.validateOptional)(bool),
    typeAnnotation: (0, _utils.validateOptionalType)("TSTypeAnnotation"),
    initializer: (0, _utils.validateOptionalType)("Expression"),
    kind: {
      validate: (0, _utils.assertOneOf)("get", "set")
    }
  })
});
defineType("TSMethodSignature", {
  aliases: ["TSTypeElement"],
  visitor: ["key", "typeParameters", "parameters", "typeAnnotation"],
  fields: Object.assign({}, signatureDeclarationCommon(), namedTypeElementCommon(), {
    kind: {
      validate: (0, _utils.assertOneOf)("method", "get", "set")
    }
  })
});
defineType("TSIndexSignature", {
  aliases: ["TSTypeElement"],
  visitor: ["parameters", "typeAnnotation"],
  fields: {
    readonly: (0, _utils.validateOptional)(bool),
    static: (0, _utils.validateOptional)(bool),
    parameters: (0, _utils.validateArrayOfType)("Identifier"),
    typeAnnotation: (0, _utils.validateOptionalType)("TSTypeAnnotation")
  }
});
const tsKeywordTypes = ["TSAnyKeyword", "TSBooleanKeyword", "TSBigIntKeyword", "TSIntrinsicKeyword", "TSNeverKeyword", "TSNullKeyword", "TSNumberKeyword", "TSObjectKeyword", "TSStringKeyword", "TSSymbolKeyword", "TSUndefinedKeyword", "TSUnknownKeyword", "TSVoidKeyword"];

for (const type of tsKeywordTypes) {
  defineType(type, {
    aliases: ["TSType", "TSBaseType"],
    visitor: [],
    fields: {}
  });
}

defineType("TSThisType", {
  aliases: ["TSType", "TSBaseType"],
  visitor: [],
  fields: {}
});
const fnOrCtrBase = {
  aliases: ["TSType"],
  visitor: ["typeParameters", "parameters", "typeAnnotation"]
};
defineType("TSFunctionType", Object.assign({}, fnOrCtrBase, {
  fields: signatureDeclarationCommon()
}));
defineType("TSConstructorType", Object.assign({}, fnOrCtrBase, {
  fields: Object.assign({}, signatureDeclarationCommon(), {
    abstract: (0, _utils.validateOptional)(bool)
  })
}));
defineType("TSTypeReference", {
  aliases: ["TSType"],
  visitor: ["typeName", "typeParameters"],
  fields: {
    typeName: (0, _utils.validateType)("TSEntityName"),
    typeParameters: (0, _utils.validateOptionalType)("TSTypeParameterInstantiation")
  }
});
defineType("TSTypePredicate", {
  aliases: ["TSType"],
  visitor: ["parameterName", "typeAnnotation"],
  builder: ["parameterName", "typeAnnotation", "asserts"],
  fields: {
    parameterName: (0, _utils.validateType)(["Identifier", "TSThisType"]),
    typeAnnotation: (0, _utils.validateOptionalType)("TSTypeAnnotation"),
    asserts: (0, _utils.validateOptional)(bool)
  }
});
defineType("TSTypeQuery", {
  aliases: ["TSType"],
  visitor: ["exprName", "typeParameters"],
  fields: {
    exprName: (0, _utils.validateType)(["TSEntityName", "TSImportType"]),
    typeParameters: (0, _utils.validateOptionalType)("TSTypeParameterInstantiation")
  }
});
defineType("TSTypeLiteral", {
  aliases: ["TSType"],
  visitor: ["members"],
  fields: {
    members: (0, _utils.validateArrayOfType)("TSTypeElement")
  }
});
defineType("TSArrayType", {
  aliases: ["TSType"],
  visitor: ["elementType"],
  fields: {
    elementType: (0, _utils.validateType)("TSType")
  }
});
defineType("TSTupleType", {
  aliases: ["TSType"],
  visitor: ["elementTypes"],
  fields: {
    elementTypes: (0, _utils.validateArrayOfType)(["TSType", "TSNamedTupleMember"])
  }
});
defineType("TSOptionalType", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: (0, _utils.validateType)("TSType")
  }
});
defineType("TSRestType", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: (0, _utils.validateType)("TSType")
  }
});
defineType("TSNamedTupleMember", {
  visitor: ["label", "elementType"],
  builder: ["label", "elementType", "optional"],
  fields: {
    label: (0, _utils.validateType)("Identifier"),
    optional: {
      validate: bool,
      default: false
    },
    elementType: (0, _utils.validateType)("TSType")
  }
});
const unionOrIntersection = {
  aliases: ["TSType"],
  visitor: ["types"],
  fields: {
    types: (0, _utils.validateArrayOfType)("TSType")
  }
};
defineType("TSUnionType", unionOrIntersection);
defineType("TSIntersectionType", unionOrIntersection);
defineType("TSConditionalType", {
  aliases: ["TSType"],
  visitor: ["checkType", "extendsType", "trueType", "falseType"],
  fields: {
    checkType: (0, _utils.validateType)("TSType"),
    extendsType: (0, _utils.validateType)("TSType"),
    trueType: (0, _utils.validateType)("TSType"),
    falseType: (0, _utils.validateType)("TSType")
  }
});
defineType("TSInferType", {
  aliases: ["TSType"],
  visitor: ["typeParameter"],
  fields: {
    typeParameter: (0, _utils.validateType)("TSTypeParameter")
  }
});
defineType("TSParenthesizedType", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: (0, _utils.validateType)("TSType")
  }
});
defineType("TSTypeOperator", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: {
    operator: (0, _utils.validate)((0, _utils.assertValueType)("string")),
    typeAnnotation: (0, _utils.validateType)("TSType")
  }
});
defineType("TSIndexedAccessType", {
  aliases: ["TSType"],
  visitor: ["objectType", "indexType"],
  fields: {
    objectType: (0, _utils.validateType)("TSType"),
    indexType: (0, _utils.validateType)("TSType")
  }
});
defineType("TSMappedType", {
  aliases: ["TSType"],
  visitor: ["typeParameter", "typeAnnotation", "nameType"],
  fields: {
    readonly: (0, _utils.validateOptional)((0, _utils.assertOneOf)(true, false, "+", "-")),
    typeParameter: (0, _utils.validateType)("TSTypeParameter"),
    optional: (0, _utils.validateOptional)((0, _utils.assertOneOf)(true, false, "+", "-")),
    typeAnnotation: (0, _utils.validateOptionalType)("TSType"),
    nameType: (0, _utils.validateOptionalType)("TSType")
  }
});
defineType("TSLiteralType", {
  aliases: ["TSType", "TSBaseType"],
  visitor: ["literal"],
  fields: {
    literal: {
      validate: function () {
        const unaryExpression = (0, _utils.assertNodeType)("NumericLiteral", "BigIntLiteral");
        const unaryOperator = (0, _utils.assertOneOf)("-");
        const literal = (0, _utils.assertNodeType)("NumericLiteral", "StringLiteral", "BooleanLiteral", "BigIntLiteral", "TemplateLiteral");

        function validator(parent, key, node) {
          if ((0, _is.default)("UnaryExpression", node)) {
            unaryOperator(node, "operator", node.operator);
            unaryExpression(node, "argument", node.argument);
          } else {
            literal(parent, key, node);
          }
        }

        validator.oneOfNodeTypes = ["NumericLiteral", "StringLiteral", "BooleanLiteral", "BigIntLiteral", "TemplateLiteral", "UnaryExpression"];
        return validator;
      }()
    }
  }
});
defineType("TSExpressionWithTypeArguments", {
  aliases: ["TSType"],
  visitor: ["expression", "typeParameters"],
  fields: {
    expression: (0, _utils.validateType)("TSEntityName"),
    typeParameters: (0, _utils.validateOptionalType)("TSTypeParameterInstantiation")
  }
});
defineType("TSInterfaceDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "typeParameters", "extends", "body"],
  fields: {
    declare: (0, _utils.validateOptional)(bool),
    id: (0, _utils.validateType)("Identifier"),
    typeParameters: (0, _utils.validateOptionalType)("TSTypeParameterDeclaration"),
    extends: (0, _utils.validateOptional)((0, _utils.arrayOfType)("TSExpressionWithTypeArguments")),
    body: (0, _utils.validateType)("TSInterfaceBody")
  }
});
defineType("TSInterfaceBody", {
  visitor: ["body"],
  fields: {
    body: (0, _utils.validateArrayOfType)("TSTypeElement")
  }
});
defineType("TSTypeAliasDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "typeParameters", "typeAnnotation"],
  fields: {
    declare: (0, _utils.validateOptional)(bool),
    id: (0, _utils.validateType)("Identifier"),
    typeParameters: (0, _utils.validateOptionalType)("TSTypeParameterDeclaration"),
    typeAnnotation: (0, _utils.validateType)("TSType")
  }
});
defineType("TSInstantiationExpression", {
  aliases: ["Expression"],
  visitor: ["expression", "typeParameters"],
  fields: {
    expression: (0, _utils.validateType)("Expression"),
    typeParameters: (0, _utils.validateOptionalType)("TSTypeParameterInstantiation")
  }
});
defineType("TSAsExpression", {
  aliases: ["Expression", "LVal", "PatternLike"],
  visitor: ["expression", "typeAnnotation"],
  fields: {
    expression: (0, _utils.validateType)("Expression"),
    typeAnnotation: (0, _utils.validateType)("TSType")
  }
});
defineType("TSTypeAssertion", {
  aliases: ["Expression", "LVal", "PatternLike"],
  visitor: ["typeAnnotation", "expression"],
  fields: {
    typeAnnotation: (0, _utils.validateType)("TSType"),
    expression: (0, _utils.validateType)("Expression")
  }
});
defineType("TSEnumDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "members"],
  fields: {
    declare: (0, _utils.validateOptional)(bool),
    const: (0, _utils.validateOptional)(bool),
    id: (0, _utils.validateType)("Identifier"),
    members: (0, _utils.validateArrayOfType)("TSEnumMember"),
    initializer: (0, _utils.validateOptionalType)("Expression")
  }
});
defineType("TSEnumMember", {
  visitor: ["id", "initializer"],
  fields: {
    id: (0, _utils.validateType)(["Identifier", "StringLiteral"]),
    initializer: (0, _utils.validateOptionalType)("Expression")
  }
});
defineType("TSModuleDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "body"],
  fields: {
    declare: (0, _utils.validateOptional)(bool),
    global: (0, _utils.validateOptional)(bool),
    id: (0, _utils.validateType)(["Identifier", "StringLiteral"]),
    body: (0, _utils.validateType)(["TSModuleBlock", "TSModuleDeclaration"])
  }
});
defineType("TSModuleBlock", {
  aliases: ["Scopable", "Block", "BlockParent"],
  visitor: ["body"],
  fields: {
    body: (0, _utils.validateArrayOfType)("Statement")
  }
});
defineType("TSImportType", {
  aliases: ["TSType"],
  visitor: ["argument", "qualifier", "typeParameters"],
  fields: {
    argument: (0, _utils.validateType)("StringLiteral"),
    qualifier: (0, _utils.validateOptionalType)("TSEntityName"),
    typeParameters: (0, _utils.validateOptionalType)("TSTypeParameterInstantiation")
  }
});
defineType("TSImportEqualsDeclaration", {
  aliases: ["Statement"],
  visitor: ["id", "moduleReference"],
  fields: {
    isExport: (0, _utils.validate)(bool),
    id: (0, _utils.validateType)("Identifier"),
    moduleReference: (0, _utils.validateType)(["TSEntityName", "TSExternalModuleReference"]),
    importKind: {
      validate: (0, _utils.assertOneOf)("type", "value"),
      optional: true
    }
  }
});
defineType("TSExternalModuleReference", {
  visitor: ["expression"],
  fields: {
    expression: (0, _utils.validateType)("StringLiteral")
  }
});
defineType("TSNonNullExpression", {
  aliases: ["Expression", "LVal", "PatternLike"],
  visitor: ["expression"],
  fields: {
    expression: (0, _utils.validateType)("Expression")
  }
});
defineType("TSExportAssignment", {
  aliases: ["Statement"],
  visitor: ["expression"],
  fields: {
    expression: (0, _utils.validateType)("Expression")
  }
});
defineType("TSNamespaceExportDeclaration", {
  aliases: ["Statement"],
  visitor: ["id"],
  fields: {
    id: (0, _utils.validateType)("Identifier")
  }
});
defineType("TSTypeAnnotation", {
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: {
      validate: (0, _utils.assertNodeType)("TSType")
    }
  }
});
defineType("TSTypeParameterInstantiation", {
  visitor: ["params"],
  fields: {
    params: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("TSType")))
    }
  }
});
defineType("TSTypeParameterDeclaration", {
  visitor: ["params"],
  fields: {
    params: {
      validate: (0, _utils.chain)((0, _utils.assertValueType)("array"), (0, _utils.assertEach)((0, _utils.assertNodeType)("TSTypeParameter")))
    }
  }
});
defineType("TSTypeParameter", {
  builder: ["constraint", "default", "name"],
  visitor: ["constraint", "default"],
  fields: {
    name: {
      validate: (0, _utils.assertValueType)("string")
    },
    in: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    },
    out: {
      validate: (0, _utils.assertValueType)("boolean"),
      optional: true
    },
    constraint: {
      validate: (0, _utils.assertNodeType)("TSType"),
      optional: true
    },
    default: {
      validate: (0, _utils.assertNodeType)("TSType"),
      optional: true
    }
  }
});

/***/ }),
/* 77 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = assertNode;

var _isNode = __webpack_require__(78);

function assertNode(node) {
  if (!(0, _isNode.default)(node)) {
    var _node$type;

    const type = (_node$type = node == null ? void 0 : node.type) != null ? _node$type : JSON.stringify(node);
    throw new TypeError(`Not a valid node of type "${type}"`);
  }
}

/***/ }),
/* 78 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isNode;

var _definitions = __webpack_require__(58);

function isNode(node) {
  return !!(node && _definitions.VISITOR_KEYS[node.type]);
}

/***/ }),
/* 79 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var console = __webpack_require__(5);


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.assertAccessor = assertAccessor;
exports.assertAnyTypeAnnotation = assertAnyTypeAnnotation;
exports.assertArgumentPlaceholder = assertArgumentPlaceholder;
exports.assertArrayExpression = assertArrayExpression;
exports.assertArrayPattern = assertArrayPattern;
exports.assertArrayTypeAnnotation = assertArrayTypeAnnotation;
exports.assertArrowFunctionExpression = assertArrowFunctionExpression;
exports.assertAssignmentExpression = assertAssignmentExpression;
exports.assertAssignmentPattern = assertAssignmentPattern;
exports.assertAwaitExpression = assertAwaitExpression;
exports.assertBigIntLiteral = assertBigIntLiteral;
exports.assertBinary = assertBinary;
exports.assertBinaryExpression = assertBinaryExpression;
exports.assertBindExpression = assertBindExpression;
exports.assertBlock = assertBlock;
exports.assertBlockParent = assertBlockParent;
exports.assertBlockStatement = assertBlockStatement;
exports.assertBooleanLiteral = assertBooleanLiteral;
exports.assertBooleanLiteralTypeAnnotation = assertBooleanLiteralTypeAnnotation;
exports.assertBooleanTypeAnnotation = assertBooleanTypeAnnotation;
exports.assertBreakStatement = assertBreakStatement;
exports.assertCallExpression = assertCallExpression;
exports.assertCatchClause = assertCatchClause;
exports.assertClass = assertClass;
exports.assertClassAccessorProperty = assertClassAccessorProperty;
exports.assertClassBody = assertClassBody;
exports.assertClassDeclaration = assertClassDeclaration;
exports.assertClassExpression = assertClassExpression;
exports.assertClassImplements = assertClassImplements;
exports.assertClassMethod = assertClassMethod;
exports.assertClassPrivateMethod = assertClassPrivateMethod;
exports.assertClassPrivateProperty = assertClassPrivateProperty;
exports.assertClassProperty = assertClassProperty;
exports.assertCompletionStatement = assertCompletionStatement;
exports.assertConditional = assertConditional;
exports.assertConditionalExpression = assertConditionalExpression;
exports.assertContinueStatement = assertContinueStatement;
exports.assertDebuggerStatement = assertDebuggerStatement;
exports.assertDecimalLiteral = assertDecimalLiteral;
exports.assertDeclaration = assertDeclaration;
exports.assertDeclareClass = assertDeclareClass;
exports.assertDeclareExportAllDeclaration = assertDeclareExportAllDeclaration;
exports.assertDeclareExportDeclaration = assertDeclareExportDeclaration;
exports.assertDeclareFunction = assertDeclareFunction;
exports.assertDeclareInterface = assertDeclareInterface;
exports.assertDeclareModule = assertDeclareModule;
exports.assertDeclareModuleExports = assertDeclareModuleExports;
exports.assertDeclareOpaqueType = assertDeclareOpaqueType;
exports.assertDeclareTypeAlias = assertDeclareTypeAlias;
exports.assertDeclareVariable = assertDeclareVariable;
exports.assertDeclaredPredicate = assertDeclaredPredicate;
exports.assertDecorator = assertDecorator;
exports.assertDirective = assertDirective;
exports.assertDirectiveLiteral = assertDirectiveLiteral;
exports.assertDoExpression = assertDoExpression;
exports.assertDoWhileStatement = assertDoWhileStatement;
exports.assertEmptyStatement = assertEmptyStatement;
exports.assertEmptyTypeAnnotation = assertEmptyTypeAnnotation;
exports.assertEnumBody = assertEnumBody;
exports.assertEnumBooleanBody = assertEnumBooleanBody;
exports.assertEnumBooleanMember = assertEnumBooleanMember;
exports.assertEnumDeclaration = assertEnumDeclaration;
exports.assertEnumDefaultedMember = assertEnumDefaultedMember;
exports.assertEnumMember = assertEnumMember;
exports.assertEnumNumberBody = assertEnumNumberBody;
exports.assertEnumNumberMember = assertEnumNumberMember;
exports.assertEnumStringBody = assertEnumStringBody;
exports.assertEnumStringMember = assertEnumStringMember;
exports.assertEnumSymbolBody = assertEnumSymbolBody;
exports.assertExistsTypeAnnotation = assertExistsTypeAnnotation;
exports.assertExportAllDeclaration = assertExportAllDeclaration;
exports.assertExportDeclaration = assertExportDeclaration;
exports.assertExportDefaultDeclaration = assertExportDefaultDeclaration;
exports.assertExportDefaultSpecifier = assertExportDefaultSpecifier;
exports.assertExportNamedDeclaration = assertExportNamedDeclaration;
exports.assertExportNamespaceSpecifier = assertExportNamespaceSpecifier;
exports.assertExportSpecifier = assertExportSpecifier;
exports.assertExpression = assertExpression;
exports.assertExpressionStatement = assertExpressionStatement;
exports.assertExpressionWrapper = assertExpressionWrapper;
exports.assertFile = assertFile;
exports.assertFlow = assertFlow;
exports.assertFlowBaseAnnotation = assertFlowBaseAnnotation;
exports.assertFlowDeclaration = assertFlowDeclaration;
exports.assertFlowPredicate = assertFlowPredicate;
exports.assertFlowType = assertFlowType;
exports.assertFor = assertFor;
exports.assertForInStatement = assertForInStatement;
exports.assertForOfStatement = assertForOfStatement;
exports.assertForStatement = assertForStatement;
exports.assertForXStatement = assertForXStatement;
exports.assertFunction = assertFunction;
exports.assertFunctionDeclaration = assertFunctionDeclaration;
exports.assertFunctionExpression = assertFunctionExpression;
exports.assertFunctionParent = assertFunctionParent;
exports.assertFunctionTypeAnnotation = assertFunctionTypeAnnotation;
exports.assertFunctionTypeParam = assertFunctionTypeParam;
exports.assertGenericTypeAnnotation = assertGenericTypeAnnotation;
exports.assertIdentifier = assertIdentifier;
exports.assertIfStatement = assertIfStatement;
exports.assertImmutable = assertImmutable;
exports.assertImport = assertImport;
exports.assertImportAttribute = assertImportAttribute;
exports.assertImportDeclaration = assertImportDeclaration;
exports.assertImportDefaultSpecifier = assertImportDefaultSpecifier;
exports.assertImportNamespaceSpecifier = assertImportNamespaceSpecifier;
exports.assertImportSpecifier = assertImportSpecifier;
exports.assertIndexedAccessType = assertIndexedAccessType;
exports.assertInferredPredicate = assertInferredPredicate;
exports.assertInterfaceDeclaration = assertInterfaceDeclaration;
exports.assertInterfaceExtends = assertInterfaceExtends;
exports.assertInterfaceTypeAnnotation = assertInterfaceTypeAnnotation;
exports.assertInterpreterDirective = assertInterpreterDirective;
exports.assertIntersectionTypeAnnotation = assertIntersectionTypeAnnotation;
exports.assertJSX = assertJSX;
exports.assertJSXAttribute = assertJSXAttribute;
exports.assertJSXClosingElement = assertJSXClosingElement;
exports.assertJSXClosingFragment = assertJSXClosingFragment;
exports.assertJSXElement = assertJSXElement;
exports.assertJSXEmptyExpression = assertJSXEmptyExpression;
exports.assertJSXExpressionContainer = assertJSXExpressionContainer;
exports.assertJSXFragment = assertJSXFragment;
exports.assertJSXIdentifier = assertJSXIdentifier;
exports.assertJSXMemberExpression = assertJSXMemberExpression;
exports.assertJSXNamespacedName = assertJSXNamespacedName;
exports.assertJSXOpeningElement = assertJSXOpeningElement;
exports.assertJSXOpeningFragment = assertJSXOpeningFragment;
exports.assertJSXSpreadAttribute = assertJSXSpreadAttribute;
exports.assertJSXSpreadChild = assertJSXSpreadChild;
exports.assertJSXText = assertJSXText;
exports.assertLVal = assertLVal;
exports.assertLabeledStatement = assertLabeledStatement;
exports.assertLiteral = assertLiteral;
exports.assertLogicalExpression = assertLogicalExpression;
exports.assertLoop = assertLoop;
exports.assertMemberExpression = assertMemberExpression;
exports.assertMetaProperty = assertMetaProperty;
exports.assertMethod = assertMethod;
exports.assertMiscellaneous = assertMiscellaneous;
exports.assertMixedTypeAnnotation = assertMixedTypeAnnotation;
exports.assertModuleDeclaration = assertModuleDeclaration;
exports.assertModuleExpression = assertModuleExpression;
exports.assertModuleSpecifier = assertModuleSpecifier;
exports.assertNewExpression = assertNewExpression;
exports.assertNoop = assertNoop;
exports.assertNullLiteral = assertNullLiteral;
exports.assertNullLiteralTypeAnnotation = assertNullLiteralTypeAnnotation;
exports.assertNullableTypeAnnotation = assertNullableTypeAnnotation;
exports.assertNumberLiteral = assertNumberLiteral;
exports.assertNumberLiteralTypeAnnotation = assertNumberLiteralTypeAnnotation;
exports.assertNumberTypeAnnotation = assertNumberTypeAnnotation;
exports.assertNumericLiteral = assertNumericLiteral;
exports.assertObjectExpression = assertObjectExpression;
exports.assertObjectMember = assertObjectMember;
exports.assertObjectMethod = assertObjectMethod;
exports.assertObjectPattern = assertObjectPattern;
exports.assertObjectProperty = assertObjectProperty;
exports.assertObjectTypeAnnotation = assertObjectTypeAnnotation;
exports.assertObjectTypeCallProperty = assertObjectTypeCallProperty;
exports.assertObjectTypeIndexer = assertObjectTypeIndexer;
exports.assertObjectTypeInternalSlot = assertObjectTypeInternalSlot;
exports.assertObjectTypeProperty = assertObjectTypeProperty;
exports.assertObjectTypeSpreadProperty = assertObjectTypeSpreadProperty;
exports.assertOpaqueType = assertOpaqueType;
exports.assertOptionalCallExpression = assertOptionalCallExpression;
exports.assertOptionalIndexedAccessType = assertOptionalIndexedAccessType;
exports.assertOptionalMemberExpression = assertOptionalMemberExpression;
exports.assertParenthesizedExpression = assertParenthesizedExpression;
exports.assertPattern = assertPattern;
exports.assertPatternLike = assertPatternLike;
exports.assertPipelineBareFunction = assertPipelineBareFunction;
exports.assertPipelinePrimaryTopicReference = assertPipelinePrimaryTopicReference;
exports.assertPipelineTopicExpression = assertPipelineTopicExpression;
exports.assertPlaceholder = assertPlaceholder;
exports.assertPrivate = assertPrivate;
exports.assertPrivateName = assertPrivateName;
exports.assertProgram = assertProgram;
exports.assertProperty = assertProperty;
exports.assertPureish = assertPureish;
exports.assertQualifiedTypeIdentifier = assertQualifiedTypeIdentifier;
exports.assertRecordExpression = assertRecordExpression;
exports.assertRegExpLiteral = assertRegExpLiteral;
exports.assertRegexLiteral = assertRegexLiteral;
exports.assertRestElement = assertRestElement;
exports.assertRestProperty = assertRestProperty;
exports.assertReturnStatement = assertReturnStatement;
exports.assertScopable = assertScopable;
exports.assertSequenceExpression = assertSequenceExpression;
exports.assertSpreadElement = assertSpreadElement;
exports.assertSpreadProperty = assertSpreadProperty;
exports.assertStandardized = assertStandardized;
exports.assertStatement = assertStatement;
exports.assertStaticBlock = assertStaticBlock;
exports.assertStringLiteral = assertStringLiteral;
exports.assertStringLiteralTypeAnnotation = assertStringLiteralTypeAnnotation;
exports.assertStringTypeAnnotation = assertStringTypeAnnotation;
exports.assertSuper = assertSuper;
exports.assertSwitchCase = assertSwitchCase;
exports.assertSwitchStatement = assertSwitchStatement;
exports.assertSymbolTypeAnnotation = assertSymbolTypeAnnotation;
exports.assertTSAnyKeyword = assertTSAnyKeyword;
exports.assertTSArrayType = assertTSArrayType;
exports.assertTSAsExpression = assertTSAsExpression;
exports.assertTSBaseType = assertTSBaseType;
exports.assertTSBigIntKeyword = assertTSBigIntKeyword;
exports.assertTSBooleanKeyword = assertTSBooleanKeyword;
exports.assertTSCallSignatureDeclaration = assertTSCallSignatureDeclaration;
exports.assertTSConditionalType = assertTSConditionalType;
exports.assertTSConstructSignatureDeclaration = assertTSConstructSignatureDeclaration;
exports.assertTSConstructorType = assertTSConstructorType;
exports.assertTSDeclareFunction = assertTSDeclareFunction;
exports.assertTSDeclareMethod = assertTSDeclareMethod;
exports.assertTSEntityName = assertTSEntityName;
exports.assertTSEnumDeclaration = assertTSEnumDeclaration;
exports.assertTSEnumMember = assertTSEnumMember;
exports.assertTSExportAssignment = assertTSExportAssignment;
exports.assertTSExpressionWithTypeArguments = assertTSExpressionWithTypeArguments;
exports.assertTSExternalModuleReference = assertTSExternalModuleReference;
exports.assertTSFunctionType = assertTSFunctionType;
exports.assertTSImportEqualsDeclaration = assertTSImportEqualsDeclaration;
exports.assertTSImportType = assertTSImportType;
exports.assertTSIndexSignature = assertTSIndexSignature;
exports.assertTSIndexedAccessType = assertTSIndexedAccessType;
exports.assertTSInferType = assertTSInferType;
exports.assertTSInstantiationExpression = assertTSInstantiationExpression;
exports.assertTSInterfaceBody = assertTSInterfaceBody;
exports.assertTSInterfaceDeclaration = assertTSInterfaceDeclaration;
exports.assertTSIntersectionType = assertTSIntersectionType;
exports.assertTSIntrinsicKeyword = assertTSIntrinsicKeyword;
exports.assertTSLiteralType = assertTSLiteralType;
exports.assertTSMappedType = assertTSMappedType;
exports.assertTSMethodSignature = assertTSMethodSignature;
exports.assertTSModuleBlock = assertTSModuleBlock;
exports.assertTSModuleDeclaration = assertTSModuleDeclaration;
exports.assertTSNamedTupleMember = assertTSNamedTupleMember;
exports.assertTSNamespaceExportDeclaration = assertTSNamespaceExportDeclaration;
exports.assertTSNeverKeyword = assertTSNeverKeyword;
exports.assertTSNonNullExpression = assertTSNonNullExpression;
exports.assertTSNullKeyword = assertTSNullKeyword;
exports.assertTSNumberKeyword = assertTSNumberKeyword;
exports.assertTSObjectKeyword = assertTSObjectKeyword;
exports.assertTSOptionalType = assertTSOptionalType;
exports.assertTSParameterProperty = assertTSParameterProperty;
exports.assertTSParenthesizedType = assertTSParenthesizedType;
exports.assertTSPropertySignature = assertTSPropertySignature;
exports.assertTSQualifiedName = assertTSQualifiedName;
exports.assertTSRestType = assertTSRestType;
exports.assertTSStringKeyword = assertTSStringKeyword;
exports.assertTSSymbolKeyword = assertTSSymbolKeyword;
exports.assertTSThisType = assertTSThisType;
exports.assertTSTupleType = assertTSTupleType;
exports.assertTSType = assertTSType;
exports.assertTSTypeAliasDeclaration = assertTSTypeAliasDeclaration;
exports.assertTSTypeAnnotation = assertTSTypeAnnotation;
exports.assertTSTypeAssertion = assertTSTypeAssertion;
exports.assertTSTypeElement = assertTSTypeElement;
exports.assertTSTypeLiteral = assertTSTypeLiteral;
exports.assertTSTypeOperator = assertTSTypeOperator;
exports.assertTSTypeParameter = assertTSTypeParameter;
exports.assertTSTypeParameterDeclaration = assertTSTypeParameterDeclaration;
exports.assertTSTypeParameterInstantiation = assertTSTypeParameterInstantiation;
exports.assertTSTypePredicate = assertTSTypePredicate;
exports.assertTSTypeQuery = assertTSTypeQuery;
exports.assertTSTypeReference = assertTSTypeReference;
exports.assertTSUndefinedKeyword = assertTSUndefinedKeyword;
exports.assertTSUnionType = assertTSUnionType;
exports.assertTSUnknownKeyword = assertTSUnknownKeyword;
exports.assertTSVoidKeyword = assertTSVoidKeyword;
exports.assertTaggedTemplateExpression = assertTaggedTemplateExpression;
exports.assertTemplateElement = assertTemplateElement;
exports.assertTemplateLiteral = assertTemplateLiteral;
exports.assertTerminatorless = assertTerminatorless;
exports.assertThisExpression = assertThisExpression;
exports.assertThisTypeAnnotation = assertThisTypeAnnotation;
exports.assertThrowStatement = assertThrowStatement;
exports.assertTopicReference = assertTopicReference;
exports.assertTryStatement = assertTryStatement;
exports.assertTupleExpression = assertTupleExpression;
exports.assertTupleTypeAnnotation = assertTupleTypeAnnotation;
exports.assertTypeAlias = assertTypeAlias;
exports.assertTypeAnnotation = assertTypeAnnotation;
exports.assertTypeCastExpression = assertTypeCastExpression;
exports.assertTypeParameter = assertTypeParameter;
exports.assertTypeParameterDeclaration = assertTypeParameterDeclaration;
exports.assertTypeParameterInstantiation = assertTypeParameterInstantiation;
exports.assertTypeScript = assertTypeScript;
exports.assertTypeofTypeAnnotation = assertTypeofTypeAnnotation;
exports.assertUnaryExpression = assertUnaryExpression;
exports.assertUnaryLike = assertUnaryLike;
exports.assertUnionTypeAnnotation = assertUnionTypeAnnotation;
exports.assertUpdateExpression = assertUpdateExpression;
exports.assertUserWhitespacable = assertUserWhitespacable;
exports.assertV8IntrinsicIdentifier = assertV8IntrinsicIdentifier;
exports.assertVariableDeclaration = assertVariableDeclaration;
exports.assertVariableDeclarator = assertVariableDeclarator;
exports.assertVariance = assertVariance;
exports.assertVoidTypeAnnotation = assertVoidTypeAnnotation;
exports.assertWhile = assertWhile;
exports.assertWhileStatement = assertWhileStatement;
exports.assertWithStatement = assertWithStatement;
exports.assertYieldExpression = assertYieldExpression;

var _is = __webpack_require__(61);

function assert(type, node, opts) {
  if (!(0, _is.default)(type, node, opts)) {
    throw new Error(`Expected type "${type}" with option ${JSON.stringify(opts)}, ` + `but instead got "${node.type}".`);
  }
}

function assertArrayExpression(node, opts) {
  assert("ArrayExpression", node, opts);
}

function assertAssignmentExpression(node, opts) {
  assert("AssignmentExpression", node, opts);
}

function assertBinaryExpression(node, opts) {
  assert("BinaryExpression", node, opts);
}

function assertInterpreterDirective(node, opts) {
  assert("InterpreterDirective", node, opts);
}

function assertDirective(node, opts) {
  assert("Directive", node, opts);
}

function assertDirectiveLiteral(node, opts) {
  assert("DirectiveLiteral", node, opts);
}

function assertBlockStatement(node, opts) {
  assert("BlockStatement", node, opts);
}

function assertBreakStatement(node, opts) {
  assert("BreakStatement", node, opts);
}

function assertCallExpression(node, opts) {
  assert("CallExpression", node, opts);
}

function assertCatchClause(node, opts) {
  assert("CatchClause", node, opts);
}

function assertConditionalExpression(node, opts) {
  assert("ConditionalExpression", node, opts);
}

function assertContinueStatement(node, opts) {
  assert("ContinueStatement", node, opts);
}

function assertDebuggerStatement(node, opts) {
  assert("DebuggerStatement", node, opts);
}

function assertDoWhileStatement(node, opts) {
  assert("DoWhileStatement", node, opts);
}

function assertEmptyStatement(node, opts) {
  assert("EmptyStatement", node, opts);
}

function assertExpressionStatement(node, opts) {
  assert("ExpressionStatement", node, opts);
}

function assertFile(node, opts) {
  assert("File", node, opts);
}

function assertForInStatement(node, opts) {
  assert("ForInStatement", node, opts);
}

function assertForStatement(node, opts) {
  assert("ForStatement", node, opts);
}

function assertFunctionDeclaration(node, opts) {
  assert("FunctionDeclaration", node, opts);
}

function assertFunctionExpression(node, opts) {
  assert("FunctionExpression", node, opts);
}

function assertIdentifier(node, opts) {
  assert("Identifier", node, opts);
}

function assertIfStatement(node, opts) {
  assert("IfStatement", node, opts);
}

function assertLabeledStatement(node, opts) {
  assert("LabeledStatement", node, opts);
}

function assertStringLiteral(node, opts) {
  assert("StringLiteral", node, opts);
}

function assertNumericLiteral(node, opts) {
  assert("NumericLiteral", node, opts);
}

function assertNullLiteral(node, opts) {
  assert("NullLiteral", node, opts);
}

function assertBooleanLiteral(node, opts) {
  assert("BooleanLiteral", node, opts);
}

function assertRegExpLiteral(node, opts) {
  assert("RegExpLiteral", node, opts);
}

function assertLogicalExpression(node, opts) {
  assert("LogicalExpression", node, opts);
}

function assertMemberExpression(node, opts) {
  assert("MemberExpression", node, opts);
}

function assertNewExpression(node, opts) {
  assert("NewExpression", node, opts);
}

function assertProgram(node, opts) {
  assert("Program", node, opts);
}

function assertObjectExpression(node, opts) {
  assert("ObjectExpression", node, opts);
}

function assertObjectMethod(node, opts) {
  assert("ObjectMethod", node, opts);
}

function assertObjectProperty(node, opts) {
  assert("ObjectProperty", node, opts);
}

function assertRestElement(node, opts) {
  assert("RestElement", node, opts);
}

function assertReturnStatement(node, opts) {
  assert("ReturnStatement", node, opts);
}

function assertSequenceExpression(node, opts) {
  assert("SequenceExpression", node, opts);
}

function assertParenthesizedExpression(node, opts) {
  assert("ParenthesizedExpression", node, opts);
}

function assertSwitchCase(node, opts) {
  assert("SwitchCase", node, opts);
}

function assertSwitchStatement(node, opts) {
  assert("SwitchStatement", node, opts);
}

function assertThisExpression(node, opts) {
  assert("ThisExpression", node, opts);
}

function assertThrowStatement(node, opts) {
  assert("ThrowStatement", node, opts);
}

function assertTryStatement(node, opts) {
  assert("TryStatement", node, opts);
}

function assertUnaryExpression(node, opts) {
  assert("UnaryExpression", node, opts);
}

function assertUpdateExpression(node, opts) {
  assert("UpdateExpression", node, opts);
}

function assertVariableDeclaration(node, opts) {
  assert("VariableDeclaration", node, opts);
}

function assertVariableDeclarator(node, opts) {
  assert("VariableDeclarator", node, opts);
}

function assertWhileStatement(node, opts) {
  assert("WhileStatement", node, opts);
}

function assertWithStatement(node, opts) {
  assert("WithStatement", node, opts);
}

function assertAssignmentPattern(node, opts) {
  assert("AssignmentPattern", node, opts);
}

function assertArrayPattern(node, opts) {
  assert("ArrayPattern", node, opts);
}

function assertArrowFunctionExpression(node, opts) {
  assert("ArrowFunctionExpression", node, opts);
}

function assertClassBody(node, opts) {
  assert("ClassBody", node, opts);
}

function assertClassExpression(node, opts) {
  assert("ClassExpression", node, opts);
}

function assertClassDeclaration(node, opts) {
  assert("ClassDeclaration", node, opts);
}

function assertExportAllDeclaration(node, opts) {
  assert("ExportAllDeclaration", node, opts);
}

function assertExportDefaultDeclaration(node, opts) {
  assert("ExportDefaultDeclaration", node, opts);
}

function assertExportNamedDeclaration(node, opts) {
  assert("ExportNamedDeclaration", node, opts);
}

function assertExportSpecifier(node, opts) {
  assert("ExportSpecifier", node, opts);
}

function assertForOfStatement(node, opts) {
  assert("ForOfStatement", node, opts);
}

function assertImportDeclaration(node, opts) {
  assert("ImportDeclaration", node, opts);
}

function assertImportDefaultSpecifier(node, opts) {
  assert("ImportDefaultSpecifier", node, opts);
}

function assertImportNamespaceSpecifier(node, opts) {
  assert("ImportNamespaceSpecifier", node, opts);
}

function assertImportSpecifier(node, opts) {
  assert("ImportSpecifier", node, opts);
}

function assertMetaProperty(node, opts) {
  assert("MetaProperty", node, opts);
}

function assertClassMethod(node, opts) {
  assert("ClassMethod", node, opts);
}

function assertObjectPattern(node, opts) {
  assert("ObjectPattern", node, opts);
}

function assertSpreadElement(node, opts) {
  assert("SpreadElement", node, opts);
}

function assertSuper(node, opts) {
  assert("Super", node, opts);
}

function assertTaggedTemplateExpression(node, opts) {
  assert("TaggedTemplateExpression", node, opts);
}

function assertTemplateElement(node, opts) {
  assert("TemplateElement", node, opts);
}

function assertTemplateLiteral(node, opts) {
  assert("TemplateLiteral", node, opts);
}

function assertYieldExpression(node, opts) {
  assert("YieldExpression", node, opts);
}

function assertAwaitExpression(node, opts) {
  assert("AwaitExpression", node, opts);
}

function assertImport(node, opts) {
  assert("Import", node, opts);
}

function assertBigIntLiteral(node, opts) {
  assert("BigIntLiteral", node, opts);
}

function assertExportNamespaceSpecifier(node, opts) {
  assert("ExportNamespaceSpecifier", node, opts);
}

function assertOptionalMemberExpression(node, opts) {
  assert("OptionalMemberExpression", node, opts);
}

function assertOptionalCallExpression(node, opts) {
  assert("OptionalCallExpression", node, opts);
}

function assertClassProperty(node, opts) {
  assert("ClassProperty", node, opts);
}

function assertClassAccessorProperty(node, opts) {
  assert("ClassAccessorProperty", node, opts);
}

function assertClassPrivateProperty(node, opts) {
  assert("ClassPrivateProperty", node, opts);
}

function assertClassPrivateMethod(node, opts) {
  assert("ClassPrivateMethod", node, opts);
}

function assertPrivateName(node, opts) {
  assert("PrivateName", node, opts);
}

function assertStaticBlock(node, opts) {
  assert("StaticBlock", node, opts);
}

function assertAnyTypeAnnotation(node, opts) {
  assert("AnyTypeAnnotation", node, opts);
}

function assertArrayTypeAnnotation(node, opts) {
  assert("ArrayTypeAnnotation", node, opts);
}

function assertBooleanTypeAnnotation(node, opts) {
  assert("BooleanTypeAnnotation", node, opts);
}

function assertBooleanLiteralTypeAnnotation(node, opts) {
  assert("BooleanLiteralTypeAnnotation", node, opts);
}

function assertNullLiteralTypeAnnotation(node, opts) {
  assert("NullLiteralTypeAnnotation", node, opts);
}

function assertClassImplements(node, opts) {
  assert("ClassImplements", node, opts);
}

function assertDeclareClass(node, opts) {
  assert("DeclareClass", node, opts);
}

function assertDeclareFunction(node, opts) {
  assert("DeclareFunction", node, opts);
}

function assertDeclareInterface(node, opts) {
  assert("DeclareInterface", node, opts);
}

function assertDeclareModule(node, opts) {
  assert("DeclareModule", node, opts);
}

function assertDeclareModuleExports(node, opts) {
  assert("DeclareModuleExports", node, opts);
}

function assertDeclareTypeAlias(node, opts) {
  assert("DeclareTypeAlias", node, opts);
}

function assertDeclareOpaqueType(node, opts) {
  assert("DeclareOpaqueType", node, opts);
}

function assertDeclareVariable(node, opts) {
  assert("DeclareVariable", node, opts);
}

function assertDeclareExportDeclaration(node, opts) {
  assert("DeclareExportDeclaration", node, opts);
}

function assertDeclareExportAllDeclaration(node, opts) {
  assert("DeclareExportAllDeclaration", node, opts);
}

function assertDeclaredPredicate(node, opts) {
  assert("DeclaredPredicate", node, opts);
}

function assertExistsTypeAnnotation(node, opts) {
  assert("ExistsTypeAnnotation", node, opts);
}

function assertFunctionTypeAnnotation(node, opts) {
  assert("FunctionTypeAnnotation", node, opts);
}

function assertFunctionTypeParam(node, opts) {
  assert("FunctionTypeParam", node, opts);
}

function assertGenericTypeAnnotation(node, opts) {
  assert("GenericTypeAnnotation", node, opts);
}

function assertInferredPredicate(node, opts) {
  assert("InferredPredicate", node, opts);
}

function assertInterfaceExtends(node, opts) {
  assert("InterfaceExtends", node, opts);
}

function assertInterfaceDeclaration(node, opts) {
  assert("InterfaceDeclaration", node, opts);
}

function assertInterfaceTypeAnnotation(node, opts) {
  assert("InterfaceTypeAnnotation", node, opts);
}

function assertIntersectionTypeAnnotation(node, opts) {
  assert("IntersectionTypeAnnotation", node, opts);
}

function assertMixedTypeAnnotation(node, opts) {
  assert("MixedTypeAnnotation", node, opts);
}

function assertEmptyTypeAnnotation(node, opts) {
  assert("EmptyTypeAnnotation", node, opts);
}

function assertNullableTypeAnnotation(node, opts) {
  assert("NullableTypeAnnotation", node, opts);
}

function assertNumberLiteralTypeAnnotation(node, opts) {
  assert("NumberLiteralTypeAnnotation", node, opts);
}

function assertNumberTypeAnnotation(node, opts) {
  assert("NumberTypeAnnotation", node, opts);
}

function assertObjectTypeAnnotation(node, opts) {
  assert("ObjectTypeAnnotation", node, opts);
}

function assertObjectTypeInternalSlot(node, opts) {
  assert("ObjectTypeInternalSlot", node, opts);
}

function assertObjectTypeCallProperty(node, opts) {
  assert("ObjectTypeCallProperty", node, opts);
}

function assertObjectTypeIndexer(node, opts) {
  assert("ObjectTypeIndexer", node, opts);
}

function assertObjectTypeProperty(node, opts) {
  assert("ObjectTypeProperty", node, opts);
}

function assertObjectTypeSpreadProperty(node, opts) {
  assert("ObjectTypeSpreadProperty", node, opts);
}

function assertOpaqueType(node, opts) {
  assert("OpaqueType", node, opts);
}

function assertQualifiedTypeIdentifier(node, opts) {
  assert("QualifiedTypeIdentifier", node, opts);
}

function assertStringLiteralTypeAnnotation(node, opts) {
  assert("StringLiteralTypeAnnotation", node, opts);
}

function assertStringTypeAnnotation(node, opts) {
  assert("StringTypeAnnotation", node, opts);
}

function assertSymbolTypeAnnotation(node, opts) {
  assert("SymbolTypeAnnotation", node, opts);
}

function assertThisTypeAnnotation(node, opts) {
  assert("ThisTypeAnnotation", node, opts);
}

function assertTupleTypeAnnotation(node, opts) {
  assert("TupleTypeAnnotation", node, opts);
}

function assertTypeofTypeAnnotation(node, opts) {
  assert("TypeofTypeAnnotation", node, opts);
}

function assertTypeAlias(node, opts) {
  assert("TypeAlias", node, opts);
}

function assertTypeAnnotation(node, opts) {
  assert("TypeAnnotation", node, opts);
}

function assertTypeCastExpression(node, opts) {
  assert("TypeCastExpression", node, opts);
}

function assertTypeParameter(node, opts) {
  assert("TypeParameter", node, opts);
}

function assertTypeParameterDeclaration(node, opts) {
  assert("TypeParameterDeclaration", node, opts);
}

function assertTypeParameterInstantiation(node, opts) {
  assert("TypeParameterInstantiation", node, opts);
}

function assertUnionTypeAnnotation(node, opts) {
  assert("UnionTypeAnnotation", node, opts);
}

function assertVariance(node, opts) {
  assert("Variance", node, opts);
}

function assertVoidTypeAnnotation(node, opts) {
  assert("VoidTypeAnnotation", node, opts);
}

function assertEnumDeclaration(node, opts) {
  assert("EnumDeclaration", node, opts);
}

function assertEnumBooleanBody(node, opts) {
  assert("EnumBooleanBody", node, opts);
}

function assertEnumNumberBody(node, opts) {
  assert("EnumNumberBody", node, opts);
}

function assertEnumStringBody(node, opts) {
  assert("EnumStringBody", node, opts);
}

function assertEnumSymbolBody(node, opts) {
  assert("EnumSymbolBody", node, opts);
}

function assertEnumBooleanMember(node, opts) {
  assert("EnumBooleanMember", node, opts);
}

function assertEnumNumberMember(node, opts) {
  assert("EnumNumberMember", node, opts);
}

function assertEnumStringMember(node, opts) {
  assert("EnumStringMember", node, opts);
}

function assertEnumDefaultedMember(node, opts) {
  assert("EnumDefaultedMember", node, opts);
}

function assertIndexedAccessType(node, opts) {
  assert("IndexedAccessType", node, opts);
}

function assertOptionalIndexedAccessType(node, opts) {
  assert("OptionalIndexedAccessType", node, opts);
}

function assertJSXAttribute(node, opts) {
  assert("JSXAttribute", node, opts);
}

function assertJSXClosingElement(node, opts) {
  assert("JSXClosingElement", node, opts);
}

function assertJSXElement(node, opts) {
  assert("JSXElement", node, opts);
}

function assertJSXEmptyExpression(node, opts) {
  assert("JSXEmptyExpression", node, opts);
}

function assertJSXExpressionContainer(node, opts) {
  assert("JSXExpressionContainer", node, opts);
}

function assertJSXSpreadChild(node, opts) {
  assert("JSXSpreadChild", node, opts);
}

function assertJSXIdentifier(node, opts) {
  assert("JSXIdentifier", node, opts);
}

function assertJSXMemberExpression(node, opts) {
  assert("JSXMemberExpression", node, opts);
}

function assertJSXNamespacedName(node, opts) {
  assert("JSXNamespacedName", node, opts);
}

function assertJSXOpeningElement(node, opts) {
  assert("JSXOpeningElement", node, opts);
}

function assertJSXSpreadAttribute(node, opts) {
  assert("JSXSpreadAttribute", node, opts);
}

function assertJSXText(node, opts) {
  assert("JSXText", node, opts);
}

function assertJSXFragment(node, opts) {
  assert("JSXFragment", node, opts);
}

function assertJSXOpeningFragment(node, opts) {
  assert("JSXOpeningFragment", node, opts);
}

function assertJSXClosingFragment(node, opts) {
  assert("JSXClosingFragment", node, opts);
}

function assertNoop(node, opts) {
  assert("Noop", node, opts);
}

function assertPlaceholder(node, opts) {
  assert("Placeholder", node, opts);
}

function assertV8IntrinsicIdentifier(node, opts) {
  assert("V8IntrinsicIdentifier", node, opts);
}

function assertArgumentPlaceholder(node, opts) {
  assert("ArgumentPlaceholder", node, opts);
}

function assertBindExpression(node, opts) {
  assert("BindExpression", node, opts);
}

function assertImportAttribute(node, opts) {
  assert("ImportAttribute", node, opts);
}

function assertDecorator(node, opts) {
  assert("Decorator", node, opts);
}

function assertDoExpression(node, opts) {
  assert("DoExpression", node, opts);
}

function assertExportDefaultSpecifier(node, opts) {
  assert("ExportDefaultSpecifier", node, opts);
}

function assertRecordExpression(node, opts) {
  assert("RecordExpression", node, opts);
}

function assertTupleExpression(node, opts) {
  assert("TupleExpression", node, opts);
}

function assertDecimalLiteral(node, opts) {
  assert("DecimalLiteral", node, opts);
}

function assertModuleExpression(node, opts) {
  assert("ModuleExpression", node, opts);
}

function assertTopicReference(node, opts) {
  assert("TopicReference", node, opts);
}

function assertPipelineTopicExpression(node, opts) {
  assert("PipelineTopicExpression", node, opts);
}

function assertPipelineBareFunction(node, opts) {
  assert("PipelineBareFunction", node, opts);
}

function assertPipelinePrimaryTopicReference(node, opts) {
  assert("PipelinePrimaryTopicReference", node, opts);
}

function assertTSParameterProperty(node, opts) {
  assert("TSParameterProperty", node, opts);
}

function assertTSDeclareFunction(node, opts) {
  assert("TSDeclareFunction", node, opts);
}

function assertTSDeclareMethod(node, opts) {
  assert("TSDeclareMethod", node, opts);
}

function assertTSQualifiedName(node, opts) {
  assert("TSQualifiedName", node, opts);
}

function assertTSCallSignatureDeclaration(node, opts) {
  assert("TSCallSignatureDeclaration", node, opts);
}

function assertTSConstructSignatureDeclaration(node, opts) {
  assert("TSConstructSignatureDeclaration", node, opts);
}

function assertTSPropertySignature(node, opts) {
  assert("TSPropertySignature", node, opts);
}

function assertTSMethodSignature(node, opts) {
  assert("TSMethodSignature", node, opts);
}

function assertTSIndexSignature(node, opts) {
  assert("TSIndexSignature", node, opts);
}

function assertTSAnyKeyword(node, opts) {
  assert("TSAnyKeyword", node, opts);
}

function assertTSBooleanKeyword(node, opts) {
  assert("TSBooleanKeyword", node, opts);
}

function assertTSBigIntKeyword(node, opts) {
  assert("TSBigIntKeyword", node, opts);
}

function assertTSIntrinsicKeyword(node, opts) {
  assert("TSIntrinsicKeyword", node, opts);
}

function assertTSNeverKeyword(node, opts) {
  assert("TSNeverKeyword", node, opts);
}

function assertTSNullKeyword(node, opts) {
  assert("TSNullKeyword", node, opts);
}

function assertTSNumberKeyword(node, opts) {
  assert("TSNumberKeyword", node, opts);
}

function assertTSObjectKeyword(node, opts) {
  assert("TSObjectKeyword", node, opts);
}

function assertTSStringKeyword(node, opts) {
  assert("TSStringKeyword", node, opts);
}

function assertTSSymbolKeyword(node, opts) {
  assert("TSSymbolKeyword", node, opts);
}

function assertTSUndefinedKeyword(node, opts) {
  assert("TSUndefinedKeyword", node, opts);
}

function assertTSUnknownKeyword(node, opts) {
  assert("TSUnknownKeyword", node, opts);
}

function assertTSVoidKeyword(node, opts) {
  assert("TSVoidKeyword", node, opts);
}

function assertTSThisType(node, opts) {
  assert("TSThisType", node, opts);
}

function assertTSFunctionType(node, opts) {
  assert("TSFunctionType", node, opts);
}

function assertTSConstructorType(node, opts) {
  assert("TSConstructorType", node, opts);
}

function assertTSTypeReference(node, opts) {
  assert("TSTypeReference", node, opts);
}

function assertTSTypePredicate(node, opts) {
  assert("TSTypePredicate", node, opts);
}

function assertTSTypeQuery(node, opts) {
  assert("TSTypeQuery", node, opts);
}

function assertTSTypeLiteral(node, opts) {
  assert("TSTypeLiteral", node, opts);
}

function assertTSArrayType(node, opts) {
  assert("TSArrayType", node, opts);
}

function assertTSTupleType(node, opts) {
  assert("TSTupleType", node, opts);
}

function assertTSOptionalType(node, opts) {
  assert("TSOptionalType", node, opts);
}

function assertTSRestType(node, opts) {
  assert("TSRestType", node, opts);
}

function assertTSNamedTupleMember(node, opts) {
  assert("TSNamedTupleMember", node, opts);
}

function assertTSUnionType(node, opts) {
  assert("TSUnionType", node, opts);
}

function assertTSIntersectionType(node, opts) {
  assert("TSIntersectionType", node, opts);
}

function assertTSConditionalType(node, opts) {
  assert("TSConditionalType", node, opts);
}

function assertTSInferType(node, opts) {
  assert("TSInferType", node, opts);
}

function assertTSParenthesizedType(node, opts) {
  assert("TSParenthesizedType", node, opts);
}

function assertTSTypeOperator(node, opts) {
  assert("TSTypeOperator", node, opts);
}

function assertTSIndexedAccessType(node, opts) {
  assert("TSIndexedAccessType", node, opts);
}

function assertTSMappedType(node, opts) {
  assert("TSMappedType", node, opts);
}

function assertTSLiteralType(node, opts) {
  assert("TSLiteralType", node, opts);
}

function assertTSExpressionWithTypeArguments(node, opts) {
  assert("TSExpressionWithTypeArguments", node, opts);
}

function assertTSInterfaceDeclaration(node, opts) {
  assert("TSInterfaceDeclaration", node, opts);
}

function assertTSInterfaceBody(node, opts) {
  assert("TSInterfaceBody", node, opts);
}

function assertTSTypeAliasDeclaration(node, opts) {
  assert("TSTypeAliasDeclaration", node, opts);
}

function assertTSInstantiationExpression(node, opts) {
  assert("TSInstantiationExpression", node, opts);
}

function assertTSAsExpression(node, opts) {
  assert("TSAsExpression", node, opts);
}

function assertTSTypeAssertion(node, opts) {
  assert("TSTypeAssertion", node, opts);
}

function assertTSEnumDeclaration(node, opts) {
  assert("TSEnumDeclaration", node, opts);
}

function assertTSEnumMember(node, opts) {
  assert("TSEnumMember", node, opts);
}

function assertTSModuleDeclaration(node, opts) {
  assert("TSModuleDeclaration", node, opts);
}

function assertTSModuleBlock(node, opts) {
  assert("TSModuleBlock", node, opts);
}

function assertTSImportType(node, opts) {
  assert("TSImportType", node, opts);
}

function assertTSImportEqualsDeclaration(node, opts) {
  assert("TSImportEqualsDeclaration", node, opts);
}

function assertTSExternalModuleReference(node, opts) {
  assert("TSExternalModuleReference", node, opts);
}

function assertTSNonNullExpression(node, opts) {
  assert("TSNonNullExpression", node, opts);
}

function assertTSExportAssignment(node, opts) {
  assert("TSExportAssignment", node, opts);
}

function assertTSNamespaceExportDeclaration(node, opts) {
  assert("TSNamespaceExportDeclaration", node, opts);
}

function assertTSTypeAnnotation(node, opts) {
  assert("TSTypeAnnotation", node, opts);
}

function assertTSTypeParameterInstantiation(node, opts) {
  assert("TSTypeParameterInstantiation", node, opts);
}

function assertTSTypeParameterDeclaration(node, opts) {
  assert("TSTypeParameterDeclaration", node, opts);
}

function assertTSTypeParameter(node, opts) {
  assert("TSTypeParameter", node, opts);
}

function assertStandardized(node, opts) {
  assert("Standardized", node, opts);
}

function assertExpression(node, opts) {
  assert("Expression", node, opts);
}

function assertBinary(node, opts) {
  assert("Binary", node, opts);
}

function assertScopable(node, opts) {
  assert("Scopable", node, opts);
}

function assertBlockParent(node, opts) {
  assert("BlockParent", node, opts);
}

function assertBlock(node, opts) {
  assert("Block", node, opts);
}

function assertStatement(node, opts) {
  assert("Statement", node, opts);
}

function assertTerminatorless(node, opts) {
  assert("Terminatorless", node, opts);
}

function assertCompletionStatement(node, opts) {
  assert("CompletionStatement", node, opts);
}

function assertConditional(node, opts) {
  assert("Conditional", node, opts);
}

function assertLoop(node, opts) {
  assert("Loop", node, opts);
}

function assertWhile(node, opts) {
  assert("While", node, opts);
}

function assertExpressionWrapper(node, opts) {
  assert("ExpressionWrapper", node, opts);
}

function assertFor(node, opts) {
  assert("For", node, opts);
}

function assertForXStatement(node, opts) {
  assert("ForXStatement", node, opts);
}

function assertFunction(node, opts) {
  assert("Function", node, opts);
}

function assertFunctionParent(node, opts) {
  assert("FunctionParent", node, opts);
}

function assertPureish(node, opts) {
  assert("Pureish", node, opts);
}

function assertDeclaration(node, opts) {
  assert("Declaration", node, opts);
}

function assertPatternLike(node, opts) {
  assert("PatternLike", node, opts);
}

function assertLVal(node, opts) {
  assert("LVal", node, opts);
}

function assertTSEntityName(node, opts) {
  assert("TSEntityName", node, opts);
}

function assertLiteral(node, opts) {
  assert("Literal", node, opts);
}

function assertImmutable(node, opts) {
  assert("Immutable", node, opts);
}

function assertUserWhitespacable(node, opts) {
  assert("UserWhitespacable", node, opts);
}

function assertMethod(node, opts) {
  assert("Method", node, opts);
}

function assertObjectMember(node, opts) {
  assert("ObjectMember", node, opts);
}

function assertProperty(node, opts) {
  assert("Property", node, opts);
}

function assertUnaryLike(node, opts) {
  assert("UnaryLike", node, opts);
}

function assertPattern(node, opts) {
  assert("Pattern", node, opts);
}

function assertClass(node, opts) {
  assert("Class", node, opts);
}

function assertModuleDeclaration(node, opts) {
  assert("ModuleDeclaration", node, opts);
}

function assertExportDeclaration(node, opts) {
  assert("ExportDeclaration", node, opts);
}

function assertModuleSpecifier(node, opts) {
  assert("ModuleSpecifier", node, opts);
}

function assertAccessor(node, opts) {
  assert("Accessor", node, opts);
}

function assertPrivate(node, opts) {
  assert("Private", node, opts);
}

function assertFlow(node, opts) {
  assert("Flow", node, opts);
}

function assertFlowType(node, opts) {
  assert("FlowType", node, opts);
}

function assertFlowBaseAnnotation(node, opts) {
  assert("FlowBaseAnnotation", node, opts);
}

function assertFlowDeclaration(node, opts) {
  assert("FlowDeclaration", node, opts);
}

function assertFlowPredicate(node, opts) {
  assert("FlowPredicate", node, opts);
}

function assertEnumBody(node, opts) {
  assert("EnumBody", node, opts);
}

function assertEnumMember(node, opts) {
  assert("EnumMember", node, opts);
}

function assertJSX(node, opts) {
  assert("JSX", node, opts);
}

function assertMiscellaneous(node, opts) {
  assert("Miscellaneous", node, opts);
}

function assertTypeScript(node, opts) {
  assert("TypeScript", node, opts);
}

function assertTSTypeElement(node, opts) {
  assert("TSTypeElement", node, opts);
}

function assertTSType(node, opts) {
  assert("TSType", node, opts);
}

function assertTSBaseType(node, opts) {
  assert("TSBaseType", node, opts);
}

function assertNumberLiteral(node, opts) {
  console.trace("The node type NumberLiteral has been renamed to NumericLiteral");
  assert("NumberLiteral", node, opts);
}

function assertRegexLiteral(node, opts) {
  console.trace("The node type RegexLiteral has been renamed to RegExpLiteral");
  assert("RegexLiteral", node, opts);
}

function assertRestProperty(node, opts) {
  console.trace("The node type RestProperty has been renamed to RestElement");
  assert("RestProperty", node, opts);
}

function assertSpreadProperty(node, opts) {
  console.trace("The node type SpreadProperty has been renamed to SpreadElement");
  assert("SpreadProperty", node, opts);
}

/***/ }),
/* 80 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _generated = __webpack_require__(55);

var _default = createTypeAnnotationBasedOnTypeof;
exports["default"] = _default;

function createTypeAnnotationBasedOnTypeof(type) {
  switch (type) {
    case "string":
      return (0, _generated.stringTypeAnnotation)();

    case "number":
      return (0, _generated.numberTypeAnnotation)();

    case "undefined":
      return (0, _generated.voidTypeAnnotation)();

    case "boolean":
      return (0, _generated.booleanTypeAnnotation)();

    case "function":
      return (0, _generated.genericTypeAnnotation)((0, _generated.identifier)("Function"));

    case "object":
      return (0, _generated.genericTypeAnnotation)((0, _generated.identifier)("Object"));

    case "symbol":
      return (0, _generated.genericTypeAnnotation)((0, _generated.identifier)("Symbol"));

    case "bigint":
      return (0, _generated.anyTypeAnnotation)();
  }

  throw new Error("Invalid typeof value: " + type);
}

/***/ }),
/* 81 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = createFlowUnionType;

var _generated = __webpack_require__(55);

var _removeTypeDuplicates = __webpack_require__(82);

function createFlowUnionType(types) {
  const flattened = (0, _removeTypeDuplicates.default)(types);

  if (flattened.length === 1) {
    return flattened[0];
  } else {
    return (0, _generated.unionTypeAnnotation)(flattened);
  }
}

/***/ }),
/* 82 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = removeTypeDuplicates;

var _generated = __webpack_require__(50);

function getQualifiedName(node) {
  return (0, _generated.isIdentifier)(node) ? node.name : `${node.id.name}.${getQualifiedName(node.qualification)}`;
}

function removeTypeDuplicates(nodes) {
  const generics = new Map();
  const bases = new Map();
  const typeGroups = new Set();
  const types = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node) continue;

    if (types.indexOf(node) >= 0) {
      continue;
    }

    if ((0, _generated.isAnyTypeAnnotation)(node)) {
      return [node];
    }

    if ((0, _generated.isFlowBaseAnnotation)(node)) {
      bases.set(node.type, node);
      continue;
    }

    if ((0, _generated.isUnionTypeAnnotation)(node)) {
      if (!typeGroups.has(node.types)) {
        nodes = nodes.concat(node.types);
        typeGroups.add(node.types);
      }

      continue;
    }

    if ((0, _generated.isGenericTypeAnnotation)(node)) {
      const name = getQualifiedName(node.id);

      if (generics.has(name)) {
        let existing = generics.get(name);

        if (existing.typeParameters) {
          if (node.typeParameters) {
            existing.typeParameters.params = removeTypeDuplicates(existing.typeParameters.params.concat(node.typeParameters.params));
          }
        } else {
          existing = node.typeParameters;
        }
      } else {
        generics.set(name, node);
      }

      continue;
    }

    types.push(node);
  }

  for (const [, baseType] of bases) {
    types.push(baseType);
  }

  for (const [, genericName] of generics) {
    types.push(genericName);
  }

  return types;
}

/***/ }),
/* 83 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = createTSUnionType;

var _generated = __webpack_require__(55);

var _removeTypeDuplicates = __webpack_require__(84);

var _index = __webpack_require__(50);

function createTSUnionType(typeAnnotations) {
  const types = typeAnnotations.map(type => {
    return (0, _index.isTSTypeAnnotation)(type) ? type.typeAnnotation : type;
  });
  const flattened = (0, _removeTypeDuplicates.default)(types);

  if (flattened.length === 1) {
    return flattened[0];
  } else {
    return (0, _generated.tsUnionType)(flattened);
  }
}

/***/ }),
/* 84 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = removeTypeDuplicates;

var _generated = __webpack_require__(50);

function getQualifiedName(node) {
  return (0, _generated.isIdentifier)(node) ? node.name : `${node.right.name}.${getQualifiedName(node.left)}`;
}

function removeTypeDuplicates(nodes) {
  const generics = new Map();
  const bases = new Map();
  const typeGroups = new Set();
  const types = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node) continue;

    if (types.indexOf(node) >= 0) {
      continue;
    }

    if ((0, _generated.isTSAnyKeyword)(node)) {
      return [node];
    }

    if ((0, _generated.isTSBaseType)(node)) {
      bases.set(node.type, node);
      continue;
    }

    if ((0, _generated.isTSUnionType)(node)) {
      if (!typeGroups.has(node.types)) {
        nodes.push(...node.types);
        typeGroups.add(node.types);
      }

      continue;
    }

    if ((0, _generated.isTSTypeReference)(node) && node.typeParameters) {
      const name = getQualifiedName(node.typeName);

      if (generics.has(name)) {
        let existing = generics.get(name);

        if (existing.typeParameters) {
          if (node.typeParameters) {
            existing.typeParameters.params = removeTypeDuplicates(existing.typeParameters.params.concat(node.typeParameters.params));
          }
        } else {
          existing = node.typeParameters;
        }
      } else {
        generics.set(name, node);
      }

      continue;
    }

    types.push(node);
  }

  for (const [, baseType] of bases) {
    types.push(baseType);
  }

  for (const [, genericName] of generics) {
    types.push(genericName);
  }

  return types;
}

/***/ }),
/* 85 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "AnyTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.anyTypeAnnotation;
  }
}));
Object.defineProperty(exports, "ArgumentPlaceholder", ({
  enumerable: true,
  get: function () {
    return _index.argumentPlaceholder;
  }
}));
Object.defineProperty(exports, "ArrayExpression", ({
  enumerable: true,
  get: function () {
    return _index.arrayExpression;
  }
}));
Object.defineProperty(exports, "ArrayPattern", ({
  enumerable: true,
  get: function () {
    return _index.arrayPattern;
  }
}));
Object.defineProperty(exports, "ArrayTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.arrayTypeAnnotation;
  }
}));
Object.defineProperty(exports, "ArrowFunctionExpression", ({
  enumerable: true,
  get: function () {
    return _index.arrowFunctionExpression;
  }
}));
Object.defineProperty(exports, "AssignmentExpression", ({
  enumerable: true,
  get: function () {
    return _index.assignmentExpression;
  }
}));
Object.defineProperty(exports, "AssignmentPattern", ({
  enumerable: true,
  get: function () {
    return _index.assignmentPattern;
  }
}));
Object.defineProperty(exports, "AwaitExpression", ({
  enumerable: true,
  get: function () {
    return _index.awaitExpression;
  }
}));
Object.defineProperty(exports, "BigIntLiteral", ({
  enumerable: true,
  get: function () {
    return _index.bigIntLiteral;
  }
}));
Object.defineProperty(exports, "BinaryExpression", ({
  enumerable: true,
  get: function () {
    return _index.binaryExpression;
  }
}));
Object.defineProperty(exports, "BindExpression", ({
  enumerable: true,
  get: function () {
    return _index.bindExpression;
  }
}));
Object.defineProperty(exports, "BlockStatement", ({
  enumerable: true,
  get: function () {
    return _index.blockStatement;
  }
}));
Object.defineProperty(exports, "BooleanLiteral", ({
  enumerable: true,
  get: function () {
    return _index.booleanLiteral;
  }
}));
Object.defineProperty(exports, "BooleanLiteralTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.booleanLiteralTypeAnnotation;
  }
}));
Object.defineProperty(exports, "BooleanTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.booleanTypeAnnotation;
  }
}));
Object.defineProperty(exports, "BreakStatement", ({
  enumerable: true,
  get: function () {
    return _index.breakStatement;
  }
}));
Object.defineProperty(exports, "CallExpression", ({
  enumerable: true,
  get: function () {
    return _index.callExpression;
  }
}));
Object.defineProperty(exports, "CatchClause", ({
  enumerable: true,
  get: function () {
    return _index.catchClause;
  }
}));
Object.defineProperty(exports, "ClassAccessorProperty", ({
  enumerable: true,
  get: function () {
    return _index.classAccessorProperty;
  }
}));
Object.defineProperty(exports, "ClassBody", ({
  enumerable: true,
  get: function () {
    return _index.classBody;
  }
}));
Object.defineProperty(exports, "ClassDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.classDeclaration;
  }
}));
Object.defineProperty(exports, "ClassExpression", ({
  enumerable: true,
  get: function () {
    return _index.classExpression;
  }
}));
Object.defineProperty(exports, "ClassImplements", ({
  enumerable: true,
  get: function () {
    return _index.classImplements;
  }
}));
Object.defineProperty(exports, "ClassMethod", ({
  enumerable: true,
  get: function () {
    return _index.classMethod;
  }
}));
Object.defineProperty(exports, "ClassPrivateMethod", ({
  enumerable: true,
  get: function () {
    return _index.classPrivateMethod;
  }
}));
Object.defineProperty(exports, "ClassPrivateProperty", ({
  enumerable: true,
  get: function () {
    return _index.classPrivateProperty;
  }
}));
Object.defineProperty(exports, "ClassProperty", ({
  enumerable: true,
  get: function () {
    return _index.classProperty;
  }
}));
Object.defineProperty(exports, "ConditionalExpression", ({
  enumerable: true,
  get: function () {
    return _index.conditionalExpression;
  }
}));
Object.defineProperty(exports, "ContinueStatement", ({
  enumerable: true,
  get: function () {
    return _index.continueStatement;
  }
}));
Object.defineProperty(exports, "DebuggerStatement", ({
  enumerable: true,
  get: function () {
    return _index.debuggerStatement;
  }
}));
Object.defineProperty(exports, "DecimalLiteral", ({
  enumerable: true,
  get: function () {
    return _index.decimalLiteral;
  }
}));
Object.defineProperty(exports, "DeclareClass", ({
  enumerable: true,
  get: function () {
    return _index.declareClass;
  }
}));
Object.defineProperty(exports, "DeclareExportAllDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.declareExportAllDeclaration;
  }
}));
Object.defineProperty(exports, "DeclareExportDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.declareExportDeclaration;
  }
}));
Object.defineProperty(exports, "DeclareFunction", ({
  enumerable: true,
  get: function () {
    return _index.declareFunction;
  }
}));
Object.defineProperty(exports, "DeclareInterface", ({
  enumerable: true,
  get: function () {
    return _index.declareInterface;
  }
}));
Object.defineProperty(exports, "DeclareModule", ({
  enumerable: true,
  get: function () {
    return _index.declareModule;
  }
}));
Object.defineProperty(exports, "DeclareModuleExports", ({
  enumerable: true,
  get: function () {
    return _index.declareModuleExports;
  }
}));
Object.defineProperty(exports, "DeclareOpaqueType", ({
  enumerable: true,
  get: function () {
    return _index.declareOpaqueType;
  }
}));
Object.defineProperty(exports, "DeclareTypeAlias", ({
  enumerable: true,
  get: function () {
    return _index.declareTypeAlias;
  }
}));
Object.defineProperty(exports, "DeclareVariable", ({
  enumerable: true,
  get: function () {
    return _index.declareVariable;
  }
}));
Object.defineProperty(exports, "DeclaredPredicate", ({
  enumerable: true,
  get: function () {
    return _index.declaredPredicate;
  }
}));
Object.defineProperty(exports, "Decorator", ({
  enumerable: true,
  get: function () {
    return _index.decorator;
  }
}));
Object.defineProperty(exports, "Directive", ({
  enumerable: true,
  get: function () {
    return _index.directive;
  }
}));
Object.defineProperty(exports, "DirectiveLiteral", ({
  enumerable: true,
  get: function () {
    return _index.directiveLiteral;
  }
}));
Object.defineProperty(exports, "DoExpression", ({
  enumerable: true,
  get: function () {
    return _index.doExpression;
  }
}));
Object.defineProperty(exports, "DoWhileStatement", ({
  enumerable: true,
  get: function () {
    return _index.doWhileStatement;
  }
}));
Object.defineProperty(exports, "EmptyStatement", ({
  enumerable: true,
  get: function () {
    return _index.emptyStatement;
  }
}));
Object.defineProperty(exports, "EmptyTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.emptyTypeAnnotation;
  }
}));
Object.defineProperty(exports, "EnumBooleanBody", ({
  enumerable: true,
  get: function () {
    return _index.enumBooleanBody;
  }
}));
Object.defineProperty(exports, "EnumBooleanMember", ({
  enumerable: true,
  get: function () {
    return _index.enumBooleanMember;
  }
}));
Object.defineProperty(exports, "EnumDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.enumDeclaration;
  }
}));
Object.defineProperty(exports, "EnumDefaultedMember", ({
  enumerable: true,
  get: function () {
    return _index.enumDefaultedMember;
  }
}));
Object.defineProperty(exports, "EnumNumberBody", ({
  enumerable: true,
  get: function () {
    return _index.enumNumberBody;
  }
}));
Object.defineProperty(exports, "EnumNumberMember", ({
  enumerable: true,
  get: function () {
    return _index.enumNumberMember;
  }
}));
Object.defineProperty(exports, "EnumStringBody", ({
  enumerable: true,
  get: function () {
    return _index.enumStringBody;
  }
}));
Object.defineProperty(exports, "EnumStringMember", ({
  enumerable: true,
  get: function () {
    return _index.enumStringMember;
  }
}));
Object.defineProperty(exports, "EnumSymbolBody", ({
  enumerable: true,
  get: function () {
    return _index.enumSymbolBody;
  }
}));
Object.defineProperty(exports, "ExistsTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.existsTypeAnnotation;
  }
}));
Object.defineProperty(exports, "ExportAllDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.exportAllDeclaration;
  }
}));
Object.defineProperty(exports, "ExportDefaultDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.exportDefaultDeclaration;
  }
}));
Object.defineProperty(exports, "ExportDefaultSpecifier", ({
  enumerable: true,
  get: function () {
    return _index.exportDefaultSpecifier;
  }
}));
Object.defineProperty(exports, "ExportNamedDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.exportNamedDeclaration;
  }
}));
Object.defineProperty(exports, "ExportNamespaceSpecifier", ({
  enumerable: true,
  get: function () {
    return _index.exportNamespaceSpecifier;
  }
}));
Object.defineProperty(exports, "ExportSpecifier", ({
  enumerable: true,
  get: function () {
    return _index.exportSpecifier;
  }
}));
Object.defineProperty(exports, "ExpressionStatement", ({
  enumerable: true,
  get: function () {
    return _index.expressionStatement;
  }
}));
Object.defineProperty(exports, "File", ({
  enumerable: true,
  get: function () {
    return _index.file;
  }
}));
Object.defineProperty(exports, "ForInStatement", ({
  enumerable: true,
  get: function () {
    return _index.forInStatement;
  }
}));
Object.defineProperty(exports, "ForOfStatement", ({
  enumerable: true,
  get: function () {
    return _index.forOfStatement;
  }
}));
Object.defineProperty(exports, "ForStatement", ({
  enumerable: true,
  get: function () {
    return _index.forStatement;
  }
}));
Object.defineProperty(exports, "FunctionDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.functionDeclaration;
  }
}));
Object.defineProperty(exports, "FunctionExpression", ({
  enumerable: true,
  get: function () {
    return _index.functionExpression;
  }
}));
Object.defineProperty(exports, "FunctionTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.functionTypeAnnotation;
  }
}));
Object.defineProperty(exports, "FunctionTypeParam", ({
  enumerable: true,
  get: function () {
    return _index.functionTypeParam;
  }
}));
Object.defineProperty(exports, "GenericTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.genericTypeAnnotation;
  }
}));
Object.defineProperty(exports, "Identifier", ({
  enumerable: true,
  get: function () {
    return _index.identifier;
  }
}));
Object.defineProperty(exports, "IfStatement", ({
  enumerable: true,
  get: function () {
    return _index.ifStatement;
  }
}));
Object.defineProperty(exports, "Import", ({
  enumerable: true,
  get: function () {
    return _index.import;
  }
}));
Object.defineProperty(exports, "ImportAttribute", ({
  enumerable: true,
  get: function () {
    return _index.importAttribute;
  }
}));
Object.defineProperty(exports, "ImportDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.importDeclaration;
  }
}));
Object.defineProperty(exports, "ImportDefaultSpecifier", ({
  enumerable: true,
  get: function () {
    return _index.importDefaultSpecifier;
  }
}));
Object.defineProperty(exports, "ImportNamespaceSpecifier", ({
  enumerable: true,
  get: function () {
    return _index.importNamespaceSpecifier;
  }
}));
Object.defineProperty(exports, "ImportSpecifier", ({
  enumerable: true,
  get: function () {
    return _index.importSpecifier;
  }
}));
Object.defineProperty(exports, "IndexedAccessType", ({
  enumerable: true,
  get: function () {
    return _index.indexedAccessType;
  }
}));
Object.defineProperty(exports, "InferredPredicate", ({
  enumerable: true,
  get: function () {
    return _index.inferredPredicate;
  }
}));
Object.defineProperty(exports, "InterfaceDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.interfaceDeclaration;
  }
}));
Object.defineProperty(exports, "InterfaceExtends", ({
  enumerable: true,
  get: function () {
    return _index.interfaceExtends;
  }
}));
Object.defineProperty(exports, "InterfaceTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.interfaceTypeAnnotation;
  }
}));
Object.defineProperty(exports, "InterpreterDirective", ({
  enumerable: true,
  get: function () {
    return _index.interpreterDirective;
  }
}));
Object.defineProperty(exports, "IntersectionTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.intersectionTypeAnnotation;
  }
}));
Object.defineProperty(exports, "JSXAttribute", ({
  enumerable: true,
  get: function () {
    return _index.jsxAttribute;
  }
}));
Object.defineProperty(exports, "JSXClosingElement", ({
  enumerable: true,
  get: function () {
    return _index.jsxClosingElement;
  }
}));
Object.defineProperty(exports, "JSXClosingFragment", ({
  enumerable: true,
  get: function () {
    return _index.jsxClosingFragment;
  }
}));
Object.defineProperty(exports, "JSXElement", ({
  enumerable: true,
  get: function () {
    return _index.jsxElement;
  }
}));
Object.defineProperty(exports, "JSXEmptyExpression", ({
  enumerable: true,
  get: function () {
    return _index.jsxEmptyExpression;
  }
}));
Object.defineProperty(exports, "JSXExpressionContainer", ({
  enumerable: true,
  get: function () {
    return _index.jsxExpressionContainer;
  }
}));
Object.defineProperty(exports, "JSXFragment", ({
  enumerable: true,
  get: function () {
    return _index.jsxFragment;
  }
}));
Object.defineProperty(exports, "JSXIdentifier", ({
  enumerable: true,
  get: function () {
    return _index.jsxIdentifier;
  }
}));
Object.defineProperty(exports, "JSXMemberExpression", ({
  enumerable: true,
  get: function () {
    return _index.jsxMemberExpression;
  }
}));
Object.defineProperty(exports, "JSXNamespacedName", ({
  enumerable: true,
  get: function () {
    return _index.jsxNamespacedName;
  }
}));
Object.defineProperty(exports, "JSXOpeningElement", ({
  enumerable: true,
  get: function () {
    return _index.jsxOpeningElement;
  }
}));
Object.defineProperty(exports, "JSXOpeningFragment", ({
  enumerable: true,
  get: function () {
    return _index.jsxOpeningFragment;
  }
}));
Object.defineProperty(exports, "JSXSpreadAttribute", ({
  enumerable: true,
  get: function () {
    return _index.jsxSpreadAttribute;
  }
}));
Object.defineProperty(exports, "JSXSpreadChild", ({
  enumerable: true,
  get: function () {
    return _index.jsxSpreadChild;
  }
}));
Object.defineProperty(exports, "JSXText", ({
  enumerable: true,
  get: function () {
    return _index.jsxText;
  }
}));
Object.defineProperty(exports, "LabeledStatement", ({
  enumerable: true,
  get: function () {
    return _index.labeledStatement;
  }
}));
Object.defineProperty(exports, "LogicalExpression", ({
  enumerable: true,
  get: function () {
    return _index.logicalExpression;
  }
}));
Object.defineProperty(exports, "MemberExpression", ({
  enumerable: true,
  get: function () {
    return _index.memberExpression;
  }
}));
Object.defineProperty(exports, "MetaProperty", ({
  enumerable: true,
  get: function () {
    return _index.metaProperty;
  }
}));
Object.defineProperty(exports, "MixedTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.mixedTypeAnnotation;
  }
}));
Object.defineProperty(exports, "ModuleExpression", ({
  enumerable: true,
  get: function () {
    return _index.moduleExpression;
  }
}));
Object.defineProperty(exports, "NewExpression", ({
  enumerable: true,
  get: function () {
    return _index.newExpression;
  }
}));
Object.defineProperty(exports, "Noop", ({
  enumerable: true,
  get: function () {
    return _index.noop;
  }
}));
Object.defineProperty(exports, "NullLiteral", ({
  enumerable: true,
  get: function () {
    return _index.nullLiteral;
  }
}));
Object.defineProperty(exports, "NullLiteralTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.nullLiteralTypeAnnotation;
  }
}));
Object.defineProperty(exports, "NullableTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.nullableTypeAnnotation;
  }
}));
Object.defineProperty(exports, "NumberLiteral", ({
  enumerable: true,
  get: function () {
    return _index.numberLiteral;
  }
}));
Object.defineProperty(exports, "NumberLiteralTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.numberLiteralTypeAnnotation;
  }
}));
Object.defineProperty(exports, "NumberTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.numberTypeAnnotation;
  }
}));
Object.defineProperty(exports, "NumericLiteral", ({
  enumerable: true,
  get: function () {
    return _index.numericLiteral;
  }
}));
Object.defineProperty(exports, "ObjectExpression", ({
  enumerable: true,
  get: function () {
    return _index.objectExpression;
  }
}));
Object.defineProperty(exports, "ObjectMethod", ({
  enumerable: true,
  get: function () {
    return _index.objectMethod;
  }
}));
Object.defineProperty(exports, "ObjectPattern", ({
  enumerable: true,
  get: function () {
    return _index.objectPattern;
  }
}));
Object.defineProperty(exports, "ObjectProperty", ({
  enumerable: true,
  get: function () {
    return _index.objectProperty;
  }
}));
Object.defineProperty(exports, "ObjectTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.objectTypeAnnotation;
  }
}));
Object.defineProperty(exports, "ObjectTypeCallProperty", ({
  enumerable: true,
  get: function () {
    return _index.objectTypeCallProperty;
  }
}));
Object.defineProperty(exports, "ObjectTypeIndexer", ({
  enumerable: true,
  get: function () {
    return _index.objectTypeIndexer;
  }
}));
Object.defineProperty(exports, "ObjectTypeInternalSlot", ({
  enumerable: true,
  get: function () {
    return _index.objectTypeInternalSlot;
  }
}));
Object.defineProperty(exports, "ObjectTypeProperty", ({
  enumerable: true,
  get: function () {
    return _index.objectTypeProperty;
  }
}));
Object.defineProperty(exports, "ObjectTypeSpreadProperty", ({
  enumerable: true,
  get: function () {
    return _index.objectTypeSpreadProperty;
  }
}));
Object.defineProperty(exports, "OpaqueType", ({
  enumerable: true,
  get: function () {
    return _index.opaqueType;
  }
}));
Object.defineProperty(exports, "OptionalCallExpression", ({
  enumerable: true,
  get: function () {
    return _index.optionalCallExpression;
  }
}));
Object.defineProperty(exports, "OptionalIndexedAccessType", ({
  enumerable: true,
  get: function () {
    return _index.optionalIndexedAccessType;
  }
}));
Object.defineProperty(exports, "OptionalMemberExpression", ({
  enumerable: true,
  get: function () {
    return _index.optionalMemberExpression;
  }
}));
Object.defineProperty(exports, "ParenthesizedExpression", ({
  enumerable: true,
  get: function () {
    return _index.parenthesizedExpression;
  }
}));
Object.defineProperty(exports, "PipelineBareFunction", ({
  enumerable: true,
  get: function () {
    return _index.pipelineBareFunction;
  }
}));
Object.defineProperty(exports, "PipelinePrimaryTopicReference", ({
  enumerable: true,
  get: function () {
    return _index.pipelinePrimaryTopicReference;
  }
}));
Object.defineProperty(exports, "PipelineTopicExpression", ({
  enumerable: true,
  get: function () {
    return _index.pipelineTopicExpression;
  }
}));
Object.defineProperty(exports, "Placeholder", ({
  enumerable: true,
  get: function () {
    return _index.placeholder;
  }
}));
Object.defineProperty(exports, "PrivateName", ({
  enumerable: true,
  get: function () {
    return _index.privateName;
  }
}));
Object.defineProperty(exports, "Program", ({
  enumerable: true,
  get: function () {
    return _index.program;
  }
}));
Object.defineProperty(exports, "QualifiedTypeIdentifier", ({
  enumerable: true,
  get: function () {
    return _index.qualifiedTypeIdentifier;
  }
}));
Object.defineProperty(exports, "RecordExpression", ({
  enumerable: true,
  get: function () {
    return _index.recordExpression;
  }
}));
Object.defineProperty(exports, "RegExpLiteral", ({
  enumerable: true,
  get: function () {
    return _index.regExpLiteral;
  }
}));
Object.defineProperty(exports, "RegexLiteral", ({
  enumerable: true,
  get: function () {
    return _index.regexLiteral;
  }
}));
Object.defineProperty(exports, "RestElement", ({
  enumerable: true,
  get: function () {
    return _index.restElement;
  }
}));
Object.defineProperty(exports, "RestProperty", ({
  enumerable: true,
  get: function () {
    return _index.restProperty;
  }
}));
Object.defineProperty(exports, "ReturnStatement", ({
  enumerable: true,
  get: function () {
    return _index.returnStatement;
  }
}));
Object.defineProperty(exports, "SequenceExpression", ({
  enumerable: true,
  get: function () {
    return _index.sequenceExpression;
  }
}));
Object.defineProperty(exports, "SpreadElement", ({
  enumerable: true,
  get: function () {
    return _index.spreadElement;
  }
}));
Object.defineProperty(exports, "SpreadProperty", ({
  enumerable: true,
  get: function () {
    return _index.spreadProperty;
  }
}));
Object.defineProperty(exports, "StaticBlock", ({
  enumerable: true,
  get: function () {
    return _index.staticBlock;
  }
}));
Object.defineProperty(exports, "StringLiteral", ({
  enumerable: true,
  get: function () {
    return _index.stringLiteral;
  }
}));
Object.defineProperty(exports, "StringLiteralTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.stringLiteralTypeAnnotation;
  }
}));
Object.defineProperty(exports, "StringTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.stringTypeAnnotation;
  }
}));
Object.defineProperty(exports, "Super", ({
  enumerable: true,
  get: function () {
    return _index.super;
  }
}));
Object.defineProperty(exports, "SwitchCase", ({
  enumerable: true,
  get: function () {
    return _index.switchCase;
  }
}));
Object.defineProperty(exports, "SwitchStatement", ({
  enumerable: true,
  get: function () {
    return _index.switchStatement;
  }
}));
Object.defineProperty(exports, "SymbolTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.symbolTypeAnnotation;
  }
}));
Object.defineProperty(exports, "TSAnyKeyword", ({
  enumerable: true,
  get: function () {
    return _index.tsAnyKeyword;
  }
}));
Object.defineProperty(exports, "TSArrayType", ({
  enumerable: true,
  get: function () {
    return _index.tsArrayType;
  }
}));
Object.defineProperty(exports, "TSAsExpression", ({
  enumerable: true,
  get: function () {
    return _index.tsAsExpression;
  }
}));
Object.defineProperty(exports, "TSBigIntKeyword", ({
  enumerable: true,
  get: function () {
    return _index.tsBigIntKeyword;
  }
}));
Object.defineProperty(exports, "TSBooleanKeyword", ({
  enumerable: true,
  get: function () {
    return _index.tsBooleanKeyword;
  }
}));
Object.defineProperty(exports, "TSCallSignatureDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.tsCallSignatureDeclaration;
  }
}));
Object.defineProperty(exports, "TSConditionalType", ({
  enumerable: true,
  get: function () {
    return _index.tsConditionalType;
  }
}));
Object.defineProperty(exports, "TSConstructSignatureDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.tsConstructSignatureDeclaration;
  }
}));
Object.defineProperty(exports, "TSConstructorType", ({
  enumerable: true,
  get: function () {
    return _index.tsConstructorType;
  }
}));
Object.defineProperty(exports, "TSDeclareFunction", ({
  enumerable: true,
  get: function () {
    return _index.tsDeclareFunction;
  }
}));
Object.defineProperty(exports, "TSDeclareMethod", ({
  enumerable: true,
  get: function () {
    return _index.tsDeclareMethod;
  }
}));
Object.defineProperty(exports, "TSEnumDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.tsEnumDeclaration;
  }
}));
Object.defineProperty(exports, "TSEnumMember", ({
  enumerable: true,
  get: function () {
    return _index.tsEnumMember;
  }
}));
Object.defineProperty(exports, "TSExportAssignment", ({
  enumerable: true,
  get: function () {
    return _index.tsExportAssignment;
  }
}));
Object.defineProperty(exports, "TSExpressionWithTypeArguments", ({
  enumerable: true,
  get: function () {
    return _index.tsExpressionWithTypeArguments;
  }
}));
Object.defineProperty(exports, "TSExternalModuleReference", ({
  enumerable: true,
  get: function () {
    return _index.tsExternalModuleReference;
  }
}));
Object.defineProperty(exports, "TSFunctionType", ({
  enumerable: true,
  get: function () {
    return _index.tsFunctionType;
  }
}));
Object.defineProperty(exports, "TSImportEqualsDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.tsImportEqualsDeclaration;
  }
}));
Object.defineProperty(exports, "TSImportType", ({
  enumerable: true,
  get: function () {
    return _index.tsImportType;
  }
}));
Object.defineProperty(exports, "TSIndexSignature", ({
  enumerable: true,
  get: function () {
    return _index.tsIndexSignature;
  }
}));
Object.defineProperty(exports, "TSIndexedAccessType", ({
  enumerable: true,
  get: function () {
    return _index.tsIndexedAccessType;
  }
}));
Object.defineProperty(exports, "TSInferType", ({
  enumerable: true,
  get: function () {
    return _index.tsInferType;
  }
}));
Object.defineProperty(exports, "TSInstantiationExpression", ({
  enumerable: true,
  get: function () {
    return _index.tsInstantiationExpression;
  }
}));
Object.defineProperty(exports, "TSInterfaceBody", ({
  enumerable: true,
  get: function () {
    return _index.tsInterfaceBody;
  }
}));
Object.defineProperty(exports, "TSInterfaceDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.tsInterfaceDeclaration;
  }
}));
Object.defineProperty(exports, "TSIntersectionType", ({
  enumerable: true,
  get: function () {
    return _index.tsIntersectionType;
  }
}));
Object.defineProperty(exports, "TSIntrinsicKeyword", ({
  enumerable: true,
  get: function () {
    return _index.tsIntrinsicKeyword;
  }
}));
Object.defineProperty(exports, "TSLiteralType", ({
  enumerable: true,
  get: function () {
    return _index.tsLiteralType;
  }
}));
Object.defineProperty(exports, "TSMappedType", ({
  enumerable: true,
  get: function () {
    return _index.tsMappedType;
  }
}));
Object.defineProperty(exports, "TSMethodSignature", ({
  enumerable: true,
  get: function () {
    return _index.tsMethodSignature;
  }
}));
Object.defineProperty(exports, "TSModuleBlock", ({
  enumerable: true,
  get: function () {
    return _index.tsModuleBlock;
  }
}));
Object.defineProperty(exports, "TSModuleDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.tsModuleDeclaration;
  }
}));
Object.defineProperty(exports, "TSNamedTupleMember", ({
  enumerable: true,
  get: function () {
    return _index.tsNamedTupleMember;
  }
}));
Object.defineProperty(exports, "TSNamespaceExportDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.tsNamespaceExportDeclaration;
  }
}));
Object.defineProperty(exports, "TSNeverKeyword", ({
  enumerable: true,
  get: function () {
    return _index.tsNeverKeyword;
  }
}));
Object.defineProperty(exports, "TSNonNullExpression", ({
  enumerable: true,
  get: function () {
    return _index.tsNonNullExpression;
  }
}));
Object.defineProperty(exports, "TSNullKeyword", ({
  enumerable: true,
  get: function () {
    return _index.tsNullKeyword;
  }
}));
Object.defineProperty(exports, "TSNumberKeyword", ({
  enumerable: true,
  get: function () {
    return _index.tsNumberKeyword;
  }
}));
Object.defineProperty(exports, "TSObjectKeyword", ({
  enumerable: true,
  get: function () {
    return _index.tsObjectKeyword;
  }
}));
Object.defineProperty(exports, "TSOptionalType", ({
  enumerable: true,
  get: function () {
    return _index.tsOptionalType;
  }
}));
Object.defineProperty(exports, "TSParameterProperty", ({
  enumerable: true,
  get: function () {
    return _index.tsParameterProperty;
  }
}));
Object.defineProperty(exports, "TSParenthesizedType", ({
  enumerable: true,
  get: function () {
    return _index.tsParenthesizedType;
  }
}));
Object.defineProperty(exports, "TSPropertySignature", ({
  enumerable: true,
  get: function () {
    return _index.tsPropertySignature;
  }
}));
Object.defineProperty(exports, "TSQualifiedName", ({
  enumerable: true,
  get: function () {
    return _index.tsQualifiedName;
  }
}));
Object.defineProperty(exports, "TSRestType", ({
  enumerable: true,
  get: function () {
    return _index.tsRestType;
  }
}));
Object.defineProperty(exports, "TSStringKeyword", ({
  enumerable: true,
  get: function () {
    return _index.tsStringKeyword;
  }
}));
Object.defineProperty(exports, "TSSymbolKeyword", ({
  enumerable: true,
  get: function () {
    return _index.tsSymbolKeyword;
  }
}));
Object.defineProperty(exports, "TSThisType", ({
  enumerable: true,
  get: function () {
    return _index.tsThisType;
  }
}));
Object.defineProperty(exports, "TSTupleType", ({
  enumerable: true,
  get: function () {
    return _index.tsTupleType;
  }
}));
Object.defineProperty(exports, "TSTypeAliasDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.tsTypeAliasDeclaration;
  }
}));
Object.defineProperty(exports, "TSTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.tsTypeAnnotation;
  }
}));
Object.defineProperty(exports, "TSTypeAssertion", ({
  enumerable: true,
  get: function () {
    return _index.tsTypeAssertion;
  }
}));
Object.defineProperty(exports, "TSTypeLiteral", ({
  enumerable: true,
  get: function () {
    return _index.tsTypeLiteral;
  }
}));
Object.defineProperty(exports, "TSTypeOperator", ({
  enumerable: true,
  get: function () {
    return _index.tsTypeOperator;
  }
}));
Object.defineProperty(exports, "TSTypeParameter", ({
  enumerable: true,
  get: function () {
    return _index.tsTypeParameter;
  }
}));
Object.defineProperty(exports, "TSTypeParameterDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.tsTypeParameterDeclaration;
  }
}));
Object.defineProperty(exports, "TSTypeParameterInstantiation", ({
  enumerable: true,
  get: function () {
    return _index.tsTypeParameterInstantiation;
  }
}));
Object.defineProperty(exports, "TSTypePredicate", ({
  enumerable: true,
  get: function () {
    return _index.tsTypePredicate;
  }
}));
Object.defineProperty(exports, "TSTypeQuery", ({
  enumerable: true,
  get: function () {
    return _index.tsTypeQuery;
  }
}));
Object.defineProperty(exports, "TSTypeReference", ({
  enumerable: true,
  get: function () {
    return _index.tsTypeReference;
  }
}));
Object.defineProperty(exports, "TSUndefinedKeyword", ({
  enumerable: true,
  get: function () {
    return _index.tsUndefinedKeyword;
  }
}));
Object.defineProperty(exports, "TSUnionType", ({
  enumerable: true,
  get: function () {
    return _index.tsUnionType;
  }
}));
Object.defineProperty(exports, "TSUnknownKeyword", ({
  enumerable: true,
  get: function () {
    return _index.tsUnknownKeyword;
  }
}));
Object.defineProperty(exports, "TSVoidKeyword", ({
  enumerable: true,
  get: function () {
    return _index.tsVoidKeyword;
  }
}));
Object.defineProperty(exports, "TaggedTemplateExpression", ({
  enumerable: true,
  get: function () {
    return _index.taggedTemplateExpression;
  }
}));
Object.defineProperty(exports, "TemplateElement", ({
  enumerable: true,
  get: function () {
    return _index.templateElement;
  }
}));
Object.defineProperty(exports, "TemplateLiteral", ({
  enumerable: true,
  get: function () {
    return _index.templateLiteral;
  }
}));
Object.defineProperty(exports, "ThisExpression", ({
  enumerable: true,
  get: function () {
    return _index.thisExpression;
  }
}));
Object.defineProperty(exports, "ThisTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.thisTypeAnnotation;
  }
}));
Object.defineProperty(exports, "ThrowStatement", ({
  enumerable: true,
  get: function () {
    return _index.throwStatement;
  }
}));
Object.defineProperty(exports, "TopicReference", ({
  enumerable: true,
  get: function () {
    return _index.topicReference;
  }
}));
Object.defineProperty(exports, "TryStatement", ({
  enumerable: true,
  get: function () {
    return _index.tryStatement;
  }
}));
Object.defineProperty(exports, "TupleExpression", ({
  enumerable: true,
  get: function () {
    return _index.tupleExpression;
  }
}));
Object.defineProperty(exports, "TupleTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.tupleTypeAnnotation;
  }
}));
Object.defineProperty(exports, "TypeAlias", ({
  enumerable: true,
  get: function () {
    return _index.typeAlias;
  }
}));
Object.defineProperty(exports, "TypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.typeAnnotation;
  }
}));
Object.defineProperty(exports, "TypeCastExpression", ({
  enumerable: true,
  get: function () {
    return _index.typeCastExpression;
  }
}));
Object.defineProperty(exports, "TypeParameter", ({
  enumerable: true,
  get: function () {
    return _index.typeParameter;
  }
}));
Object.defineProperty(exports, "TypeParameterDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.typeParameterDeclaration;
  }
}));
Object.defineProperty(exports, "TypeParameterInstantiation", ({
  enumerable: true,
  get: function () {
    return _index.typeParameterInstantiation;
  }
}));
Object.defineProperty(exports, "TypeofTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.typeofTypeAnnotation;
  }
}));
Object.defineProperty(exports, "UnaryExpression", ({
  enumerable: true,
  get: function () {
    return _index.unaryExpression;
  }
}));
Object.defineProperty(exports, "UnionTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.unionTypeAnnotation;
  }
}));
Object.defineProperty(exports, "UpdateExpression", ({
  enumerable: true,
  get: function () {
    return _index.updateExpression;
  }
}));
Object.defineProperty(exports, "V8IntrinsicIdentifier", ({
  enumerable: true,
  get: function () {
    return _index.v8IntrinsicIdentifier;
  }
}));
Object.defineProperty(exports, "VariableDeclaration", ({
  enumerable: true,
  get: function () {
    return _index.variableDeclaration;
  }
}));
Object.defineProperty(exports, "VariableDeclarator", ({
  enumerable: true,
  get: function () {
    return _index.variableDeclarator;
  }
}));
Object.defineProperty(exports, "Variance", ({
  enumerable: true,
  get: function () {
    return _index.variance;
  }
}));
Object.defineProperty(exports, "VoidTypeAnnotation", ({
  enumerable: true,
  get: function () {
    return _index.voidTypeAnnotation;
  }
}));
Object.defineProperty(exports, "WhileStatement", ({
  enumerable: true,
  get: function () {
    return _index.whileStatement;
  }
}));
Object.defineProperty(exports, "WithStatement", ({
  enumerable: true,
  get: function () {
    return _index.withStatement;
  }
}));
Object.defineProperty(exports, "YieldExpression", ({
  enumerable: true,
  get: function () {
    return _index.yieldExpression;
  }
}));

var _index = __webpack_require__(55);

/***/ }),
/* 86 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = cloneNode;

var _definitions = __webpack_require__(58);

var _generated = __webpack_require__(50);

const has = Function.call.bind(Object.prototype.hasOwnProperty);

function cloneIfNode(obj, deep, withoutLoc, commentsCache) {
  if (obj && typeof obj.type === "string") {
    return cloneNodeInternal(obj, deep, withoutLoc, commentsCache);
  }

  return obj;
}

function cloneIfNodeOrArray(obj, deep, withoutLoc, commentsCache) {
  if (Array.isArray(obj)) {
    return obj.map(node => cloneIfNode(node, deep, withoutLoc, commentsCache));
  }

  return cloneIfNode(obj, deep, withoutLoc, commentsCache);
}

function cloneNode(node, deep = true, withoutLoc = false) {
  return cloneNodeInternal(node, deep, withoutLoc, new Map());
}

function cloneNodeInternal(node, deep = true, withoutLoc = false, commentsCache) {
  if (!node) return node;
  const {
    type
  } = node;
  const newNode = {
    type: node.type
  };

  if ((0, _generated.isIdentifier)(node)) {
    newNode.name = node.name;

    if (has(node, "optional") && typeof node.optional === "boolean") {
      newNode.optional = node.optional;
    }

    if (has(node, "typeAnnotation")) {
      newNode.typeAnnotation = deep ? cloneIfNodeOrArray(node.typeAnnotation, true, withoutLoc, commentsCache) : node.typeAnnotation;
    }
  } else if (!has(_definitions.NODE_FIELDS, type)) {
    throw new Error(`Unknown node type: "${type}"`);
  } else {
    for (const field of Object.keys(_definitions.NODE_FIELDS[type])) {
      if (has(node, field)) {
        if (deep) {
          newNode[field] = (0, _generated.isFile)(node) && field === "comments" ? maybeCloneComments(node.comments, deep, withoutLoc, commentsCache) : cloneIfNodeOrArray(node[field], true, withoutLoc, commentsCache);
        } else {
          newNode[field] = node[field];
        }
      }
    }
  }

  if (has(node, "loc")) {
    if (withoutLoc) {
      newNode.loc = null;
    } else {
      newNode.loc = node.loc;
    }
  }

  if (has(node, "leadingComments")) {
    newNode.leadingComments = maybeCloneComments(node.leadingComments, deep, withoutLoc, commentsCache);
  }

  if (has(node, "innerComments")) {
    newNode.innerComments = maybeCloneComments(node.innerComments, deep, withoutLoc, commentsCache);
  }

  if (has(node, "trailingComments")) {
    newNode.trailingComments = maybeCloneComments(node.trailingComments, deep, withoutLoc, commentsCache);
  }

  if (has(node, "extra")) {
    newNode.extra = Object.assign({}, node.extra);
  }

  return newNode;
}

function maybeCloneComments(comments, deep, withoutLoc, commentsCache) {
  if (!comments || !deep) {
    return comments;
  }

  return comments.map(comment => {
    const cache = commentsCache.get(comment);
    if (cache) return cache;
    const {
      type,
      value,
      loc
    } = comment;
    const ret = {
      type,
      value,
      loc
    };

    if (withoutLoc) {
      ret.loc = null;
    }

    commentsCache.set(comment, ret);
    return ret;
  });
}

/***/ }),
/* 87 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = clone;

var _cloneNode = __webpack_require__(86);

function clone(node) {
  return (0, _cloneNode.default)(node, false);
}

/***/ }),
/* 88 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = cloneDeep;

var _cloneNode = __webpack_require__(86);

function cloneDeep(node) {
  return (0, _cloneNode.default)(node);
}

/***/ }),
/* 89 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = cloneDeepWithoutLoc;

var _cloneNode = __webpack_require__(86);

function cloneDeepWithoutLoc(node) {
  return (0, _cloneNode.default)(node, true, true);
}

/***/ }),
/* 90 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = cloneWithoutLoc;

var _cloneNode = __webpack_require__(86);

function cloneWithoutLoc(node) {
  return (0, _cloneNode.default)(node, false, true);
}

/***/ }),
/* 91 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = addComment;

var _addComments = __webpack_require__(92);

function addComment(node, type, content, line) {
  return (0, _addComments.default)(node, type, [{
    type: line ? "CommentLine" : "CommentBlock",
    value: content
  }]);
}

/***/ }),
/* 92 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = addComments;

function addComments(node, type, comments) {
  if (!comments || !node) return node;
  const key = `${type}Comments`;

  if (node[key]) {
    if (type === "leading") {
      node[key] = comments.concat(node[key]);
    } else {
      node[key].push(...comments);
    }
  } else {
    node[key] = comments;
  }

  return node;
}

/***/ }),
/* 93 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = inheritInnerComments;

var _inherit = __webpack_require__(94);

function inheritInnerComments(child, parent) {
  (0, _inherit.default)("innerComments", child, parent);
}

/***/ }),
/* 94 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = inherit;

function inherit(key, child, parent) {
  if (child && parent) {
    child[key] = Array.from(new Set([].concat(child[key], parent[key]).filter(Boolean)));
  }
}

/***/ }),
/* 95 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = inheritLeadingComments;

var _inherit = __webpack_require__(94);

function inheritLeadingComments(child, parent) {
  (0, _inherit.default)("leadingComments", child, parent);
}

/***/ }),
/* 96 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = inheritsComments;

var _inheritTrailingComments = __webpack_require__(97);

var _inheritLeadingComments = __webpack_require__(95);

var _inheritInnerComments = __webpack_require__(93);

function inheritsComments(child, parent) {
  (0, _inheritTrailingComments.default)(child, parent);
  (0, _inheritLeadingComments.default)(child, parent);
  (0, _inheritInnerComments.default)(child, parent);
  return child;
}

/***/ }),
/* 97 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = inheritTrailingComments;

var _inherit = __webpack_require__(94);

function inheritTrailingComments(child, parent) {
  (0, _inherit.default)("trailingComments", child, parent);
}

/***/ }),
/* 98 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = removeComments;

var _constants = __webpack_require__(69);

function removeComments(node) {
  _constants.COMMENT_KEYS.forEach(key => {
    node[key] = null;
  });

  return node;
}

/***/ }),
/* 99 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WHILE_TYPES = exports.USERWHITESPACABLE_TYPES = exports.UNARYLIKE_TYPES = exports.TYPESCRIPT_TYPES = exports.TSTYPE_TYPES = exports.TSTYPEELEMENT_TYPES = exports.TSENTITYNAME_TYPES = exports.TSBASETYPE_TYPES = exports.TERMINATORLESS_TYPES = exports.STATEMENT_TYPES = exports.STANDARDIZED_TYPES = exports.SCOPABLE_TYPES = exports.PUREISH_TYPES = exports.PROPERTY_TYPES = exports.PRIVATE_TYPES = exports.PATTERN_TYPES = exports.PATTERNLIKE_TYPES = exports.OBJECTMEMBER_TYPES = exports.MODULESPECIFIER_TYPES = exports.MODULEDECLARATION_TYPES = exports.MISCELLANEOUS_TYPES = exports.METHOD_TYPES = exports.LVAL_TYPES = exports.LOOP_TYPES = exports.LITERAL_TYPES = exports.JSX_TYPES = exports.IMMUTABLE_TYPES = exports.FUNCTION_TYPES = exports.FUNCTIONPARENT_TYPES = exports.FOR_TYPES = exports.FORXSTATEMENT_TYPES = exports.FLOW_TYPES = exports.FLOWTYPE_TYPES = exports.FLOWPREDICATE_TYPES = exports.FLOWDECLARATION_TYPES = exports.FLOWBASEANNOTATION_TYPES = exports.EXPRESSION_TYPES = exports.EXPRESSIONWRAPPER_TYPES = exports.EXPORTDECLARATION_TYPES = exports.ENUMMEMBER_TYPES = exports.ENUMBODY_TYPES = exports.DECLARATION_TYPES = exports.CONDITIONAL_TYPES = exports.COMPLETIONSTATEMENT_TYPES = exports.CLASS_TYPES = exports.BLOCK_TYPES = exports.BLOCKPARENT_TYPES = exports.BINARY_TYPES = exports.ACCESSOR_TYPES = void 0;

var _definitions = __webpack_require__(58);

const STANDARDIZED_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Standardized"];
exports.STANDARDIZED_TYPES = STANDARDIZED_TYPES;
const EXPRESSION_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Expression"];
exports.EXPRESSION_TYPES = EXPRESSION_TYPES;
const BINARY_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Binary"];
exports.BINARY_TYPES = BINARY_TYPES;
const SCOPABLE_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Scopable"];
exports.SCOPABLE_TYPES = SCOPABLE_TYPES;
const BLOCKPARENT_TYPES = _definitions.FLIPPED_ALIAS_KEYS["BlockParent"];
exports.BLOCKPARENT_TYPES = BLOCKPARENT_TYPES;
const BLOCK_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Block"];
exports.BLOCK_TYPES = BLOCK_TYPES;
const STATEMENT_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Statement"];
exports.STATEMENT_TYPES = STATEMENT_TYPES;
const TERMINATORLESS_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Terminatorless"];
exports.TERMINATORLESS_TYPES = TERMINATORLESS_TYPES;
const COMPLETIONSTATEMENT_TYPES = _definitions.FLIPPED_ALIAS_KEYS["CompletionStatement"];
exports.COMPLETIONSTATEMENT_TYPES = COMPLETIONSTATEMENT_TYPES;
const CONDITIONAL_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Conditional"];
exports.CONDITIONAL_TYPES = CONDITIONAL_TYPES;
const LOOP_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Loop"];
exports.LOOP_TYPES = LOOP_TYPES;
const WHILE_TYPES = _definitions.FLIPPED_ALIAS_KEYS["While"];
exports.WHILE_TYPES = WHILE_TYPES;
const EXPRESSIONWRAPPER_TYPES = _definitions.FLIPPED_ALIAS_KEYS["ExpressionWrapper"];
exports.EXPRESSIONWRAPPER_TYPES = EXPRESSIONWRAPPER_TYPES;
const FOR_TYPES = _definitions.FLIPPED_ALIAS_KEYS["For"];
exports.FOR_TYPES = FOR_TYPES;
const FORXSTATEMENT_TYPES = _definitions.FLIPPED_ALIAS_KEYS["ForXStatement"];
exports.FORXSTATEMENT_TYPES = FORXSTATEMENT_TYPES;
const FUNCTION_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Function"];
exports.FUNCTION_TYPES = FUNCTION_TYPES;
const FUNCTIONPARENT_TYPES = _definitions.FLIPPED_ALIAS_KEYS["FunctionParent"];
exports.FUNCTIONPARENT_TYPES = FUNCTIONPARENT_TYPES;
const PUREISH_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Pureish"];
exports.PUREISH_TYPES = PUREISH_TYPES;
const DECLARATION_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Declaration"];
exports.DECLARATION_TYPES = DECLARATION_TYPES;
const PATTERNLIKE_TYPES = _definitions.FLIPPED_ALIAS_KEYS["PatternLike"];
exports.PATTERNLIKE_TYPES = PATTERNLIKE_TYPES;
const LVAL_TYPES = _definitions.FLIPPED_ALIAS_KEYS["LVal"];
exports.LVAL_TYPES = LVAL_TYPES;
const TSENTITYNAME_TYPES = _definitions.FLIPPED_ALIAS_KEYS["TSEntityName"];
exports.TSENTITYNAME_TYPES = TSENTITYNAME_TYPES;
const LITERAL_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Literal"];
exports.LITERAL_TYPES = LITERAL_TYPES;
const IMMUTABLE_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Immutable"];
exports.IMMUTABLE_TYPES = IMMUTABLE_TYPES;
const USERWHITESPACABLE_TYPES = _definitions.FLIPPED_ALIAS_KEYS["UserWhitespacable"];
exports.USERWHITESPACABLE_TYPES = USERWHITESPACABLE_TYPES;
const METHOD_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Method"];
exports.METHOD_TYPES = METHOD_TYPES;
const OBJECTMEMBER_TYPES = _definitions.FLIPPED_ALIAS_KEYS["ObjectMember"];
exports.OBJECTMEMBER_TYPES = OBJECTMEMBER_TYPES;
const PROPERTY_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Property"];
exports.PROPERTY_TYPES = PROPERTY_TYPES;
const UNARYLIKE_TYPES = _definitions.FLIPPED_ALIAS_KEYS["UnaryLike"];
exports.UNARYLIKE_TYPES = UNARYLIKE_TYPES;
const PATTERN_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Pattern"];
exports.PATTERN_TYPES = PATTERN_TYPES;
const CLASS_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Class"];
exports.CLASS_TYPES = CLASS_TYPES;
const MODULEDECLARATION_TYPES = _definitions.FLIPPED_ALIAS_KEYS["ModuleDeclaration"];
exports.MODULEDECLARATION_TYPES = MODULEDECLARATION_TYPES;
const EXPORTDECLARATION_TYPES = _definitions.FLIPPED_ALIAS_KEYS["ExportDeclaration"];
exports.EXPORTDECLARATION_TYPES = EXPORTDECLARATION_TYPES;
const MODULESPECIFIER_TYPES = _definitions.FLIPPED_ALIAS_KEYS["ModuleSpecifier"];
exports.MODULESPECIFIER_TYPES = MODULESPECIFIER_TYPES;
const ACCESSOR_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Accessor"];
exports.ACCESSOR_TYPES = ACCESSOR_TYPES;
const PRIVATE_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Private"];
exports.PRIVATE_TYPES = PRIVATE_TYPES;
const FLOW_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Flow"];
exports.FLOW_TYPES = FLOW_TYPES;
const FLOWTYPE_TYPES = _definitions.FLIPPED_ALIAS_KEYS["FlowType"];
exports.FLOWTYPE_TYPES = FLOWTYPE_TYPES;
const FLOWBASEANNOTATION_TYPES = _definitions.FLIPPED_ALIAS_KEYS["FlowBaseAnnotation"];
exports.FLOWBASEANNOTATION_TYPES = FLOWBASEANNOTATION_TYPES;
const FLOWDECLARATION_TYPES = _definitions.FLIPPED_ALIAS_KEYS["FlowDeclaration"];
exports.FLOWDECLARATION_TYPES = FLOWDECLARATION_TYPES;
const FLOWPREDICATE_TYPES = _definitions.FLIPPED_ALIAS_KEYS["FlowPredicate"];
exports.FLOWPREDICATE_TYPES = FLOWPREDICATE_TYPES;
const ENUMBODY_TYPES = _definitions.FLIPPED_ALIAS_KEYS["EnumBody"];
exports.ENUMBODY_TYPES = ENUMBODY_TYPES;
const ENUMMEMBER_TYPES = _definitions.FLIPPED_ALIAS_KEYS["EnumMember"];
exports.ENUMMEMBER_TYPES = ENUMMEMBER_TYPES;
const JSX_TYPES = _definitions.FLIPPED_ALIAS_KEYS["JSX"];
exports.JSX_TYPES = JSX_TYPES;
const MISCELLANEOUS_TYPES = _definitions.FLIPPED_ALIAS_KEYS["Miscellaneous"];
exports.MISCELLANEOUS_TYPES = MISCELLANEOUS_TYPES;
const TYPESCRIPT_TYPES = _definitions.FLIPPED_ALIAS_KEYS["TypeScript"];
exports.TYPESCRIPT_TYPES = TYPESCRIPT_TYPES;
const TSTYPEELEMENT_TYPES = _definitions.FLIPPED_ALIAS_KEYS["TSTypeElement"];
exports.TSTYPEELEMENT_TYPES = TSTYPEELEMENT_TYPES;
const TSTYPE_TYPES = _definitions.FLIPPED_ALIAS_KEYS["TSType"];
exports.TSTYPE_TYPES = TSTYPE_TYPES;
const TSBASETYPE_TYPES = _definitions.FLIPPED_ALIAS_KEYS["TSBaseType"];
exports.TSBASETYPE_TYPES = TSBASETYPE_TYPES;

/***/ }),
/* 100 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = ensureBlock;

var _toBlock = __webpack_require__(101);

function ensureBlock(node, key = "body") {
  const result = (0, _toBlock.default)(node[key], node);
  node[key] = result;
  return result;
}

/***/ }),
/* 101 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = toBlock;

var _generated = __webpack_require__(50);

var _generated2 = __webpack_require__(55);

function toBlock(node, parent) {
  if ((0, _generated.isBlockStatement)(node)) {
    return node;
  }

  let blockNodes = [];

  if ((0, _generated.isEmptyStatement)(node)) {
    blockNodes = [];
  } else {
    if (!(0, _generated.isStatement)(node)) {
      if ((0, _generated.isFunction)(parent)) {
        node = (0, _generated2.returnStatement)(node);
      } else {
        node = (0, _generated2.expressionStatement)(node);
      }
    }

    blockNodes = [node];
  }

  return (0, _generated2.blockStatement)(blockNodes);
}

/***/ }),
/* 102 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = toBindingIdentifierName;

var _toIdentifier = __webpack_require__(103);

function toBindingIdentifierName(name) {
  name = (0, _toIdentifier.default)(name);
  if (name === "eval" || name === "arguments") name = "_" + name;
  return name;
}

/***/ }),
/* 103 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = toIdentifier;

var _isValidIdentifier = __webpack_require__(64);

var _helperValidatorIdentifier = __webpack_require__(65);

function toIdentifier(input) {
  input = input + "";
  let name = "";

  for (const c of input) {
    name += (0, _helperValidatorIdentifier.isIdentifierChar)(c.codePointAt(0)) ? c : "-";
  }

  name = name.replace(/^[-0-9]+/, "");
  name = name.replace(/[-\s]+(.)?/g, function (match, c) {
    return c ? c.toUpperCase() : "";
  });

  if (!(0, _isValidIdentifier.default)(name)) {
    name = `_${name}`;
  }

  return name || "_";
}

/***/ }),
/* 104 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = toComputedKey;

var _generated = __webpack_require__(50);

var _generated2 = __webpack_require__(55);

function toComputedKey(node, key = node.key || node.property) {
  if (!node.computed && (0, _generated.isIdentifier)(key)) key = (0, _generated2.stringLiteral)(key.name);
  return key;
}

/***/ }),
/* 105 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _generated = __webpack_require__(50);

var _default = toExpression;
exports["default"] = _default;

function toExpression(node) {
  if ((0, _generated.isExpressionStatement)(node)) {
    node = node.expression;
  }

  if ((0, _generated.isExpression)(node)) {
    return node;
  }

  if ((0, _generated.isClass)(node)) {
    node.type = "ClassExpression";
  } else if ((0, _generated.isFunction)(node)) {
    node.type = "FunctionExpression";
  }

  if (!(0, _generated.isExpression)(node)) {
    throw new Error(`cannot turn ${node.type} to an expression`);
  }

  return node;
}

/***/ }),
/* 106 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = toKeyAlias;

var _generated = __webpack_require__(50);

var _cloneNode = __webpack_require__(86);

var _removePropertiesDeep = __webpack_require__(107);

function toKeyAlias(node, key = node.key) {
  let alias;

  if (node.kind === "method") {
    return toKeyAlias.increment() + "";
  } else if ((0, _generated.isIdentifier)(key)) {
    alias = key.name;
  } else if ((0, _generated.isStringLiteral)(key)) {
    alias = JSON.stringify(key.value);
  } else {
    alias = JSON.stringify((0, _removePropertiesDeep.default)((0, _cloneNode.default)(key)));
  }

  if (node.computed) {
    alias = `[${alias}]`;
  }

  if (node.static) {
    alias = `static:${alias}`;
  }

  return alias;
}

toKeyAlias.uid = 0;

toKeyAlias.increment = function () {
  if (toKeyAlias.uid >= Number.MAX_SAFE_INTEGER) {
    return toKeyAlias.uid = 0;
  } else {
    return toKeyAlias.uid++;
  }
};

/***/ }),
/* 107 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = removePropertiesDeep;

var _traverseFast = __webpack_require__(108);

var _removeProperties = __webpack_require__(109);

function removePropertiesDeep(tree, opts) {
  (0, _traverseFast.default)(tree, _removeProperties.default, opts);
  return tree;
}

/***/ }),
/* 108 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = traverseFast;

var _definitions = __webpack_require__(58);

function traverseFast(node, enter, opts) {
  if (!node) return;
  const keys = _definitions.VISITOR_KEYS[node.type];
  if (!keys) return;
  opts = opts || {};
  enter(node, opts);

  for (const key of keys) {
    const subNode = node[key];

    if (Array.isArray(subNode)) {
      for (const node of subNode) {
        traverseFast(node, enter, opts);
      }
    } else {
      traverseFast(subNode, enter, opts);
    }
  }
}

/***/ }),
/* 109 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = removeProperties;

var _constants = __webpack_require__(69);

const CLEAR_KEYS = ["tokens", "start", "end", "loc", "raw", "rawValue"];
const CLEAR_KEYS_PLUS_COMMENTS = [..._constants.COMMENT_KEYS, "comments", ...CLEAR_KEYS];

function removeProperties(node, opts = {}) {
  const map = opts.preserveComments ? CLEAR_KEYS : CLEAR_KEYS_PLUS_COMMENTS;

  for (const key of map) {
    if (node[key] != null) node[key] = undefined;
  }

  for (const key of Object.keys(node)) {
    if (key[0] === "_" && node[key] != null) node[key] = undefined;
  }

  const symbols = Object.getOwnPropertySymbols(node);

  for (const sym of symbols) {
    node[sym] = null;
  }
}

/***/ }),
/* 110 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = toSequenceExpression;

var _gatherSequenceExpressions = __webpack_require__(111);

function toSequenceExpression(nodes, scope) {
  if (!(nodes != null && nodes.length)) return;
  const declars = [];
  const result = (0, _gatherSequenceExpressions.default)(nodes, scope, declars);
  if (!result) return;

  for (const declar of declars) {
    scope.push(declar);
  }

  return result;
}

/***/ }),
/* 111 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = gatherSequenceExpressions;

var _getBindingIdentifiers = __webpack_require__(112);

var _generated = __webpack_require__(50);

var _generated2 = __webpack_require__(55);

var _cloneNode = __webpack_require__(86);

function gatherSequenceExpressions(nodes, scope, declars) {
  const exprs = [];
  let ensureLastUndefined = true;

  for (const node of nodes) {
    if (!(0, _generated.isEmptyStatement)(node)) {
      ensureLastUndefined = false;
    }

    if ((0, _generated.isExpression)(node)) {
      exprs.push(node);
    } else if ((0, _generated.isExpressionStatement)(node)) {
      exprs.push(node.expression);
    } else if ((0, _generated.isVariableDeclaration)(node)) {
      if (node.kind !== "var") return;

      for (const declar of node.declarations) {
        const bindings = (0, _getBindingIdentifiers.default)(declar);

        for (const key of Object.keys(bindings)) {
          declars.push({
            kind: node.kind,
            id: (0, _cloneNode.default)(bindings[key])
          });
        }

        if (declar.init) {
          exprs.push((0, _generated2.assignmentExpression)("=", declar.id, declar.init));
        }
      }

      ensureLastUndefined = true;
    } else if ((0, _generated.isIfStatement)(node)) {
      const consequent = node.consequent ? gatherSequenceExpressions([node.consequent], scope, declars) : scope.buildUndefinedNode();
      const alternate = node.alternate ? gatherSequenceExpressions([node.alternate], scope, declars) : scope.buildUndefinedNode();
      if (!consequent || !alternate) return;
      exprs.push((0, _generated2.conditionalExpression)(node.test, consequent, alternate));
    } else if ((0, _generated.isBlockStatement)(node)) {
      const body = gatherSequenceExpressions(node.body, scope, declars);
      if (!body) return;
      exprs.push(body);
    } else if ((0, _generated.isEmptyStatement)(node)) {
      if (nodes.indexOf(node) === 0) {
        ensureLastUndefined = true;
      }
    } else {
      return;
    }
  }

  if (ensureLastUndefined) {
    exprs.push(scope.buildUndefinedNode());
  }

  if (exprs.length === 1) {
    return exprs[0];
  } else {
    return (0, _generated2.sequenceExpression)(exprs);
  }
}

/***/ }),
/* 112 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = getBindingIdentifiers;

var _generated = __webpack_require__(50);

function getBindingIdentifiers(node, duplicates, outerOnly) {
  const search = [].concat(node);
  const ids = Object.create(null);

  while (search.length) {
    const id = search.shift();
    if (!id) continue;
    const keys = getBindingIdentifiers.keys[id.type];

    if ((0, _generated.isIdentifier)(id)) {
      if (duplicates) {
        const _ids = ids[id.name] = ids[id.name] || [];

        _ids.push(id);
      } else {
        ids[id.name] = id;
      }

      continue;
    }

    if ((0, _generated.isExportDeclaration)(id) && !(0, _generated.isExportAllDeclaration)(id)) {
      if ((0, _generated.isDeclaration)(id.declaration)) {
        search.push(id.declaration);
      }

      continue;
    }

    if (outerOnly) {
      if ((0, _generated.isFunctionDeclaration)(id)) {
        search.push(id.id);
        continue;
      }

      if ((0, _generated.isFunctionExpression)(id)) {
        continue;
      }
    }

    if (keys) {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const nodes = id[key];

        if (nodes) {
          Array.isArray(nodes) ? search.push(...nodes) : search.push(nodes);
        }
      }
    }
  }

  return ids;
}

getBindingIdentifiers.keys = {
  DeclareClass: ["id"],
  DeclareFunction: ["id"],
  DeclareModule: ["id"],
  DeclareVariable: ["id"],
  DeclareInterface: ["id"],
  DeclareTypeAlias: ["id"],
  DeclareOpaqueType: ["id"],
  InterfaceDeclaration: ["id"],
  TypeAlias: ["id"],
  OpaqueType: ["id"],
  CatchClause: ["param"],
  LabeledStatement: ["label"],
  UnaryExpression: ["argument"],
  AssignmentExpression: ["left"],
  ImportSpecifier: ["local"],
  ImportNamespaceSpecifier: ["local"],
  ImportDefaultSpecifier: ["local"],
  ImportDeclaration: ["specifiers"],
  ExportSpecifier: ["exported"],
  ExportNamespaceSpecifier: ["exported"],
  ExportDefaultSpecifier: ["exported"],
  FunctionDeclaration: ["id", "params"],
  FunctionExpression: ["id", "params"],
  ArrowFunctionExpression: ["params"],
  ObjectMethod: ["params"],
  ClassMethod: ["params"],
  ClassPrivateMethod: ["params"],
  ForInStatement: ["left"],
  ForOfStatement: ["left"],
  ClassDeclaration: ["id"],
  ClassExpression: ["id"],
  RestElement: ["argument"],
  UpdateExpression: ["argument"],
  ObjectProperty: ["value"],
  AssignmentPattern: ["left"],
  ArrayPattern: ["elements"],
  ObjectPattern: ["properties"],
  VariableDeclaration: ["declarations"],
  VariableDeclarator: ["id"]
};

/***/ }),
/* 113 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _generated = __webpack_require__(50);

var _generated2 = __webpack_require__(55);

var _default = toStatement;
exports["default"] = _default;

function toStatement(node, ignore) {
  if ((0, _generated.isStatement)(node)) {
    return node;
  }

  let mustHaveId = false;
  let newType;

  if ((0, _generated.isClass)(node)) {
    mustHaveId = true;
    newType = "ClassDeclaration";
  } else if ((0, _generated.isFunction)(node)) {
    mustHaveId = true;
    newType = "FunctionDeclaration";
  } else if ((0, _generated.isAssignmentExpression)(node)) {
    return (0, _generated2.expressionStatement)(node);
  }

  if (mustHaveId && !node.id) {
    newType = false;
  }

  if (!newType) {
    if (ignore) {
      return false;
    } else {
      throw new Error(`cannot turn ${node.type} to a statement`);
    }
  }

  node.type = newType;
  return node;
}

/***/ }),
/* 114 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _isValidIdentifier = __webpack_require__(64);

var _generated = __webpack_require__(55);

var _default = valueToNode;
exports["default"] = _default;
const objectToString = Function.call.bind(Object.prototype.toString);

function isRegExp(value) {
  return objectToString(value) === "[object RegExp]";
}

function isPlainObject(value) {
  if (typeof value !== "object" || value === null || Object.prototype.toString.call(value) !== "[object Object]") {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === null || Object.getPrototypeOf(proto) === null;
}

function valueToNode(value) {
  if (value === undefined) {
    return (0, _generated.identifier)("undefined");
  }

  if (value === true || value === false) {
    return (0, _generated.booleanLiteral)(value);
  }

  if (value === null) {
    return (0, _generated.nullLiteral)();
  }

  if (typeof value === "string") {
    return (0, _generated.stringLiteral)(value);
  }

  if (typeof value === "number") {
    let result;

    if (Number.isFinite(value)) {
      result = (0, _generated.numericLiteral)(Math.abs(value));
    } else {
      let numerator;

      if (Number.isNaN(value)) {
        numerator = (0, _generated.numericLiteral)(0);
      } else {
        numerator = (0, _generated.numericLiteral)(1);
      }

      result = (0, _generated.binaryExpression)("/", numerator, (0, _generated.numericLiteral)(0));
    }

    if (value < 0 || Object.is(value, -0)) {
      result = (0, _generated.unaryExpression)("-", result);
    }

    return result;
  }

  if (isRegExp(value)) {
    const pattern = value.source;
    const flags = value.toString().match(/\/([a-z]+|)$/)[1];
    return (0, _generated.regExpLiteral)(pattern, flags);
  }

  if (Array.isArray(value)) {
    return (0, _generated.arrayExpression)(value.map(valueToNode));
  }

  if (isPlainObject(value)) {
    const props = [];

    for (const key of Object.keys(value)) {
      let nodeKey;

      if ((0, _isValidIdentifier.default)(key)) {
        nodeKey = (0, _generated.identifier)(key);
      } else {
        nodeKey = (0, _generated.stringLiteral)(key);
      }

      props.push((0, _generated.objectProperty)(nodeKey, valueToNode(value[key])));
    }

    return (0, _generated.objectExpression)(props);
  }

  throw new Error("don't know how to turn this value into a node");
}

/***/ }),
/* 115 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = appendToMemberExpression;

var _generated = __webpack_require__(55);

function appendToMemberExpression(member, append, computed = false) {
  member.object = (0, _generated.memberExpression)(member.object, member.property, member.computed);
  member.property = append;
  member.computed = !!computed;
  return member;
}

/***/ }),
/* 116 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = inherits;

var _constants = __webpack_require__(69);

var _inheritsComments = __webpack_require__(96);

function inherits(child, parent) {
  if (!child || !parent) return child;

  for (const key of _constants.INHERIT_KEYS.optional) {
    if (child[key] == null) {
      child[key] = parent[key];
    }
  }

  for (const key of Object.keys(parent)) {
    if (key[0] === "_" && key !== "__clone") {
      child[key] = parent[key];
    }
  }

  for (const key of _constants.INHERIT_KEYS.force) {
    child[key] = parent[key];
  }

  (0, _inheritsComments.default)(child, parent);
  return child;
}

/***/ }),
/* 117 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = prependToMemberExpression;

var _generated = __webpack_require__(55);

var _ = __webpack_require__(46);

function prependToMemberExpression(member, prepend) {
  if ((0, _.isSuper)(member.object)) {
    throw new Error("Cannot prepend node to super property access (`super.foo`).");
  }

  member.object = (0, _generated.memberExpression)(prepend, member.object);
  return member;
}

/***/ }),
/* 118 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _getBindingIdentifiers = __webpack_require__(112);

var _default = getOuterBindingIdentifiers;
exports["default"] = _default;

function getOuterBindingIdentifiers(node, duplicates) {
  return (0, _getBindingIdentifiers.default)(node, duplicates, true);
}

/***/ }),
/* 119 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = traverse;

var _definitions = __webpack_require__(58);

function traverse(node, handlers, state) {
  if (typeof handlers === "function") {
    handlers = {
      enter: handlers
    };
  }

  const {
    enter,
    exit
  } = handlers;
  traverseSimpleImpl(node, enter, exit, state, []);
}

function traverseSimpleImpl(node, enter, exit, state, ancestors) {
  const keys = _definitions.VISITOR_KEYS[node.type];
  if (!keys) return;
  if (enter) enter(node, ancestors, state);

  for (const key of keys) {
    const subNode = node[key];

    if (Array.isArray(subNode)) {
      for (let i = 0; i < subNode.length; i++) {
        const child = subNode[i];
        if (!child) continue;
        ancestors.push({
          node,
          key,
          index: i
        });
        traverseSimpleImpl(child, enter, exit, state, ancestors);
        ancestors.pop();
      }
    } else if (subNode) {
      ancestors.push({
        node,
        key
      });
      traverseSimpleImpl(subNode, enter, exit, state, ancestors);
      ancestors.pop();
    }
  }

  if (exit) exit(node, ancestors, state);
}

/***/ }),
/* 120 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isBinding;

var _getBindingIdentifiers = __webpack_require__(112);

function isBinding(node, parent, grandparent) {
  if (grandparent && node.type === "Identifier" && parent.type === "ObjectProperty" && grandparent.type === "ObjectExpression") {
    return false;
  }

  const keys = _getBindingIdentifiers.default.keys[parent.type];

  if (keys) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const val = parent[key];

      if (Array.isArray(val)) {
        if (val.indexOf(node) >= 0) return true;
      } else {
        if (val === node) return true;
      }
    }
  }

  return false;
}

/***/ }),
/* 121 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isBlockScoped;

var _generated = __webpack_require__(50);

var _isLet = __webpack_require__(122);

function isBlockScoped(node) {
  return (0, _generated.isFunctionDeclaration)(node) || (0, _generated.isClassDeclaration)(node) || (0, _isLet.default)(node);
}

/***/ }),
/* 122 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isLet;

var _generated = __webpack_require__(50);

var _constants = __webpack_require__(69);

function isLet(node) {
  return (0, _generated.isVariableDeclaration)(node) && (node.kind !== "var" || node[_constants.BLOCK_SCOPED_SYMBOL]);
}

/***/ }),
/* 123 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isImmutable;

var _isType = __webpack_require__(62);

var _generated = __webpack_require__(50);

function isImmutable(node) {
  if ((0, _isType.default)(node.type, "Immutable")) return true;

  if ((0, _generated.isIdentifier)(node)) {
    if (node.name === "undefined") {
      return true;
    } else {
      return false;
    }
  }

  return false;
}

/***/ }),
/* 124 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isNodesEquivalent;

var _definitions = __webpack_require__(58);

function isNodesEquivalent(a, b) {
  if (typeof a !== "object" || typeof b !== "object" || a == null || b == null) {
    return a === b;
  }

  if (a.type !== b.type) {
    return false;
  }

  const fields = Object.keys(_definitions.NODE_FIELDS[a.type] || a.type);
  const visitorKeys = _definitions.VISITOR_KEYS[a.type];

  for (const field of fields) {
    const val_a = a[field];
    const val_b = b[field];

    if (typeof val_a !== typeof val_b) {
      return false;
    }

    if (val_a == null && val_b == null) {
      continue;
    } else if (val_a == null || val_b == null) {
      return false;
    }

    if (Array.isArray(val_a)) {
      if (!Array.isArray(val_b)) {
        return false;
      }

      if (val_a.length !== val_b.length) {
        return false;
      }

      for (let i = 0; i < val_a.length; i++) {
        if (!isNodesEquivalent(val_a[i], val_b[i])) {
          return false;
        }
      }

      continue;
    }

    if (typeof val_a === "object" && !(visitorKeys != null && visitorKeys.includes(field))) {
      for (const key of Object.keys(val_a)) {
        if (val_a[key] !== val_b[key]) {
          return false;
        }
      }

      continue;
    }

    if (!isNodesEquivalent(val_a, val_b)) {
      return false;
    }
  }

  return true;
}

/***/ }),
/* 125 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isReferenced;

function isReferenced(node, parent, grandparent) {
  switch (parent.type) {
    case "MemberExpression":
    case "OptionalMemberExpression":
      if (parent.property === node) {
        return !!parent.computed;
      }

      return parent.object === node;

    case "JSXMemberExpression":
      return parent.object === node;

    case "VariableDeclarator":
      return parent.init === node;

    case "ArrowFunctionExpression":
      return parent.body === node;

    case "PrivateName":
      return false;

    case "ClassMethod":
    case "ClassPrivateMethod":
    case "ObjectMethod":
      if (parent.key === node) {
        return !!parent.computed;
      }

      return false;

    case "ObjectProperty":
      if (parent.key === node) {
        return !!parent.computed;
      }

      return !grandparent || grandparent.type !== "ObjectPattern";

    case "ClassProperty":
    case "ClassAccessorProperty":
      if (parent.key === node) {
        return !!parent.computed;
      }

      return true;

    case "ClassPrivateProperty":
      return parent.key !== node;

    case "ClassDeclaration":
    case "ClassExpression":
      return parent.superClass === node;

    case "AssignmentExpression":
      return parent.right === node;

    case "AssignmentPattern":
      return parent.right === node;

    case "LabeledStatement":
      return false;

    case "CatchClause":
      return false;

    case "RestElement":
      return false;

    case "BreakStatement":
    case "ContinueStatement":
      return false;

    case "FunctionDeclaration":
    case "FunctionExpression":
      return false;

    case "ExportNamespaceSpecifier":
    case "ExportDefaultSpecifier":
      return false;

    case "ExportSpecifier":
      if (grandparent != null && grandparent.source) {
        return false;
      }

      return parent.local === node;

    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
    case "ImportSpecifier":
      return false;

    case "ImportAttribute":
      return false;

    case "JSXAttribute":
      return false;

    case "ObjectPattern":
    case "ArrayPattern":
      return false;

    case "MetaProperty":
      return false;

    case "ObjectTypeProperty":
      return parent.key !== node;

    case "TSEnumMember":
      return parent.id !== node;

    case "TSPropertySignature":
      if (parent.key === node) {
        return !!parent.computed;
      }

      return true;
  }

  return true;
}

/***/ }),
/* 126 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isScope;

var _generated = __webpack_require__(50);

function isScope(node, parent) {
  if ((0, _generated.isBlockStatement)(node) && ((0, _generated.isFunction)(parent) || (0, _generated.isCatchClause)(parent))) {
    return false;
  }

  if ((0, _generated.isPattern)(node) && ((0, _generated.isFunction)(parent) || (0, _generated.isCatchClause)(parent))) {
    return true;
  }

  return (0, _generated.isScopable)(node);
}

/***/ }),
/* 127 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isSpecifierDefault;

var _generated = __webpack_require__(50);

function isSpecifierDefault(specifier) {
  return (0, _generated.isImportDefaultSpecifier)(specifier) || (0, _generated.isIdentifier)(specifier.imported || specifier.exported, {
    name: "default"
  });
}

/***/ }),
/* 128 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isValidES3Identifier;

var _isValidIdentifier = __webpack_require__(64);

const RESERVED_WORDS_ES3_ONLY = new Set(["abstract", "boolean", "byte", "char", "double", "enum", "final", "float", "goto", "implements", "int", "interface", "long", "native", "package", "private", "protected", "public", "short", "static", "synchronized", "throws", "transient", "volatile"]);

function isValidES3Identifier(name) {
  return (0, _isValidIdentifier.default)(name) && !RESERVED_WORDS_ES3_ONLY.has(name);
}

/***/ }),
/* 129 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isVar;

var _generated = __webpack_require__(50);

var _constants = __webpack_require__(69);

function isVar(node) {
  return (0, _generated.isVariableDeclaration)(node, {
    kind: "var"
  }) && !node[_constants.BLOCK_SCOPED_SYMBOL];
}

/***/ }),
/* 130 */
/***/ (() => {

"use strict";


/***/ }),
/* 131 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _assert = __webpack_require__(1);

var _t = __webpack_require__(46);

const {
  callExpression,
  cloneNode,
  expressionStatement,
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  importNamespaceSpecifier,
  importSpecifier,
  memberExpression,
  stringLiteral,
  variableDeclaration,
  variableDeclarator
} = _t;

class ImportBuilder {
  constructor(importedSource, scope, hub) {
    this._statements = [];
    this._resultName = null;
    this._importedSource = void 0;
    this._scope = scope;
    this._hub = hub;
    this._importedSource = importedSource;
  }

  done() {
    return {
      statements: this._statements,
      resultName: this._resultName
    };
  }

  import() {
    this._statements.push(importDeclaration([], stringLiteral(this._importedSource)));

    return this;
  }

  require() {
    this._statements.push(expressionStatement(callExpression(identifier("require"), [stringLiteral(this._importedSource)])));

    return this;
  }

  namespace(name = "namespace") {
    const local = this._scope.generateUidIdentifier(name);

    const statement = this._statements[this._statements.length - 1];

    _assert(statement.type === "ImportDeclaration");

    _assert(statement.specifiers.length === 0);

    statement.specifiers = [importNamespaceSpecifier(local)];
    this._resultName = cloneNode(local);
    return this;
  }

  default(name) {
    const id = this._scope.generateUidIdentifier(name);

    const statement = this._statements[this._statements.length - 1];

    _assert(statement.type === "ImportDeclaration");

    _assert(statement.specifiers.length === 0);

    statement.specifiers = [importDefaultSpecifier(id)];
    this._resultName = cloneNode(id);
    return this;
  }

  named(name, importName) {
    if (importName === "default") return this.default(name);

    const id = this._scope.generateUidIdentifier(name);

    const statement = this._statements[this._statements.length - 1];

    _assert(statement.type === "ImportDeclaration");

    _assert(statement.specifiers.length === 0);

    statement.specifiers = [importSpecifier(id, identifier(importName))];
    this._resultName = cloneNode(id);
    return this;
  }

  var(name) {
    const id = this._scope.generateUidIdentifier(name);

    let statement = this._statements[this._statements.length - 1];

    if (statement.type !== "ExpressionStatement") {
      _assert(this._resultName);

      statement = expressionStatement(this._resultName);

      this._statements.push(statement);
    }

    this._statements[this._statements.length - 1] = variableDeclaration("var", [variableDeclarator(id, statement.expression)]);
    this._resultName = cloneNode(id);
    return this;
  }

  defaultInterop() {
    return this._interop(this._hub.addHelper("interopRequireDefault"));
  }

  wildcardInterop() {
    return this._interop(this._hub.addHelper("interopRequireWildcard"));
  }

  _interop(callee) {
    const statement = this._statements[this._statements.length - 1];

    if (statement.type === "ExpressionStatement") {
      statement.expression = callExpression(callee, [statement.expression]);
    } else if (statement.type === "VariableDeclaration") {
      _assert(statement.declarations.length === 1);

      statement.declarations[0].init = callExpression(callee, [statement.declarations[0].init]);
    } else {
      _assert.fail("Unexpected type.");
    }

    return this;
  }

  prop(name) {
    const statement = this._statements[this._statements.length - 1];

    if (statement.type === "ExpressionStatement") {
      statement.expression = memberExpression(statement.expression, identifier(name));
    } else if (statement.type === "VariableDeclaration") {
      _assert(statement.declarations.length === 1);

      statement.declarations[0].init = memberExpression(statement.declarations[0].init, identifier(name));
    } else {
      _assert.fail("Unexpected type:" + statement.type);
    }

    return this;
  }

  read(name) {
    this._resultName = memberExpression(this._resultName, identifier(name));
  }

}

exports["default"] = ImportBuilder;

/***/ }),
/* 132 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isModule;

function isModule(path) {
  const {
    sourceType
  } = path.node;

  if (sourceType !== "module" && sourceType !== "script") {
    throw path.buildCodeFrameError(`Unknown sourceType "${sourceType}", cannot transform.`);
  }

  return path.node.sourceType === "module";
}

/***/ }),
/* 133 */
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 133;
module.exports = webpackEmptyContext;

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;

var _assert = _interopRequireDefault(__webpack_require__(1));

var _Plugin = _interopRequireDefault(__webpack_require__(42));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default({
  types
}) {
  let plugins = null; // Only for test
  // eslint-disable-next-line no-underscore-dangle

  __webpack_require__.g.__clearBabelAntdPlugin = () => {
    plugins = null;
  };

  function applyInstance(method, args, context) {
    // eslint-disable-next-line no-restricted-syntax
    for (const plugin of plugins) {
      if (plugin[method]) {
        plugin[method].apply(plugin, [...args, context]);
      }
    }
  }

  const Program = {
    enter(path, {
      opts = {}
    }) {
      // Init plugin instances once.
      if (!plugins) {
        if (Array.isArray(opts)) {
          plugins = opts.map(({
            libraryName,
            libraryDirectory,
            style,
            styleLibraryDirectory,
            customStyleName,
            camel2DashComponentName,
            camel2UnderlineComponentName,
            fileName,
            customName,
            transformToDefaultImport
          }, index) => {
            (0, _assert.default)(libraryName, "libraryName should be provided");
            return new _Plugin.default(libraryName, libraryDirectory, style, styleLibraryDirectory, customStyleName, camel2DashComponentName, camel2UnderlineComponentName, fileName, customName, transformToDefaultImport, types, index);
          });
        } else {
          (0, _assert.default)(opts.libraryName, "libraryName should be provided");
          plugins = [new _Plugin.default(opts.libraryName, opts.libraryDirectory, opts.style, opts.styleLibraryDirectory, opts.customStyleName, opts.camel2DashComponentName, opts.camel2UnderlineComponentName, opts.fileName, opts.customName, opts.transformToDefaultImport, types)];
        }
      }

      applyInstance("ProgramEnter", arguments, this); // eslint-disable-line
    },

    exit() {
      applyInstance("ProgramExit", arguments, this); // eslint-disable-line
    }

  };
  const methods = ["ImportDeclaration", "CallExpression", "MemberExpression", "Property", "VariableDeclarator", "ArrayExpression", "LogicalExpression", "ConditionalExpression", "IfStatement", "ExpressionStatement", "ReturnStatement", "ExportDefaultDeclaration", "BinaryExpression", "NewExpression", "ClassDeclaration", "SwitchStatement", "SwitchCase"];
  const ret = {
    visitor: {
      Program
    }
  }; // eslint-disable-next-line no-restricted-syntax

  for (const method of methods) {
    ret.visitor[method] = function () {
      // eslint-disable-line
      applyInstance(method, arguments, ret.visitor); // eslint-disable-line
    };
  }

  return ret;
}
})();

/******/ })()
;