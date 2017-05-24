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
| String | Equals '$$' | Returns the root data value | `resolve('$$', dataStructure, ctx) --> dataStructure` |
| String | Equals '$$value' | Returns the data value at target path | `resolve('$$value', dataStructure, ctx, '$$.movies[0].name') --> 'The Terminator'` |
| String | Starts with '$$.' | Returns the value at absolute path | `resolve('$$.movies[0].name', dataStructure, ctx) --> 'The Terminator'` |
| String | Starts with '$$.' and contains '*' | Returns the value at absolute path, collecting any array items at wildcard (*) depth | `resolve('$$.movies[*].name', dataStructure, ctx) --> ['The Terminator', 'Snatch', 'Inglorious Basterds', 'American Psycho']`<br>Multiple wildcards:<br> `resolve('$$.movies[*].actors[*], dataStructure, ctx) --> ['Arnold Schwarzenegger', 'Linda Hamilton', 'Brad Pitt', 'Jason Statham', 'Brad Pitt', Christoph Waltz', 'Christian Bale', 'Jared Leto']` |