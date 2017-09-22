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

    it('should fail validation for an object when value is not string if type is fnRefLookup', () => {
      expect(() => resolver({ type: 'fnRefLookup', value: {} }, {}, context, [])).to.throw(TypeError, 'Cannot resolve an object with a non-string value when type is fnRefLookup. Please see documentation for correct resolvable format');
    });

    it('should fail validation for an object when value is not resolvable if type is fnRefResolve', () => {
      expect(() => resolver({ type: 'fnRefResolve', value: {} }, {}, context, [])).to.throw(TypeError, 'Cannot resolve an object with a non-resolvable value when type is fnRefResolve. Please see documentation for correct resolvable format');
    });
  });

  describe('resolve type: literal', () => {
    
  });

  describe('resolve type: lookup', () => {
    
  });

  describe('resolve type: fn', () => {
    
  });

  describe('resolve type: fnRefLookup', () => {
    
  });

  describe('resolve type: fnRefResolve', () => {
    
  });

  describe('resolve: array of all resolvables', () => {
    
  });

  describe('resolve: object of all resolvables', () => {
    
  });

  describe('resolve array of resolvable and non-resolvables', () => {
    
  });

  describe('resolve object of resolvable and non-resolvable', () => {
    
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
