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

  describe('resolvable: literal', () => {
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

  describe('resolvable: lookup', () => {
    
  });

  describe('resolvable: fn', () => {
    
  });

  describe('resolvable: fnRefLookup', () => {
    
  });

  describe('resolvable: fnRefResolve', () => {
    
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
