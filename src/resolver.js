const traverse = require('traverse');

const { get, transform, isEqual } = require('lodash');

const { getDataPathsForRefPath } = require('./util/path-utils');

const resolvableFnProp = 'fn';
const refFnProp = 'fnRef';
const argsProp = 'args';

function collectArrayValues(pathStr, data) {
  const results = [];
  const dataPaths = getDataPathsForRefPath(pathStr, data);
  dataPaths.forEach(path => {
    results.push(get(data, path));
  });
  return results;
}

function applyRelativeIndexes(pathStr = '', targetPath = []) {
  const pathArr = pathStr.split('.');
  return pathArr.map((token, index) => {
    if (token === '^') {
      return targetPath[index];
    }
    return token;
  }).join('.');
}

function normalizePathNotation (path) {
  if (typeof path === 'string') {
    return path.replace('$.', '').split('.');
  }
  return path;
}

function resolveString(string, data, context = {}, _targetPath) {
  // normalize targetPath to array notation
  let targetPath = normalizePathNotation(_targetPath);

  if (string === '$value') {
    if (targetPath) {
      return get(data, targetPath);
    }
    console.warn('$value specified, but no targetPath defined');
  }
  // Root data pointer
  if (string === '$') {
    return data;
  }
  // Special case: escape leading '$' with '$$'
  if (string.indexOf('$$') > -1) {
    return string.replace('$$', '$');
  }
  if (string.indexOf('$.') === 0) {
    let pathStr = string;
    if (pathStr.indexOf('^') !== -1) {
      pathStr = '$.' + applyRelativeIndexes(pathStr.replace('$.', ''), targetPath);
    }
    if (pathStr.indexOf('*') !== -1) {
      return collectArrayValues(pathStr, data);
    }
    return get(data, pathStr.replace('$.', ''));
  }
  return string;
}

function validateResolvable (resolvable) {
  // null/undefined
  if (resolvable === null) throw new TypeError('Cannot resolve a null value. Please see documentation for correct resolvable format');
  if (resolvable === undefined) throw new TypeError('Cannot resolve an undefined value. Please see documentation for correct resolvable format');

  // string, number and boolean cannot be directly resolved
  const INVALID_TYPES = ['string', 'number', 'boolean'];
  const resolvableType = typeof resolvable;
  if (INVALID_TYPES.indexOf(resolvableType) > -1) {
    throw new TypeError(`Cannot resolve a value of type "${resolvableType}". Please see documentation for correct resolvable format`);
  }

  if (resolvableType === 'object') {
    const type = resolvable.type;
    const value = resolvable.value;
    const args = resolvable.args;

    if (!type) {
      throw new TypeError(`Cannot resolve an object which does not have a "type" property. Please see documentation for correct resolvable format`);
    }
    
    if (value === undefined || value === null) {
      throw new TypeError(`Cannot resolve an object which does not have a "value" property. Please see documentation for correct resolvable format`);
    }

    const valueType = typeof resolvable.value;
    if (type === 'lookup' && valueType !== 'string') {
      throw new TypeError(`Cannot resolve an object with a non-string value when type is lookup. Please see documentation for correct resolvable format`);
    }

    if (type === 'fn') {
      if (valueType !== 'string') {
        throw new TypeError(`Cannot resolve an object with a non-string value when type is fn. Please see documentation for correct resolvable format`);
      }
      
      if (args) {
        if (!Array.isArray(args)) {
          throw new TypeError(`Cannot resolve an object with a non-string value when type is fn. Please see documentation for correct resolvable format`);
        }
      }
    }

    if (type === 'fnRefLookup' && valueType !== 'string') {
      throw new TypeError(`Cannot resolve an object with a non-string value when type is fnRefLookup. Please see documentation for correct resolvable format`);
    }

    if (type === 'fnRefResolve') {
      try {
        validateResolvable(value);
      } catch (e) {
        throw new TypeError(`Cannot resolve an object with a non-resolvable value when type is fnRefResolve. Please see documentation for correct resolvable format`);
      }
    }
  }
}

module.exports = function resolve(resolvable, data, context, targetPath) {
  // Validate resolvable
  validateResolvable(resolvable);

  switch (resolvable.type) {
    case 'literal':
      return resolvable.value;
  }
  // validateResolvable will throw a TypeError if resolvable is invalid

  // if (typeof context[resolvable[resolvableFnProp]] === 'function') {
  //   const args = (Array.isArray(resolvable[argsProp]) ? resolvable[argsProp] : []);
  //   return context[resolvable[resolvableFnProp]]
  //     .apply(null, args.map(arg => resolve(arg, data, context, targetPath)));
  // }
  // if (resolvable[refFnProp] !== undefined) {
  //   const fnRef = context[resolvable[refFnProp]];
  //   if (typeof fnRef === 'function') {
  //     return context[resolvable[refFnProp]];
  //   }
  //   const result = resolve(resolvable[refFnProp], data, context, targetPath);
  //   return (typeof result === 'function' ? result : null);
  // }
  // if (typeof resolvable === 'string') {
  //   return resolveString(resolvable, data, context, targetPath);
  // }
  // if (Array.isArray(resolvable)) {
  //   return resolvable.map(item => resolve(item, data, context, targetPath));
  // }
  // if (typeof resolvable === 'object') {
  //   return transform(resolvable, (memo, value, prop) => {
  //     memo[prop] = resolve(value, data, context, targetPath);
  //     return memo;
  //   }, {});
  // }
}
