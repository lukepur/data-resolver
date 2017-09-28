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
  },

  {
    id: 'actors_in_multiple_movies',
    resolvable: {
      resolvableType: 'fn',
      value: 'keys',
      args: [
        {
          resolvableType: 'fn',
          value: 'pickBy',
          args: [
            {
              resolvableType: 'fn',
              value: 'groupBy',
              args: [
                {
                  resolvableType: 'fn',
                  value: 'flatten',
                  args: [{ resolvableType: 'lookup', value: '$.movies.*.actors' }]
                }
              ]
            },
            {
              resolvableType: 'fn',
              value: 'overArgs',
              args: [
                {
                  resolvableType: 'fn',
                  value: 'partial',
                  args: [
                    { resolvableType: 'fnRefLookup', value: 'gt' },
                    { resolvableType: 'fnRefLookup', value: '_' },
                    { resolvableType: 'literal', value: 1 }
                  ]
                },
                {
                  resolvableType: 'fn',
                  value: 'partial',
                  args: [
                    { resolvableType: 'fnRefLookup', value: 'get' },
                    { resolvableType: 'fnRefLookup', value: '_' },
                    { resolvableType: 'literal', value: 'length' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },

  {
    id: 'movies_with_shared_actors',
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
                { resolvableType: 'fnRefLookup', value: 'gt' },
                { resolvableType: 'fnRefLookup', value: '_' },
                { resolvableType: 'literal', value: 0 }
              ]
            },
            {
              resolvableType: 'fn',
              value: 'overArgs',
              args: [
                {
                  resolvableType: 'fn',
                  value: 'partial',
                  args: [
                    { resolvableType: 'fnRefLookup', value: 'get' },
                    { resolvableType: 'fnRefLookup', value: '_' },
                    { resolvableType: 'literal', value: 'length' }
                  ]
                },
                {
                  resolvableType: 'fn',
                  value: 'overArgs',
                  args: [
                    {
                      resolvableType: 'fn',
                      value: 'partial',
                      args: [
                        {
                          resolvableType: 'fnRefLookup',
                          value: 'intersection'
                        },
                        {
                          resolvableType: 'fnRefLookup',
                          value: '_'
                        },
                        {
                          resolvableType: 'fn', // This resolvable is identical to actors_in_multiple_movies
                          value: 'keys',
                          args: [
                            {
                              resolvableType: 'fn',
                              value: 'pickBy',
                              args: [
                                {
                                  resolvableType: 'fn',
                                  value: 'groupBy',
                                  args: [
                                    {
                                      resolvableType: 'fn',
                                      value: 'flatten',
                                      args: [{ resolvableType: 'lookup', value: '$.movies.*.actors' }]
                                    }
                                  ]
                                },
                                {
                                  resolvableType: 'fn',
                                  value: 'overArgs',
                                  args: [
                                    {
                                      resolvableType: 'fn',
                                      value: 'partial',
                                      args: [
                                        { resolvableType: 'fnRefLookup', value: 'gt' },
                                        { resolvableType: 'fnRefLookup', value: '_' },
                                        { resolvableType: 'literal', value: 1 }
                                      ]
                                    },
                                    {
                                      resolvableType: 'fn',
                                      value: 'partial',
                                      args: [
                                        { resolvableType: 'fnRefLookup', value: 'get' },
                                        { resolvableType: 'fnRefLookup', value: '_' },
                                        { resolvableType: 'literal', value: 'length' }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      resolvableType: 'fn',
                      value: 'partial',
                      args: [
                        { resolvableType: 'fnRefLookup', value: 'get' },
                        { resolvableType: 'fnRefLookup', value: '_' },
                        { resolvableType: 'literal', value: 'actors' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }
];
