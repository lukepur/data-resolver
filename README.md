# data-resolver
A small module for resolving values, paths (relative and absolute) and arbitrarily complex functions across a data structure and computation context.

## Installation
```
npm i -S data-resolver
```

## Usage
The primary resolve function has the following signature:

```
const resolve = require('data-resolver');

let resolved = resolve(resolvable, data, context, targetPath);
```

The parameters are as follows:

| Param | Description |
|-|-|
| `resolvable` | The desription of how to resolve this value. See the [resolvable section](#resolvable) for details |
| `data` | The data context to perform the resolve. This is a plain old javascript object |
| `context` | The context to perform function lookups for `fn` resolution. This is simply an object with function members |
| `targetPath` | The  |
Purely functional:

```
const resolve = require('data-resolver');

const data = {
  a: 1,
  b: {
    b1: 'b1',
    b2: [1,2,3]
  }
};

const ctx = {
  add: (args) => args.reduce((memo, item) => memo + item), 0)
};

let result = resolve({
  fn: add,
  args: [
    $.a,
    $.b.b2
  ]
}, data, ctx);
```
