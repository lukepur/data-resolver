const resolver = require('../src/resolver');
const { expect } = require('chai');

describe('resolver', () => {
  const context = genTestContext();
  let data;

  beforeEach(() => {
    data = genTestData();
  });

  it('should exist', () => {
    expect(resolver).to.be.a('function');
  });

  describe('resolve resolvableType: literal', () => {
    it('should resolve to the literal value for a string', () => {
      expect(resolver({ resolvableType: 'literal', value: 'a string'})).to.eql('a string');
    });

    it('should resolve to the literal value for a number', () => {
      expect(resolver({ resolvableType: 'literal', value: 1})).to.eql(1);
    });

    it('should resolve to the literal value for a boolean', () => {
      expect(resolver({ resolvableType: 'literal', value: true})).to.eql(true);
      expect(resolver({ resolvableType: 'literal', value: false})).to.eql(false);
    });

    it('should resolve to the literal value for an array', () => {
      expect(resolver({ resolvableType: 'literal', value: [1, 2, 3]})).to.eql([1, 2, 3]);
    });

    it('should resolve to the literal value for an object', () => {
      expect(resolver({ resolvableType: 'literal', value: { a: 'string', b: 1 }})).to.eql({ a: 'string', b: 1});
    });
  });

  describe('resolve resolvableType: lookup', () => {
    describe('$', () => {
      it('should return the root data object', () => {
        expect(resolver({ resolvableType: 'lookup', value: '$'}, data, context, [])).to.eql(genTestData());
      });
    });

    describe('$value', () => {
      it('should return this node\'s value', () => {
        expect(resolver({ resolvableType: 'lookup', value: '$value'}, data, context, ['personal_details', 'name', 'title'])).to.eql('miss');
      });

      it('should return this node\'s value when target is path string', () => {
        expect(resolver({ resolvableType: 'lookup', value: '$value'}, data, context, '$.personal_details.name.title')).to.eql('miss');
      });

      it('should return this node\'s value when in array', () => {
        const result = resolver({resolvableType: 'lookup', value: '$value' }, data, context, ['asset_details', 'assets', '0', 'value']);
        expect(result).to.eql(1000);
      });
    });

    describe('specific pointers', () => {
      it('should return value of node at specific reference', () => {
        const result = resolver({resolvableType: 'lookup', value: '$.personal_details.name.title' }, data, context, []);
        expect(result).to.eql('miss');
      });

      it('should return value of node at specific reference when in array', () => {
        const result = resolver({resolvableType: 'lookup', value: '$.asset_details.assets.0.value' }, data, context, []);
        expect(result).to.eql(1000);
      });
    });

    describe('wildcard (*) pointers', () => {
      it('should return an array of values when array wildcard `*` is used', () => {
        const result = resolver({ resolvableType: 'lookup', value:'$.asset_details.assets.*.value' }, data, context, ['personal_details', 'name', 'last']);
        expect(result).to.eql([1000, 1000000]);
      });

      it('should return an array of values when array wildcard `*` is used multiple times', () => {
        const result = resolver({ resolvableType: 'lookup', value: '$.asset_details.assets.*.depreciations.*' }, data, context, ['personal_details', 'name', 'last']);
        expect(result).to.eql([100, 90, 81, -30000, -50000, -100000]);
      });
    });

    describe('index matching (^) pointers', () => {
      it('should target this node\'s ancestor when ^ is used', () => {
        const result = resolver({ resolvableType: 'lookup', value: '$.asset_details.assets.^.description' }, data, context, ['asset_details', 'assets', '0', 'value']);
        expect(result).to.eql('Robot');
      });

      it('should target correct ancestor paths when multiple ^ are used', () => {
        const result = resolver({ resolvableType: 'lookup', value: '$.previous_applications.items.^.comments.^.message' }, data, context, ['previous_applications', 'items', '0', 'comments', '1', 'author']);
        expect(result).to.eql('Good spot Bob, bad application');
      });
    });

    describe('mixed pointers', () => {
      it('should target correct data when a mix of relative and wildcard markers are used', () => {
        const result = resolver({resolvableType: 'lookup', value: '$.previous_applications.items.^.comments.*.author' }, data, context, ['previous_applications', 'items', '0', 'comments', '0', 'message']);
        expect(result).to.eql(['Bob', 'Jane']);
      });
    });

    describe('invalid pointers', () => {
      it('should throw an error if a lookup value is invalid', () => {
        expect(() => resolver({ resolvableType: 'lookup', value: '$$' })).to.throw(TypeError, 'Unresolvable lookup value: $$');
      });
    });
  });

  describe('resolve resolvableType: fn', () => {
   it('should return the result of running a function', () => {
      const resolvable = {
        resolvableType: 'fn',
        value: 'noArgFunc'
      };
      const result = resolver(resolvable, data, context, []);
      expect(result).to.eql('noArgFunc');
    });

    it('should return the result of running a function over the value of a data pointer', () => {
      const resolvable = {
        resolvableType: 'fn',
        value: 'oneArgFunc',
        args: [ { resolvableType: 'lookup', value: '$.personal_details.name.title' } ]
      };
      const result = resolver(resolvable, data, context, []);
      expect(result).to.eql('arg: miss');
    });

    it('should resolve nested resolvables', () => {
      const resolvable = {
        resolvableType: 'fn',
        value: 'oneArgFunc',
        args: [
          {
            resolvableType: 'fn',
            value: 'noArgFunc'
          }
        ]
      };
      const result = resolver(resolvable, data, context, []);
      expect(result).to.eql('arg: noArgFunc');
    }); 
  });

  describe('resolve resolvableType: fnRefLookup', () => {
    it('should return a reference to the named context function', () => {
      const resolvable = {
        resolvableType: 'fnRefLookup',
        value: 'oneArgFunc'
      };
      const result = resolver(resolvable, data, context, []);
      expect(result).to.be.a('function');
    });

    it('should return null if fnRef cannot be found in the context', () => {
      const resolvable = {
        resolvableType: 'fnRefLookup',
        value: 'nonExistent'
      };
      const result = resolver(resolvable, data, context, []);
      expect(result).to.be.null;
    });
  });

  describe('resolve resolvableType: fnRefResolve', () => {
    it('should return a reference to a function returned by resolving a resolvable', () => {
      const resolvable = {
        resolvableType: 'fnRefResolve',
        value: {
          resolvableType: 'fn',
          value: 'funcFactory',
          args: [ { resolvableType: 'literal', value: 'argToFuncFactory' } ]
        }
      };
      const result = resolver(resolvable, data, context, []);
      expect(result).to.be.a('function');
    });

    it('should throw an err if resolvable contains a nested invalid lookup', () => {
      const resolvable = {
        resolvableType: 'fnRefResolve',
        value: {
          resolvableType: 'fn',
          value: 'oneArgFunc',
          args: [ {resolvableType: 'lookup', value: 'my fnRef' } ]
        }
      };
      expect(() => resolver(resolvable, data, context, [])).to.throw(TypeError, 'Unresolvable lookup value: my fnRef');
    });
  });

  describe('Resolve arrays', () => {
    it('should return an empty array for resolving an empty array', () => {
      expect(resolver([], data, context, [])).to.eql([]);
    });

    it('should return an array with all items resolved when all members are valid resolvables', () => {
      const resolvable = [
        { resolvableType: 'literal', value: 1 },
        { resolvableType: 'lookup', value: '$' },
        { resolvableType: 'lookup', value: '$value' }
      ];
      const result = resolver(resolvable, data, context, '$.personal_details.name.title');
      expect(result).to.eql([1, genTestData(), 'miss']);
    });

    it('should return an array with non-resolvables alongside resolved values when members are a mix of resolvable and non-resolvable', () => {
      const resolvable = [
        { resolvableType: 'literal', value: 1 },
        'a string',
        { resolvableType: 'lookup', value: '$' },
        { resolvableType: 'lookup', value: '$value' }
      ];
      const result = resolver(resolvable, data, context, '$.personal_details.name.title');
      expect(result).to.eql([1, 'a string', genTestData(), 'miss']);
    });
  });

  describe('Resolve object members', () => {
    it('should return an empty object for resolving an empty object', () => {
      expect(resolver({}, data, context, [])).to.eql({});
    });

    it('should return an object with all members resolved when all members are valid resolvables', () => {
      const resolvable = {
        a: { resolvableType: 'literal', value: 1 },
        b: { resolvableType: 'lookup', value: '$' },
        c: { resolvableType: 'lookup', value: '$value' }
      };
      const result = resolver(resolvable, data, context, '$.personal_details.name.title');
      expect(result).to.eql({a: 1, b: genTestData(), c: 'miss'});
    });

    it('should return an object with all resolvable members resolved when some members are valid resolvables', () => {
      const resolvable = {
        a: { resolvableType: 'literal', value: 1 },
        b: 'a string',
        c: { resolvableType: 'lookup', value: '$' },
        d: { resolvableType: 'lookup', value: '$value' }
      };
      const result = resolver(resolvable, data, context, '$.personal_details.name.title');
      expect(result).to.eql({a: 1, b: 'a string', c: genTestData(), d: 'miss'});
    });
  });
});

function genTestContext() {
  return {
    noArgFunc: function () { return 'noArgFunc'; },
    oneArgFunc: function (arg1) { return 'arg: ' + arg1; },
    funcFactory: function(arg1) { return function() { return 'factory for: ' + arg1; }}
  };
}

function genTestData() {
  return {
    personal_details: {
      name: {
        title: 'miss',
        last: 'Smith'
      },
      contact_numbers: ['123', '456']
    },
    asset_details: {
      assets: [
        { value: 1000, description: 'Robot', depreciations: [100, 90, 81] },
        { value: 1000000, description: 'Part ownership of studio apartment in London', depreciations: [-30000, -50000, -100000] }
      ]
    },
    previous_applications: {
      items: [
        {
          date: '01/01/2013',
          comments: [
            {
              author: 'Bob',
              message: 'A bit fishy, escalating'
            },
            {
              author: 'Jane',
              message: 'Good spot Bob, bad application'
            }
          ],
          status: 'rejected'
        },
        {
          date: '01/01/2016',
          comments: [
            {
              author: 'Jane',
              message: 'Approved'
            }
          ],
          status: 'approved'
        }
      ]
    }
  };
}
