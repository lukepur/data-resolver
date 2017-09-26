const traverse = require('traverse');

const { get, transform, isEqual } = require('lodash');

const { getDataPathsForRefPath } = require('./util/path-utils');

const resolvableFnProp = 'value';
const refFnProp = 'value';
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
  throw new TypeError(`Unresolvable lookup value: ${string}`);
}

module.exports = function resolve(resolvable, data, context, targetPath) {
  switch (resolvable.resolvableType) {
    case 'literal':
      return resolvable.value;
    case 'lookup':
      return resolveString(resolvable.value, data, context, targetPath);
    case 'fn':
      const args = (Array.isArray(resolvable[argsProp]) ? resolvable[argsProp] : []);
      return context[resolvable[resolvableFnProp]]
        .apply(null, args.map(arg => resolve(arg, data, context, targetPath)));
    case 'fnRefLookup':
      const fnRef = context[resolvable[refFnProp]];
      if (typeof fnRef === 'function') {
        return context[resolvable[refFnProp]];
      }
      return null;
    case 'fnRefResolve':
      // Resolve the value and check if it is a function
      const result = resolve(resolvable[resolvableFnProp], data, context, targetPath);
      return (typeof result === 'function' ? result : null);
  }

  if (Array.isArray(resolvable)) {
    return resolvable.map(item => resolve(item, data, context, targetPath));
  }

  if (typeof resolvable === 'object') {
    return transform(resolvable, (memo, value, prop) => {
      memo[prop] = resolve(value, data, context, targetPath);
      return memo;
    }, {});
  }

  return resolvable;
}
