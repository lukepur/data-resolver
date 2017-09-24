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

module.exports = function resolve(resolvable, data, context, targetPath) {
  // Validate resolvable

  switch (resolvable.type) {
    case 'literal':
      return resolvable.value;
  }
}
