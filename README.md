# data-resolver
A small module for resolving values, paths (relative and absolute) and arbitrarily complex functions across a data structure and computation context.

## Why
On first inspection, the resolvable concept may seem overly verbose and more complicated than simply programmatically achieving the same outcomes. However the motivation is that once a solid library of context functions is created, then advanced tooling could be used to build arbitrarily complex data transformations or queries at runtime (and without code modifications).

This could further be enhanced to build a user system that manages such transformations and queries against a large data store to provide fast, dynamic solutions to fluid business questions.

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

### Resolve function parameters
The parameters are as follows:

| Param | Description |
|---|---|
| `resolvable` | The description of how to resolve this value. See the [resolvable section](#resolvable) for details |
| `data` | The data context to perform the resolve. This is a plain old javascript object |
| `context` | The context to perform function lookups for `fn` and `fnRefLookup` resolution. This is simply an object with function members |
| `targetPath` | The path of the data node to use as the reference point for relative resolve paths. Defaults to root of data object. Can be specified as a `.` delimited path, or an array of strings representing the property hierarchy. |

Simple example:

```
const resolve = require('data-resolver');

const data = {
  a: 1,
  b: {
    b1: 'b1',
    b2: 2
  }
};

const ctx = {
  add: (a, b) => a + b
};

let result = resolve({
  resolvableType: 'fn',
  value: 'add',
  args: [
    { resolvableType: 'lookup', value: '$.a' },
    { resolvableType: 'lookup', value: '$.b.b2' }
  ]
}, data, ctx);

// result -> 3
```

## Resolvable
A 'resolvable' is a serializable object with specific properties to describe how to resolve a value at runtime, in the context of a data object and optional relative path.

### Resolvable structure
A 'resolvable' has the following structure:

```
{
  resolvableType: 'literal' | 'lookup' | 'fn' | 'fnRefLookup',
  value: Any (althoug constraints apply depending on the 'resolvableType'),
  args: Array (array of values or resolvables. Only applicable for 'fn' resolvableType)
}
```

### resolvableType
How each 'resolvableType' is resolved is described below.
| resolvableType | Description |
|---|---|
`literal` | The value provided in the `value` property is returned unchanged. This is the same result as would occur if the value was provided instead of a resolvable.
`lookup` | The value provided in the `value` property of the resolvable is used to extract specific data from the data context. It must be a string. See [Lookup Rules](#lookup-rules) for more details.
`fn` | The value provided in the `value` property of the resolvable must be a string that points to the member name of a function in the [`context`](#resolve-function-parameters). The optional `args` array is used to specify the arguments which are passed to the target `fn` at resolve time. Each `arg` item can be a literal or a resolvable. See [fn resolvables](#fn-resolvables) for more information.
`fnRefLookup` | The value provided in the `value` property of the resolvable must be a string that points to the member name of a function in the [`context`](#resolve-function-parameters). Unlike `fn`, the function is not invoked with `args`, but rather returns a reference to the function. This is useful, for example, to indicate an iteratee for a map `fn`. See [fnRef resolvables](#fnref-resolvables) for more information.

### Lookup Rules
The string provided as the `value` property for a lookup resolvable is used to extract specific data from the complete data context. This mechanism can target specific properties (of any type) as well as use relative references to target data related to a specific subset. Furthermore, wildcard selection allows collecting related data from across multiple entities. The special characters used to define a path are detailed below. The result column is what would be returned if the [Example Data Structure](#example-data-structure) was used as the data context for the example usages.

| Character | Description | Example usage | Result |
|---|---|----|--- |
| `$` | Root data pointer. Returns the entire data context | `$` | `{ movies: [ ...all movie data ] }` |
| `.` | Path separator. Used to indicate the path to take through the data context | `$.movies.1.name` | `'Snatch'` |
| `*` | Wildcard indicator. Used to collect all same-level array values into the resolved value. Can occur multiple times. | `$.movies.*.actors.*` | `['Arnold Schawarzenegger', 'Linda Hamilton', 'Brad Pitt', 'Jason Statham', 'Brad Pitt', 'Christoph Waltz', 'Christian Bale', 'Jared Leto']` |
| `^` | Relative path indicator. Used in conjunction with the `targetPath` to refer to sibling data. | `$.movies.^.year` assuming the target path is `['movies', 1, 'name']` | `2000` |

### fn resolvables
`fn` resolvables provide a mechanism for invoking functions over specific data to compute the resolved value. Used in conjuction with `lookup`s and `fnRef`s, this provides a powerful way to transform data in arbitrarily complex ways. Note that if an `fn` resolvable returns a function (e.g. it is a function factory) then it is a function reference rather than a value. This allows function factories to be used to, for example, build custom iteratees for collection maps.

#### fn examples
The examples below relate to the [example data and context](#example-data-structure).

<table>
  <thead>
    <tr>
      <th>Description</th>
      <th>Resolvable</th>
      <th>Result</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Get the set of all actors across all movies</td>
      <td><pre>{ 
  resolvableType: 'fn',
  value: 'uniq',
  args: [
    {
      resolvableType: 'lookup',
      value: '$.movies.*.actors'
    }
  ]
}</pre></td>
      <td><code>['Arnold Schawarzenegger', 'Linda Hamilton', 'Jason Statham', 'Brad Pitt', 'Christoph Waltz', 'Christian Bale', 'Jared Leto']</code></td>
    </tr>
    <tr>
      <td>Get the latest movie</td>
      <td><pre>{ 
  resolvableType: 'fn',
  value: 'arrayMax',
  args: [
    {
      resolvableType: 'lookup',
      value: '$.movies.*.year'
    }
  ]
}</pre></td>
      <td><pre>{
  name: 'Inglorious Basterds',
  year: 2008,
  directors: 'Quentin Tarantino',
  actors: ['Brad Pitt', 'Christoph Waltz']
}</pre></td>
    </tr>
  </tbody>
</table>

### fnRefLookup resolvables
`fnRefLookup` resolvables provide a mechanism for obtaining a reference to a function in the `context`. This is generally useful for providing collection iteratees to collection `fn`s. `fnRefLookup` simply returns a reference to a function by name in the `context`.

#### fnRef examples
The examples below relate to the [example data and context](#example-data-structure).

<table>
  <thead>
    <tr>
      <th>Description</th>
      <th>Resolvable</th>
      <th>Result</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Get the set of all actors in movies before 2000</td>
      <td><pre>{ 
  resolvableType: 'fn',
  value: 'uniq',
  args: [
    {
      resolvableType: 'fn',
      value: 'pick',
      args: [
        {
          resolvableType: 'fn',
          value: 'filter',
          args: [
            {
              resolvableType: 'lookup',
              value: '$.movies.*
            },
            {
              resolvableType: 'fn',
              value: 'propLessThanFactory',
              args: [2000, 'year']
            }
          ]
        },
        'actors'
      ]
    }
  ]
}</pre></td>
      <td><code>['Arnold Schawarzenegger', 'Linda Hamilton']</code></td>
    </tr>
  </tbody>
</table>

#### Example data structure

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

#### Example context

```
const ctx = {
  uniq: (array) => { /* array unique implementation */},
  filter: (array, filterFn) => { /* array filter implementation */},
  pick: (array, prop) => { /* return array of props */}
  propLessThanFactory: (target, prop) => item => item[prop] < target,
  arrayMax: (array) => { /* return max value in array */}
};
```
