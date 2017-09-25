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

  describe('resolvable validation', () => {
    it('should fail validation for null', () => {
      expect(() => resolver(null, {}, context, [])).to.throw(TypeError, 'Cannot resolve a null value. Please see documentation for correct resolvable format');
    });

    it('should fail validation for undefined', () => {
      expect(() => resolver(undefined, {}, context, [])).to.throw(TypeError, 'Cannot resolve an undefined value. Please see documentation for correct resolvable format');
    });

    it('should fail validation for string', () => {
      expect(() => resolver('string', {}, context, [])).to.throw(TypeError, 'Cannot resolve a value of type "string". Please see documentation for correct resolvable format');
    });
    
    it('should fail validation for number', () => {
      expect(() => resolver(1, {}, context, [])).to.throw(TypeError, 'Cannot resolve a value of type "number". Please see documentation for correct resolvable format');
    });

    it('should fail validation for bool', () => {
      expect(() => resolver(true, {}, context, [])).to.throw(TypeError, 'Cannot resolve a value of type "boolean". Please see documentation for correct resolvable format');
    });

    it('should fail validation for an object with no "type" property', () => {
      expect(() => resolver({ a: 'something' }, {}, context, [])).to.throw(TypeError, 'Cannot resolve an object which does not have a "type" property. Please see documentation for correct resolvable format');
    });

    it('should fail validation for an object with no "value" property', () => {
      expect(() => resolver({ type: 'literal' }, {}, context, [])).to.throw(TypeError, 'Cannot resolve an object which does not have a "value" property. Please see documentation for correct resolvable format');
    });

    it('should fail validation for an object when value is not string if type is lookup', () => {
      expect(() => resolver({ type: 'lookup', value: {} }, {}, context, [])).to.throw(TypeError, 'Cannot resolve an object with a non-string value when type is lookup. Please see documentation for correct resolvable format');
    });

    it('should fail validation for an object when value is not string if type is fn', () => {
      expect(() => resolver({ type: 'fn', value: {} }, {}, context, [])).to.throw(TypeError, 'Cannot resolve an object with a non-string value when type is fn. Please see documentation for correct resolvable format');
    });

    it('should fail validation for an object when value is not string if type is fn', () => {
      expect(() => resolver({ type: 'fn', value: {} }, {}, context, [])).to.throw(TypeError, 'Cannot resolve an object with a non-string value when type is fn. Please see documentation for correct resolvable format');
    });

    it('should fail validation for an object when value is not string if type is fnRefLookup', () => {
      expect(() => resolver({ type: 'fnRefLookup', value: {} }, {}, context, [])).to.throw(TypeError, 'Cannot resolve an object with a non-string value when type is fnRefLookup. Please see documentation for correct resolvable format');
    });

    it('should fail validation for an object when value is not resolvable if type is fnRefResolve', () => {
      expect(() => resolver({ type: 'fnRefResolve', value: {} }, {}, context, [])).to.throw(TypeError, 'Cannot resolve an object with a non-resolvable value when type is fnRefResolve. Please see documentation for correct resolvable format');
    });

    it('should fail validation for an array if at least one of the members is not a valid resolvable', () => {
      expect(() => resolver(['a string'], {}, context, [])).to.throw(TypeError, 'Cannot resolve an array if any of the members are not resolvable. Please see documentation for correct resolvable format');
    });
  });

  describe('resolve type: literal', () => {
    it('should resolve to the literal value for a string', () => {
      expect(resolver({ type: 'literal', value: 'a string'})).to.eql('a string');
    });

    it('should resolve to the literal value for a number', () => {
      expect(resolver({ type: 'literal', value: 1})).to.eql(1);
    });

    it('should resolve to the literal value for a boolean', () => {
      expect(resolver({ type: 'literal', value: true})).to.eql(true);
      expect(resolver({ type: 'literal', value: false})).to.eql(false);
    });

    it('should resolve to the literal value for an array', () => {
      expect(resolver({ type: 'literal', value: [1, 2, 3]})).to.eql([1, 2, 3]);
    });

    it('should resolve to the literal value for an object', () => {
      expect(resolver({ type: 'literal', value: { a: 'string', b: 1 }})).to.eql({ a: 'string', b: 1});
    });
  });

  describe('resolve type: lookup', () => {
    describe('$', () => {
      it('should return the root data object', () => {
        expect(resolver({ type: 'lookup', value: '$'}, data, context, [])).to.eql(genTestData());
      });
    });

    describe('$value', () => {
      it('should return this node\'s value', () => {
        expect(resolver({ type: 'lookup', value: '$value'}, data, context, ['personal_details', 'name', 'title'])).to.eql('miss');
      });

      it('should return this node\'s value when target is path string', () => {
        expect(resolver({ type: 'lookup', value: '$value'}, data, context, '$.personal_details.name.title')).to.eql('miss');
      });

      it('should return this node\'s value when in array', () => {
        const result = resolver({type: 'lookup', value: '$value' }, data, context, ['asset_details', 'assets', '0', 'value']);
        expect(result).to.eql(1000);
      });
    });

    describe('specific pointers', () => {
      it('should return value of node at specific reference', () => {
        const result = resolver({type: 'lookup', value: '$.personal_details.name.title' }, data, context, []);
        expect(result).to.eql('miss');
      });

      it('should return value of node at specific reference when in array', () => {
        const result = resolver({type: 'lookup', value: '$.asset_details.assets.0.value' }, data, context, []);
        expect(result).to.eql(1000);
      });
    });

    describe('wildcard (*) pointers', () => {
      it('should return an array of values when array wildcard `*` is used', () => {
        const result = resolver({ type: 'lookup', value:'$.asset_details.assets.*.value' }, data, context, ['personal_details', 'name', 'last']);
        expect(result).to.eql([1000, 1000000]);
      });

      it('should return an array of values when array wildcard `*` is used multiple times', () => {
        const result = resolver({ type: 'lookup', value: '$.asset_details.assets.*.depreciations.*' }, data, context, ['personal_details', 'name', 'last']);
        expect(result).to.eql([100, 90, 81, -30000, -50000, -100000]);
      });
    });

    describe('index matching (^) pointers', () => {
      it('should target this node\'s ancestor when ^ is used', () => {
        const result = resolver({ type: 'lookup', value: '$.asset_details.assets.^.description' }, data, context, ['asset_details', 'assets', '0', 'value']);
        expect(result).to.eql('Robot');
      });

      it('should target correct ancestor paths when multiple ^ are used', () => {
        const result = resolver({ type: 'lookup', value: '$.previous_applications.items.^.comments.^.message' }, data, context, ['previous_applications', 'items', '0', 'comments', '1', 'author']);
        expect(result).to.eql('Good spot Bob, bad application');
      });
    });

    describe('mixed pointers', () => {
      it('should target correct data when a mix of relative and wildcard markers are used', () => {
        const result = resolver({type: 'lookup', value: '$.previous_applications.items.^.comments.*.author' }, data, context, ['previous_applications', 'items', '0', 'comments', '0', 'message']);
        expect(result).to.eql(['Bob', 'Jane']);
      });
    });
  });

  describe('resolve type: fn', () => {
   it('should return the result of running a function', () => {
      const resolvable = {
        type: 'fn',
        value: 'noArgFunc'
      };
      const result = resolver(resolvable, data, context, []);
      expect(result).to.eql('noArgFunc');
    });

    it('should return the result of running a function over the value of a data pointer', () => {
      const resolvable = {
        type: 'fn',
        value: 'oneArgFunc',
        args: [ { type: 'lookup', value: '$.personal_details.name.title' } ]
      };
      const result = resolver(resolvable, data, context, []);
      expect(result).to.eql('arg: miss');
    });

    it('should resolve nested resolvables', () => {
      const resolvable = {
        type: 'fn',
        value: 'oneArgFunc',
        args: [
          {
            type: 'fn',
            value: 'noArgFunc'
          }
        ]
      };
      const result = resolver(resolvable, data, context, []);
      expect(result).to.eql('arg: noArgFunc');
    }); 
  });

  describe('resolve type: fnRefLookup', () => {
    it('should return a reference to the named context function', () => {
      const resolvable = {
        type: 'fnRefLookup',
        value: 'oneArgFunc'
      };
      const result = resolver(resolvable, data, context, []);
      expect(result).to.be.a('function');
    });

    it('should return null if fnRef cannot be found in the context', () => {
      const resolvable = {
        type: 'fnRefLookup',
        value: 'nonExistent'
      };
      const result = resolver(resolvable, data, context, []);
      expect(result).to.be.null;
    });
  });

  describe('resolve type: fnRefResolve', () => {
    it('should return a reference to a function returned by resolving a resolvable', () => {
      const resolvable = {
        type: 'fnRefResolve',
        value: {
          type: 'fn',
          value: 'funcFactory',
          args: [ { type: 'lookup', value: 'my fnRef' } ]
        }
      };
      const result = resolver(resolvable, data, context, []);
      expect(result).to.be.a('function');
    });

    it('should return null if the fnRef returned by a resolvable is not a function', () => {
      const resolvable = {
        type: 'fnRefResolve',
        value: {
          type: 'fn',
          value: 'oneArgFunc',
          args: [ {type: 'lookup', value: 'my fnRef' } ]
        }
      };
      const result = resolver(resolvable, data, context, []);
      expect(result).to.be.null;
    });
  });

  describe('Resolve arrays', () => {
    it('should return an empty array for resolving an empty array', () => {
      expect(resolver([], data, context, [])).to.eql([]);
    });

    it('should return an array with all items resolved when all members are valid resolvables', () => {
      const resolvable = [
        { type: 'literal', value: 1 },
        { type: 'lookup', value: '$' },
        { type: 'lookup', value: '$value' }
      ];
      const result = resolver(resolvable, data, context, '$.personal_details.name.title');
      expect(result).to.eql([1, genTestData(), 'miss']);
    });

    xit('should return an array with non-resolvables alongside resolved values when members are a mix of resolvable and non-resolvable', () => {
      const resolvable = [
        { type: 'literal', value: 1 },
        'a string',
        { type: 'lookup', value: '$' },
        { type: 'lookup', value: '$value' }
      ];
      const result = resolver(resolvable, data, context, '$.personal_details.name.title');
      expect(result).to.eql([1, 'a string', genTestData(), 'miss']);
    });
  });
});

function genTestContext() {
  return {
    noArgFunc: function () { return 'noArgFunc'; },
    oneArgFunc: function (arg1) { return 'arg: ' + arg1; },
    funcFactory: function(arg1) { return function() { return 'factory for: ' + arg1;}}
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
        { value: 1000, description: 'Robot', depreciations: [100, 90, 81]},
        { value: 1000000, description: 'Part ownership of studio apartment in London', depreciations: [-30000, -50000, -100000]}
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
