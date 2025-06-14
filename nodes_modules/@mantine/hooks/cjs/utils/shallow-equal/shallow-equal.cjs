'use client';
'use strict';

function shallowEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }
  if (!(a instanceof Object) || !(b instanceof Object)) {
    return false;
  }
  const keys = Object.keys(a);
  const { length } = keys;
  if (length !== Object.keys(b).length) {
    return false;
  }
  for (let i = 0; i < length; i += 1) {
    const key = keys[i];
    if (!(key in b)) {
      return false;
    }
    if (a[key] !== b[key] && !(Number.isNaN(a[key]) && Number.isNaN(b[key]))) {
      return false;
    }
  }
  return true;
}

exports.shallowEqual = shallowEqual;
//# sourceMappingURL=shallow-equal.cjs.map
