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
| `targetPath` | The path of the data node to use as the reference point for relative resolve paths. Defaults to root of data object |

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

## Resolvable
A 'resolvable' is a serializable value (string, object or array) which will be transformed (i.e. resolved) into another value.

Consider the following demo data structure:

```
const dataStructure = {
  movies: [
    {
      name: 'The Terminator'
      year: 1984,
      director: 'James Cameron',
      actors: ['Arnold Schwarzenegger', 'Linda Hamilton']
    },
    {
      name: 'Snatch',
      year: 2000,
      director: 'Guy Ritchie',
      actors: ['Brad Pitt', 'Jason Statham']
    },
    {
      name: 'Inglorious Basterds',
      year: 2008,
      director: 'Quentin Tarantino',
      actors: ['Brad Pitt', 'Christoph Waltz']
    },
    {
      name: 'American Psycho',
      year: 2000,
      director: 'Mary Harron',
      actors: ['Christian Bale', 'Jared Leto']
    }
  ]
};
```

and the following computation context:

```
const ctx = {

};
```

How a value is resolved is determined according to the following rules:

| Type | Condition | How resolved | Example |
|-|-|-|-|
| String | Equals '$' | Returns the root data value | `resolve('$$', dataStructure, ctx) --> dataStructure` |
| String | Equals '$value' | Returns the data value at target path | `resolve('$$value', dataStructure, ctx, '$$.movies[0].name') --> 'The Terminator'` |
| String | Starts with '$.' | Returns the value at absolute path | `resolve('$$.movies[0].name', dataStructure, ctx) --> 'The Terminator'` |
| String | Starts with '$.' and contains '*' | Returns the value at absolute path, collecting any array items at wildcard (*) depth | `resolve('$$.movies[*].name', dataStructure, ctx) --> ['The Terminator', 'Snatch', 'Inglorious Basterds', 'American Psycho']`<br>Multiple wildcards:<br> `resolve('$$.movies[*].actors[*], dataStructure, ctx) --> ['Arnold Schwarzenegger', 'Linda Hamilton', 'Brad Pitt', 'Jason Statham', 'Brad Pitt', Christoph Waltz', 'Christian Bale', 'Jared Leto']` |

## Example resolves
```
resolve('$', data, ctx) -> data

resolve('$.', data, ctx) -> Invalid path error

resolve('$$', data, ctx) -> "$" (special case if need to resolve literal '$')

resolve('string', data, ctx) -> "string" (strings not starting with "$" or "^" resolve as that string literal)

resolve(1, data, ctx) -> 1 (numbers resolve as numbers)

resolve({fn: name, args: [...]}, data, ctx) -> result of running 'name' over args (args are each recursively resolved as well)

resolve({a: 1, b: '$'}, data, ctx) -> {a: 1, b : data} (i.e. if object does not have fn or fnRef prop, each member of object is recursively resolved)

resolve([1, {fn: name, args: [1, '$.prop']}, 'test', '$']) -> [1, <result of name(1, <val at $.prop>)>, 'test', data] (i.e. each array member is resolved)
```
