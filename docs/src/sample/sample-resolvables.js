export default () => [
  {
    id: 'movies_before_2000',
    resolvable: {
      resolvableType: 'fn',
      value: 'filter',
      args: [
        { resolvableType: 'lookup', value: '$.movies.*' },
        {
          resolvableType: 'fn',
          value: 'overArgs',
          args: [
            {
              resolvableType: 'fn',
              value: 'partial',
              args: [
                { resolvableType: 'fnRefLookup', value: 'lt' },
                { resolvableType: 'fnRefLookup', value: '_' },
                { resolvableType: 'literal', value: 2000 }
              ]
            },
            {
              resolvableType: 'fn',
              value: 'partial',
              args: [
                { resolvableType: 'fnRefLookup', value: 'get' },
                { resolvableType: 'fnRefLookup', value: '_' },
                { resolvableType: 'literal', value: 'year' }
              ]
            }
          ]
        }
      ]
    }
  }
];
